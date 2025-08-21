
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsAuthenticated(!!session);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error logging in:', error.message);
      return false;
    }
    return true;
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if(error){
        console.error('Error logging out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
      throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
