
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
    // If user is null, sign out from Supabase
    if (!user) {
      supabase.auth.signOut();
    }
  },
}));

// Initialize auth state and set up session handling
supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (session?.user?.id) {
    const { data: userData } = await supabase
      .from('ieasalvay_usuarios')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (userData) {
      useAuth.getState().setUser(userData);
    }
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user?.id) {
    const { data: userData } = await supabase
      .from('ieasalvay_usuarios')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (userData) {
      useAuth.getState().setUser(userData);
    }
  } else if (event === 'SIGNED_OUT') {
    useAuth.getState().setUser(null);
  }
});

// Export a function to handle sign-in
export const signIn = async (username: string, password: string) => {
  const { data: userData } = await supabase
    .from('ieasalvay_usuarios')
    .select('*')
    .eq('user_name', username)
    .eq('password', password)
    .maybeSingle();

  if (userData) {
    // Create a Supabase session
    const { error } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`, // Using username as email for Supabase auth
      password: password,
    });

    if (error) throw error;

    useAuth.getState().setUser(userData);
    return userData;
  }

  return null;
};
