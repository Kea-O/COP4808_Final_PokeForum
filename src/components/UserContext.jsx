import { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create a UserContext to store the userID and make it accessible 
// across other pages.
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    // Look for existing ID
    let savedId = localStorage.getItem('anon_id');
    
    // Create one if it doesn't exist Use crypto.randomUUID() to 
    // generate a unique ID for users.
    if (!savedId) {
      savedId = crypto.randomUUID();
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