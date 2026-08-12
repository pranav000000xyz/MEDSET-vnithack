'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type Profile } from './supabase';
import { authenticate, type DemoUser } from './auth';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  legacyUser: DemoUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [legacyUser, setLegacyUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      console.error('Unable to load profile', error);
      setProfile(null);
      return;
    }
    setProfile(data as Profile | null);
  };

  useEffect(() => {
    let active = true;

    // Check for legacy developer session in localStorage (compatibility layer)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('medset-user');
        if (stored) {
          const parsed = JSON.parse(stored) as DemoUser;
          if (parsed && parsed.role === 'Developer' && parsed.active) {
            setLegacyUser(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Invalid localStorage data, ignore
      }
    }

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      if (active) setLoading(false);
    };

    void initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      if (typeof window !== 'undefined' && localStorage.getItem('medset-user')) return;
      setSession(nextSession);
      if (nextSession?.user) {
        void loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
      if (event !== 'INITIAL_SESSION') setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    profile,
    legacyUser,
    loading,
    signOut: async () => {
      if (typeof window !== 'undefined' && localStorage.getItem('medset-user')) {
        localStorage.removeItem('medset-user');
        setLegacyUser(null);
        window.location.href = '/login';
        return;
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    refreshProfile: async () => {
      if (session?.user) await loadProfile(session.user.id);
    },
  }), [loading, profile, session, legacyUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const defaultContext: AuthContextValue = {
  session: null,
  profile: null,
  legacyUser: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context ?? defaultContext;
}
