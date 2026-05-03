import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router"
import './index.css'
import App from './App.jsx'
import CreateView from './routes/CreateView.jsx'
import PostView from './routes/PostView.jsx'
import EditView from './routes/EditView.jsx'

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateView />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/edit/:id" element={<EditView />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
)
