import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { FarmerProfile } from '@/types';
import { getStoredFarmer, saveStoredFarmer, DEFAULT_FARMER } from '@/lib/mock-data';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User | null;
  session?: Session | null;
}

const AUTH_STATUS_STORAGE_KEY = 'agriai_auth_status';
let memoryAuthStatus: string | null = null;
let memoryUser: User | null = null;

interface RegisteredUserEntry {
  email: string;
  password: string;
  user: User;
  profile: FarmerProfile;
}

const memoryRegisteredUsers: Record<string, RegisteredUserEntry> = {};

function getRegisteredUser(email: string): RegisteredUserEntry | null {
  const cleanEmail = email.trim().toLowerCase();
  if (memoryRegisteredUsers[cleanEmail]) {
    return memoryRegisteredUsers[cleanEmail];
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`agriai_reg_user_${cleanEmail}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      return null;
    }
  }
  return null;
}

function saveRegisteredUser(entry: RegisteredUserEntry) {
  const cleanEmail = entry.email.trim().toLowerCase();
  memoryRegisteredUsers[cleanEmail] = entry;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`agriai_reg_user_${cleanEmail}`, JSON.stringify(entry));
    } catch (err) {
      console.warn('Failed to store registered user locally:', err);
    }
  }
}

/**
 * Checks if a session is currently active.
 * Uses Supabase Auth session if configured, or local session state.
 */
export async function getSession(): Promise<Session | null> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.getSession();
        if (!error && data.session) {
          return data.session;
        }
      } catch (err) {
        console.warn('Error fetching Supabase session:', err);
      }
    }
  }

  // Fallback for demo / custom authenticated mode
  const status = typeof window !== 'undefined'
    ? localStorage.getItem(AUTH_STATUS_STORAGE_KEY)
    : memoryAuthStatus;

  if (status === 'demo_authenticated') {
    const userToReturn = memoryUser || ({
      id: '00000000-0000-0000-0000-000000000001',
      app_metadata: {},
      user_metadata: { name: 'Arjun Singh' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'farmer@agriai.demo',
    } as unknown as User);

    return {
      access_token: 'demo-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'demo-refresh',
      user: userToReturn,
    } as Session;
  }

  if (status === 'custom_authenticated' && memoryUser) {
    return {
      access_token: 'custom-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'custom-refresh',
      user: memoryUser,
    } as Session;
  }

  return null;
}

/**
 * Returns the currently authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.getUser();
        if (!error && data.user) {
          return data.user;
        }
      } catch (err) {
        console.warn('Error fetching Supabase user:', err);
      }
    }
  }

  const session = await getSession();
  return session?.user || null;
}

/**
 * 1. SIGN IN with Email & Password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: 'Please provide both email and password.' };
  }

  // 1. If Supabase is configured, authenticate with real Supabase Auth
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          let userMessage = error.message;
          if (error.message.includes('Invalid login credentials')) {
            userMessage = 'Invalid email or password. If you are a new farmer, please create an account first.';
          } else if (error.message.includes('Email not confirmed')) {
            userMessage = 'Please verify your email address before signing in. Check your inbox for the confirmation link.';
          }
          return { success: false, error: userMessage };
        }

        if (data.user) {
          const { setActiveUserId } = await import('@/lib/mock-data');
          setActiveUserId(data.user.id);

          await syncAuthenticatedFarmer(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_STATUS_STORAGE_KEY, 'supabase_authenticated');
            window.dispatchEvent(new Event('agriai:auth-changed'));
          }
          return { success: true, user: data.user, session: data.session };
        }
      } catch (err) {
        console.error('Supabase signIn exception:', err);
        return { success: false, error: 'A network error occurred while connecting to Supabase Auth.' };
      }
    }
  }

  // 2. Demo fallback authentication for prototype demo access
  if (cleanEmail === 'farmer@agriai.demo' && password === 'demo123') {
    const demoUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: cleanEmail,
      user_metadata: { name: 'Arjun Singh' },
    } as unknown as User;
    memoryAuthStatus = 'demo_authenticated';
    memoryUser = demoUser;
    const { setActiveUserId, saveStoredFarms, saveStoredFarmer, DEFAULT_FARMS, DEFAULT_FARMER } = await import('@/lib/mock-data');
    setActiveUserId('00000000-0000-0000-0000-000000000001');
    saveStoredFarmer(DEFAULT_FARMER, '00000000-0000-0000-0000-000000000001');
    saveStoredFarms(DEFAULT_FARMS, '00000000-0000-0000-0000-000000000001');

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STATUS_STORAGE_KEY, 'demo_authenticated');
      window.dispatchEvent(new Event('agriai:auth-changed'));
    }
    return {
      success: true,
      user: demoUser,
    };
  }

  // 3. Local registered user authentication (offline/mock support)
  const registered = getRegisteredUser(cleanEmail);
  if (registered && registered.password === password) {
    memoryAuthStatus = 'custom_authenticated';
    memoryUser = registered.user;
    const { setActiveUserId, saveStoredFarmer } = await import('@/lib/mock-data');
    setActiveUserId(registered.user.id);
    saveStoredFarmer(registered.profile, registered.user.id);

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STATUS_STORAGE_KEY, 'custom_authenticated');
      window.dispatchEvent(new Event('agriai:auth-changed'));
    }
    return {
      success: true,
      user: registered.user,
    };
  }

  return {
    success: false,
    error: 'Invalid email or password. If you are a new farmer, please create an account first.',
  };
}

/**
 * 2. SIGN UP with Name, Email & Password
 */
export async function signUp(name: string, email: string, password: string): Promise<AuthResponse> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
              location: '',
            },
          },
        });

        if (error) {
          let userMessage = error.message;
          if (error.message.includes('User already registered')) {
            userMessage = 'An account with this email address already exists. Please sign in instead.';
          } else if (error.message.includes('weak_password')) {
            userMessage = 'Password is too weak. Please use at least 6 characters.';
          }
          return { success: false, error: userMessage };
        }

        if (data.user) {
          const { setActiveUserId, saveStoredFarms, saveStoredFarmer } = await import('@/lib/mock-data');
          setActiveUserId(data.user.id);
          saveStoredFarms([], data.user.id);

          const initialProfile: FarmerProfile = {
            name: cleanName,
            email: cleanEmail,
            phone: '',
            location: '',
            state: '',
            district: '',
            farmSizeAcres: 0,
            primaryCrop: '',
            soilType: '',
            preferredLanguage: 'en',
          };
          saveStoredFarmer(initialProfile, data.user.id);

          // If session is active (email confirmation disabled or auto-confirmed)
          if (data.session) {
            try {
              await client.from('farmers').upsert({
                id: data.user.id,
                name: cleanName,
                location: '',
                farm_size: 0,
                preferred_language: 'en',
              });
            } catch (profileErr) {
              console.warn('Profile upsert notice:', profileErr);
            }

            await syncAuthenticatedFarmer(data.user, cleanName);

            if (typeof window !== 'undefined') {
              localStorage.setItem(AUTH_STATUS_STORAGE_KEY, 'supabase_authenticated');
              window.dispatchEvent(new Event('agriai:auth-changed'));
            }

            return { success: true, user: data.user, session: data.session };
          }

          // If session is null, email verification is required by Supabase
          return { success: true, user: data.user, session: null };
        }
      } catch (err) {
        console.error('Supabase signUp exception:', err);
        return { success: false, error: 'A network error occurred during registration.' };
      }
    }
  }

  // Fallback sign-up for development without active Supabase
  const newUserId = `user-${Date.now()}`;
  const newProfile: FarmerProfile = {
    name: cleanName,
    email: cleanEmail,
    phone: '',
    location: '',
    state: '',
    district: '',
    farmSizeAcres: 0,
    primaryCrop: '',
    soilType: '',
    preferredLanguage: 'en',
  };

  const newUser = {
    id: newUserId,
    email: cleanEmail,
    user_metadata: { name: cleanName },
  } as unknown as User;

  saveRegisteredUser({
    email: cleanEmail,
    password,
    user: newUser,
    profile: newProfile,
  });

  memoryAuthStatus = 'custom_authenticated';
  memoryUser = newUser;
  const { setActiveUserId, saveStoredFarms, saveStoredFarmer } = await import('@/lib/mock-data');
  setActiveUserId(newUser.id);
  saveStoredFarmer(newProfile, newUser.id);
  saveStoredFarms([], newUser.id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STATUS_STORAGE_KEY, 'custom_authenticated');
    window.dispatchEvent(new Event('agriai:auth-changed'));
  }

  return {
    success: true,
    user: newUser,
    session: {
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh',
      user: newUser,
    } as Session,
  };
}

/**
 * 3. SIGN OUT
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
  }

  memoryAuthStatus = null;
  memoryUser = null;

  const { setActiveUserId } = await import('@/lib/mock-data');
  setActiveUserId(null);

  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STATUS_STORAGE_KEY);
    window.dispatchEvent(new Event('agriai:auth-changed'));
    window.dispatchEvent(new Event('agriai:farms-updated'));
  }

  return { success: true };
}

/**
 * Helper: Sync authenticated farmer record to local cache and profile state.
 */
async function syncAuthenticatedFarmer(user: User, fallbackName?: string): Promise<FarmerProfile> {
  const currentFarmer = getStoredFarmer(user.id);
  const userName = user.user_metadata?.name || fallbackName || currentFarmer.name || 'Farmer';
  const userEmail = user.email || currentFarmer.email;

  let location = currentFarmer.location || '';
  let farmSize = currentFarmer.farmSizeAcres ?? 0;
  let preferredLanguage = currentFarmer.preferredLanguage || 'en';

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data: farmerRow } = await client
          .from('farmers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (farmerRow) {
          location = farmerRow.location;
          farmSize = Number(farmerRow.farm_size) || farmSize;
          preferredLanguage = farmerRow.preferred_language || preferredLanguage;
        } else {
          await client.from('farmers').upsert({
            id: user.id,
            name: userName,
            location,
            farm_size: farmSize,
            preferred_language: preferredLanguage === 'English' ? 'en' : preferredLanguage,
          });
        }
      } catch (err) {
        console.warn('Could not query farmer row for sync:', err);
      }
    }
  }

  const updatedProfile: FarmerProfile = {
    name: userName,
    email: userEmail,
    phone: currentFarmer.phone || '',
    location,
    state: currentFarmer.state || '',
    district: currentFarmer.district || '',
    farmSizeAcres: farmSize,
    primaryCrop: currentFarmer.primaryCrop || '',
    soilType: currentFarmer.soilType || '',
    preferredLanguage,
  };

  saveStoredFarmer(updatedProfile, user.id);
  return updatedProfile;
}

/**
 * Registers an auth state listener.
 */
export function onAuthStateChange(callback: (event: AuthChangeEvent | string, session: Session | null) => void) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      const { data } = client.auth.onAuthStateChange(callback);
      return data.subscription;
    }
  }

  // Fallback for custom event
  if (typeof window !== 'undefined') {
    const listener = async () => {
      const s = await getSession();
      callback('CUSTOM_AUTH_CHANGED', s);
    };
    window.addEventListener('agriai:auth-changed', listener);
    return {
      unsubscribe: () => window.removeEventListener('agriai:auth-changed', listener),
    };
  }

  return { unsubscribe: () => {} };
}

const USER_ROLE_STORAGE_KEY = 'agriai_user_role';

/**
 * Returns the active user role ('farmer' | 'authority' | 'admin').
 */
export function getUserRole(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_ROLE_STORAGE_KEY) || 'farmer';
  }
  return 'farmer';
}

/**
 * Updates the user role for role-based authorization testing.
 */
export function setUserRole(role: 'farmer' | 'authority' | 'admin'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
    window.dispatchEvent(new CustomEvent('agriai:role-changed', { detail: { role } }));
  }
}

/**
 * Checks if the current session has authority/admin privileges.
 */
export async function isAuthorityUser(): Promise<boolean> {
  const role = getUserRole();
  return role === 'authority' || role === 'admin';
}

