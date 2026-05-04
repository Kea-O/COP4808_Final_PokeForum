import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // While checking the Supabase session, show a loading screen:
  if (loading) {
    return <div className="loading">Checking session...</div>;
  }

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, send them to the page they asked for
  return children;
};

export default ProtectedRoute;