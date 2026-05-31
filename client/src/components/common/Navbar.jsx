import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Bookmark, MessageSquare, Bell, User, LogOut, Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useNotificationStore from '../../stores/notificationStore.js';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-[#1a2640] text-white'
      : 'text-slate-400 hover:text-white hover:bg-[#111827]';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🎓</span>
          </div>
          StudyHive
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}>
            <Home size={16} /> Feed
          </Link>
          <Link to="/search" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/search')}`}>
            <Search size={16} /> Search
          </Link>
          <Link to="/saved" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/saved')}`}>
            <Bookmark size={16} /> Saved
          </Link>
          <Link to="/messages" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/messages')}`}>
            <MessageSquare size={16} /> Messages
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} /> Ask
              </Link>

              <Link to="/notifications" className={`relative p-2 rounded-lg transition-colors ${isActive('/notifications')}`}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link to={`/profile/${user._id}`} className={`p-2 rounded-lg transition-colors ${isActive(`/profile/${user._id}`)}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#111827] transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;