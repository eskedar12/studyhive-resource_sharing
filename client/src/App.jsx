import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import CreatePost from './pages/CreatePost.jsx';
import SavedPosts from './pages/SavedPosts.jsx';
import Messages from './pages/Messages.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Search from './pages/Search.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import EditPost from './pages/EditPost.jsx';
import useAuthStore from './stores/authStore.js';
import { useSocketInit } from './hooks/useSocket.js';

// Inner component so hooks run inside BrowserRouter
function AppInner() {
  const { loadUser } = useAuthStore();

  // Initialize socket once for the entire app lifetime
  useSocketInit();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1425',
            color: '#e2e8f0',
            border: '1px solid #1e3a5f',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
