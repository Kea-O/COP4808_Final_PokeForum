import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router"
import { UserProvider } from './components/UserContext.jsx';
import './index.css'
import App from './App.jsx'
import CreateView from './routes/CreateView.jsx'
import PostView from './routes/PostView.jsx'
import EditView from './routes/EditView.jsx'
import LoginView from './routes/LoginView.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import ResetPasswordView from './routes/ResetPasswordView.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/update-password" element={<ResetPasswordView />} />
        {/* Protected Routes:*/}
        <Route path="/create" element={<ProtectedRoute><CreateView /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostView /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditView /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
)
