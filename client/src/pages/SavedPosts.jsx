import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import postService from '../services/postService.js';
import PostCard from '../components/posts/PostCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import usePostStore from '../stores/postStore.js';

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { posts: storePosts } = usePostStore();

  const load = async () => {
    try {
      const data = await postService.getSavedPosts();
      setPosts(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // When store posts change (e.g. after delete), sync local saved list
  useEffect(() => {
    if (storePosts.length === 0) return;
    setPosts((prev) =>
      prev.filter((p) =>
        // Keep only posts that still exist in the store OR aren't in the store yet
        // (store may not have all posts, so only remove if explicitly gone)
        storePosts.some((sp) => String(sp._id) === String(p._id))
          ? storePosts.find((sp) => String(sp._id) === String(p._id))
          : p
      )
    );
  }, [storePosts]);

  // Listen for deletions directly — remove from local list immediately
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => String(p._id) !== String(deletedId)));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark size={22} className="text-sky-400" />
        <h1 className="text-2xl font-bold text-white">Saved Posts</h1>
        <span className="text-slate-500 text-sm">({posts.length})</span>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : posts.length === 0 ? (
        <div className="card text-center py-16">
          <Bookmark size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No saved posts yet.</p>
          <p className="text-slate-500 text-sm mt-1">Save posts from the feed to find them here.</p>
        </div>
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

export default SavedPosts;
