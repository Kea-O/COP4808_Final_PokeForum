import { createContext, useEffect, useState } from 'react';
import { supabase } from '../client'

// Create a UserContext to store the userID when a user logins.
export const UserContext = createContext();

export function UserProvider({ children }) {
  // Store the user object in state. This will be generated when the user logins.
  const [user, setUser] = useState(null);

  // Variable to tell if if the data is loading:
  const [loading, setLoading] = useState(true);

  // UseEffect to check if the user is logged in when the page loads. If they
  // are, we get their userID and store it in state.
  useEffect(() => {
    // Check for an active session. If there is one, get the user and store it.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Account for changes in the login state, such as the user logging in or out.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Remove the subscription when the component unmounts.
    return () => subscription.unsubscribe();
  }, []);

  // In the return we pass the user object and the loading state:
  return (
    <UserContext.Provider value={{ user, loading}}>
      {!loading && children}
    </UserContext.Provider>
  );
}