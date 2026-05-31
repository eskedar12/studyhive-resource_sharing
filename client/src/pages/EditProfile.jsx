import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import api from '../services/api.js';
import useAuthStore from '../stores/authStore.js';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('username', form.username);
      fd.append('bio', form.bio);
      if (avatar) fd.append('avatar', avatar);
      const res = await api.put('/users/me', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data);
      toast.success('Profile updated');
      navigate(`/profile/${user._id}`);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-20 h-20 bg-sky-700 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                {preview
                  ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  : user?.username?.[0]?.toUpperCase()}
              </div>
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-400 transition-colors">
                <Camera size={14} className="text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <input
              className="input-field"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Bio</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="Tell others about yourself..."
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;