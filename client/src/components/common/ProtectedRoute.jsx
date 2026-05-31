import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#0d1425] border border-slate-800 rounded-2xl p-10 text-center max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white mb-3">You need to sign in</h2>
          <p className="text-slate-400 mb-6">
            Join the community to ask for resources and reply to other students.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              state={{ from: location }}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              <LogIn size={16} /> Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={16} /> Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;