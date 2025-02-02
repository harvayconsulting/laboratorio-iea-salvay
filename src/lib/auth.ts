import { create } from 'zustand';
import { User } from './supabase';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
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