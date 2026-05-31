import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import usePostStore from '../stores/postStore.js';
import useAuth from '../hooks/useAuth.js';
import PostCard from '../components/posts/PostCard.jsx';
import PostFilter from '../components/posts/PostFilter.jsx';
import TagBadge from '../components/posts/TagBadge.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import useInfiniteScroll from '../hooks/useInfiniteScroll.js';
import { POPULAR_TAGS } from '../utils/constants.js';

const Home = () => {
  const { posts, filter, isLoading, hasMore, setFilter, fetchPosts } = usePostStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    fetchPosts(true);
  }, [filter]);

  const loaderRef = useInfiniteScroll(() => fetchPosts(), hasMore && !isLoading);

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Hero */}
          <div className="bg-gradient-to-br from-[#0d1f3c] to-[#0d1425] border border-slate-800 rounded-2xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to StudyHive</h1>
            <p className="text-slate-400 mb-6">
              Ask for the notes, PPTs, PDFs or past exams you need. Help others by sharing what you have.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => isAuthenticated ? navigate('/create') : navigate('/login')}
                className="btn-primary text-base px-6 py-2.5"
              >
                Ask the community
              </button>
              <button
                onClick={() => navigate('/search')}
                className="btn-secondary text-base px-6 py-2.5"
              >
                Browse resources
              </button>
            </div>
          </div>

          {/* Filter + Quick Search */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <PostFilter active={filter} onChange={(f) => setFilter(f)} />
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                className="input-field pl-9"
                placeholder="Quick search..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={handleQuickSearch}
              />
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>

          {isLoading && <LoadingSpinner className="py-8" />}
          <div ref={loaderRef} className="h-4" />
          {!hasMore && posts.length > 0 && (
            <p className="text-center text-slate-600 text-sm py-6">You've reached the end</p>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-72 shrink-0 hidden lg:block space-y-4">
          <div className="card">
            <h3 className="font-semibold text-white mb-3">Popular tags</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                />
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-white mb-3">Community guidelines</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Be specific about course &amp; chapter</li>
              <li>Credit original authors when sharing</li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span> Mark your post solved when helped
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
