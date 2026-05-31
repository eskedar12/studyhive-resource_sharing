import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit2, MessageSquare } from 'lucide-react';
import api from '../services/api.js';
import useAuth from '../hooks/useAuth.js';
import PostCard from '../components/posts/PostCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { formatDate } from '../utils/formatDate.js';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isOwn = currentUser?._id === id;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts?author=${id}`),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data.posts || []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // Remove deleted post from local list immediately
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => String(p._id) !== String(deletedId)));
  };

  if (isLoading) return <LoadingSpinner className="min-h-screen" size="lg" />;
  if (!profile) return <div className="text-center text-slate-500 py-16">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile card */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-sky-700 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden">
            {profile.avatar
              ? <img src={profile.avatar} alt={profile.username} className="w-full h-full rounded-full object-cover" />
              : profile.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{profile.username}</h1>
            {profile.bio && <p className="text-slate-400 text-sm mt-1">{profile.bio}</p>}
            <p className="text-slate-500 text-xs mt-2">Joined {formatDate(profile.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            {isOwn ? (
              <Link to="/profile/edit" className="btn-secondary text-sm px-3 py-2 flex items-center gap-2">
                <Edit2 size={14} /> Edit
              </Link>
            ) : (
              <button
                onClick={() => navigate(`/messages/${id}`)}
                className="btn-primary text-sm px-3 py-2 flex items-center gap-2"
              >
                <MessageSquare size={14} /> Message
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-slate-300 font-semibold mb-4">
        Posts ({posts.length})
      </h2>
      {posts.length === 0 ? (
        <p className="text-slate-500 text-sm">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
