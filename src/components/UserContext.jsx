import { createContext, useEffect, useState } from 'react';

// Create a UserContext to store the userID and make it accessible 
// across other pages.
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    // Look for existing ID; create one if it doesn't exist.
    let savedId = localStorage.getItem('anon_id');
    
    // Use crypto.randomUUID() to generate a unique ID for users.
    if (!savedId) {
      savedId = Date.now().toString() + Math.floor(Math.random() * 10000).toString();
      localStorage.setItem('anon_id', savedId);
    }
    
    setVisitorId(savedId);
  }, []);

  return (
    <UserContext.Provider value={visitorId}>
      {children}
    </UserContext.Provider>
  );
}