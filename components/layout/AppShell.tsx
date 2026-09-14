"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Stethoscope,
  Sparkles,
  CloudSun,
  LineChart,
  Bell,
  User,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  LogOut,
  TrendingUp,
  Building2,
  Award,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Wheat
} from "lucide-react";
import { AgriChatWidget } from "@/components/ui/AgriChatWidget";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getStoredFarmer, DEFAULT_FARMER } from "@/lib/mock-data";
import { getAlerts } from "@/lib/alert-service";
import { getSession, signOut, onAuthStateChange } from "@/lib/auth-service";
import { useOnlineStatus, recordSyncTimestamp } from "@/lib/offline-service";
import { i18nService, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n-service";
import { FarmerProfile } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Farms", href: "/farms", icon: Sprout },
  { name: "Crop Hub", href: "/crop", icon: Wheat, highlight: true },
  {
    name: "AI Crop Doctor",
    href: "/crop-doctor",
    icon: Stethoscope,
    badge: "AI",
  },
  { name: "Smart Advisory", href: "/advisory", icon: Sparkles },
  { name: "Yield Prediction", href: "/yield-prediction", icon: TrendingUp },
  { name: "Weather", href: "/weather", icon: CloudSun },
  { name: "Analytics", href: "/analytics", icon: LineChart },
  { name: "Alerts", href: "/alerts", icon: Bell, hasAlertBadge: true },
  {
    name: "Authority Portal",
    href: "/authority",
    icon: Building2,
    badge: "Admin",
  },
  {
    name: "Impact & Evidence",
    href: "/impact",
    icon: Award,
    badge: "SIH",
  },
  { name: "Profile", href: "/profile", icon: User },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [farmer, setFarmer] = useState<FarmerProfile>(DEFAULT_FARMER);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Real-time Online / Offline Connectivity hook
  const { isOnline, lastSyncedTime, syncAge, wasOffline } = useOnlineStatus();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentLang(i18nService.getCurrentLanguage());
    }
  }, []);

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    i18nService.setLanguage(langCode);
    setCurrentLang(langCode);
    setLangMenuOpen(false);
  };

  // Protected route verification
  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      const session = await getSession();
      if (!session && isMounted) {
        router.push("/login");
        return;
      }
      if (isMounted) {
        setFarmer(getStoredFarmer());
      }
    };

    checkAuthentication();

    const authSub = onAuthStateChange((_event, session) => {
      if (!session && isMounted) {
        router.push("/login");
      } else if (isMounted) {
        setFarmer(getStoredFarmer());
      }
    });

    const handleProfileUpdate = () => {
      if (isMounted) setFarmer(getStoredFarmer());
    };

    window.addEventListener("agriai:profile-updated", handleProfileUpdate);
    window.addEventListener("agriai:auth-changed", handleProfileUpdate);

    return () => {
      isMounted = false;
      if (authSub && typeof authSub.unsubscribe === "function") {
        authSub.unsubscribe();
      }
      window.removeEventListener("agriai:profile-updated", handleProfileUpdate);
      window.removeEventListener("agriai:auth-changed", handleProfileUpdate);
    };
  }, [router]);

  useEffect(() => {
    const updateUnread = () => {
      const alerts = getAlerts();
      setUnreadCount(alerts.filter((a) => !a.read).length);
    };

    updateUnread();
    window.addEventListener("agriai:alerts-updated", updateUnread);
    return () => window.removeEventListener("agriai:alerts-updated", updateUnread);
  }, [pathname]);

  const handleManualSync = () => {
    recordSyncTimestamp();
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-50/75 dark:bg-zinc-950 flex flex-col antialiased text-slate-900 dark:text-zinc-100 overflow-x-hidden transition-colors">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border-r border-slate-200/80 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                AgriAI
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  v2.0
                </span>
              </span>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                Smart Crop Advisory
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3.5 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            Farm Management
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : item.highlight
                    ? "text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : item.highlight
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : item.badge === "Admin"
                          ? "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                          : item.badge === "SIH"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          : "bg-emerald-200/80 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.hasAlertBadge && unreadCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white text-emerald-700"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* User Mini Profile in Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-zinc-800">
          <Link
            href="/profile"
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-800/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                {(farmer.name || "Farmer")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "FA"}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-tight truncate max-w-[130px]">
                  {farmer.name || "Farmer"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate max-w-[130px]">
                  {farmer.location || "Location not set"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
          </Link>
          <div className="mt-1 px-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified
            </span>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen min-w-0">
        {/* Offline Status Top Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>
                Offline mode — showing your most recently saved information (Last synchronized: {lastSyncedTime}).
              </span>
            </div>
            <button
              type="button"
              onClick={handleManualSync}
              className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync</span>
            </button>
          </div>
        )}

        {/* Reconnected Toast */}
        {wasOffline && isOnline && (
          <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Back online — Farm telemetry and weather synchronized.</span>
          </div>
        )}

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 capitalize tracking-tight">
                {pathname.replace("/", "").replace("-", " ") || "Dashboard"}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block">
                {farmer.location || "Ludhiana, Punjab"} • Active Season
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700 transition-colors"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{currentLangObj.nativeName}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-2.5 py-1">
                    Select Language
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          currentLang === lang.code
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle />

            {/* Online/Offline Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-[11px] font-semibold text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Offline ({syncAge})</span>
                </>
              )}
            </div>

            {/* Alerts icon */}
            <Link
              href="/alerts"
              className="relative p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900"></span>
              )}
            </Link>

            {/* Quick Profile Avatar */}
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-2xs hover:ring-2 hover:ring-emerald-500/30 transition-all"
            >
              {(farmer.name || "Arjun Singh")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "AS"}
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-zinc-800 px-2 py-1.5 flex items-center justify-around">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold ${
            pathname === "/dashboard" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-400"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/farms"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold ${
            pathname === "/farms" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-400"
          }`}
        >
          <Sprout className="w-4 h-4 mb-0.5" />
          <span>Farms</span>
        </Link>

        <Link
          href="/crop"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${
            pathname === "/crop"
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-emerald-600 dark:text-emerald-400 font-extrabold"
          }`}
        >
          <div className="w-8 h-8 -mt-3 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Wheat className="w-4 h-4" />
          </div>
          <span className="mt-0.5">Crop Hub</span>
        </Link>

        <Link
          href="/crop-doctor"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold ${
            pathname === "/crop-doctor" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-400"
          }`}
        >
          <Stethoscope className="w-4 h-4 mb-0.5" />
          <span>Doctor</span>
        </Link>

        <Link
          href="/advisory"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold ${
            pathname === "/advisory" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-400"
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Advisory</span>
        </Link>
      </nav>

      {/* Floating AI Chat Copilot on all dashboard pages */}
      <AgriChatWidget />
    </div>
  );
}
