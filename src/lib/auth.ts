
import { create } from 'zustand';
import { User } from './supabase';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    if (!user) {
      supabase.auth.signOut();
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (session?.user?.id) {
    const { data: userData, error } = await supabase
      .from('ieasalvay_usuarios')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (userData && !error) {
      useAuth.getState().setUser(userData);
    }
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user?.id) {
    const { data: userData, error } = await supabase
      .from('ieasalvay_usuarios')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (userData && !error) {
      useAuth.getState().setUser(userData);
    }
  } else if (event === 'SIGNED_OUT') {
    useAuth.getState().setUser(null);
  }
});

// Export a function to handle sign-in
export const signIn = async (username: string, password: string) => {
  try {
    // First check if user exists in our custom users table
    const { data: userData, error: userError } = await supabase
      .from('ieasalvay_usuarios')
      .select('*')
      .eq('user_name', username)
      .eq('password', password)
      .single();

    if (userError || !userData) {
      throw new Error('Invalid credentials');
    }

    // If user exists, proceed with Supabase authentication
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`,
      password: password,
    });

    if (authError) throw authError;

    useAuth.getState().setUser(userData);
    return userData;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};
