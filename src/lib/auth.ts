
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

// Initialize auth state
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
  // First authenticate with Supabase
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: `${username}@example.com`,
    password: password,
  });

  if (authError) throw authError;

  // After successful authentication, get the user data
  const { data: userData } = await supabase
    .from('ieasalvay_usuarios')
    .select('*')
    .eq('user_name', username)
    .eq('password', password)
    .maybeSingle();

  if (userData) {
    useAuth.getState().setUser(userData);
    return userData;
  }

  // If no user data found, sign out from Supabase
  await supabase.auth.signOut();
  return null;
};
