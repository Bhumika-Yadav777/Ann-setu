
import {  useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { AuthContext } from './AuthContext.js';


export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Session error:', error.message);
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
  }
};
  return (
    <AuthContext.Provider value={{ session, user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
