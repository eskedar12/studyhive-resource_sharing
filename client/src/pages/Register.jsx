import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Register = () => {
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated]);
  useEffect(() => { return () => clearError(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (form.password !== form.confirm) {
      return setFormError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setFormError('Password must be at least 6 characters');
    }
    await register({ username: form.username, email: form.email, password: form.password });
  };

  const displayError = formError || error;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Join StudyHive</h1>
          <p className="text-slate-400 mt-1">Create your account</p>
        </div>

        <div className="card">
          {displayError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4 text-red-400 text-sm">
              {displayError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <input
                className="input-field"
                placeholder="coolstudent42"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Confirm password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5">
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;