'use client';

import { useState, useEffect } from 'react';

const LAST_SYNCED_KEY = 'agriai_last_synced_timestamp';

/**
 * Records the current timestamp as the latest successful synchronization point.
 */
export function recordSyncTimestamp(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LAST_SYNCED_KEY, Date.now().toString());
    window.dispatchEvent(new Event('agriai:synced'));
  }
}

/**
 * Returns formatted synchronization age (e.g., "Just now", "15 mins ago", "2 hours ago").
 */
export function getFormattedSyncAge(): string {
  if (typeof window === 'undefined') return 'Just now';
  const saved = localStorage.getItem(LAST_SYNCED_KEY);
  if (!saved) return 'Just now';

  const ts = parseInt(saved, 10);
  if (isNaN(ts)) return 'Just now';

  const diffMinutes = Math.floor((Date.now() - ts) / (1000 * 60));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 min ago';
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}

/**
 * Returns exact clock time of last synchronization (e.g. "11:35 AM").
 */
export function getFormattedSyncTime(): string {
  if (typeof window === 'undefined') return '11:00 AM';
  const saved = localStorage.getItem(LAST_SYNCED_KEY);
  if (!saved) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const ts = parseInt(saved, 10);
  if (isNaN(ts)) return '11:00 AM';

  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * React hook to track real-time online/offline connectivity and synchronization metadata.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [syncAge, setSyncAge] = useState<string>('Just now');
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize state
    setIsOnline(navigator.onLine);
    setLastSyncedTime(getFormattedSyncTime());
    setSyncAge(getFormattedSyncAge());

    // Record initial sync if missing
    if (!localStorage.getItem(LAST_SYNCED_KEY)) {
      recordSyncTimestamp();
    }

    const handleOnline = () => {
      setIsOnline(true);
      recordSyncTimestamp();
      setLastSyncedTime(getFormattedSyncTime());
      setSyncAge('Just now');
      setWasOffline(true);
      setTimeout(() => setWasOffline(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncAge(getFormattedSyncAge());
    };

    const handleSyncEvent = () => {
      setLastSyncedTime(getFormattedSyncTime());
      setSyncAge(getFormattedSyncAge());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('agriai:synced', handleSyncEvent);

    const interval = setInterval(() => {
      setSyncAge(getFormattedSyncAge());
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('agriai:synced', handleSyncEvent);
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    lastSyncedTime,
    syncAge,
    wasOffline,
  };
}
