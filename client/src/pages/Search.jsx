import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, X, Loader } from 'lucide-react';
import searchService from '../services/searchService.js';
import PostCard from '../components/posts/PostCard.jsx';
import TagBadge from '../components/posts/TagBadge.jsx';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    if (!q?.trim()) { setResults(null); return; }
    setIsLoading(true);
    try {
      const data = await searchService.search(q.trim());
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setResults({ posts: [], users: [], tags: [], courses: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search as user types — no need to press Enter
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults(null); return; }
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Also run on URL param (e.g. clicking a tag from another page)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== query) {
      setQuery(q);
      doSearch(q);
    }
  }, [searchParams.get('q')]);

  const handleSearch = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    doSearch(query);
  };

  const totalResults = (results?.posts?.length || 0) + (results?.users?.length || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">Search</h1>
      <p className="text-slate-400 text-sm mb-6">Search by keyword, course, tag or username.</p>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          className="input-field pl-11 pr-10 text-base py-3"
          placeholder="e.g. DBMS, #PPT, calculus final..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {isLoading && (
          <Loader size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 animate-spin" />
        )}
        {query && !isLoading && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Results */}
      {results && !isLoading && (
        <div className="space-y-8">

          {/* Tags */}
          {results.tags?.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map(({ tag, count }) => (
                  <TagBadge
                    key={tag}
                    tag={`#${tag} · ${count}`}
                    onClick={() => setQuery(`#${tag}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {results.courses?.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Courses</h2>
              <div className="flex flex-wrap gap-2">
                {results.courses.map((course) => (
                  <button
                    key={course}
                    onClick={() => setQuery(course)}
                    className="bg-[#1a2640] text-slate-300 text-sm px-4 py-1.5 rounded-lg border border-slate-700 hover:border-sky-700 hover:text-sky-300 transition-colors"
                  >
                    {course}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {results.users?.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Users ({results.users.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="flex items-center gap-3 bg-[#0d1425] border border-slate-800 hover:border-slate-600 rounded-xl p-3 transition-colors"
                  >
                    <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        : user.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-200 text-sm">{user.username}</p>
                      {user.bio && <p className="text-xs text-slate-500 truncate">{user.bio}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {results.posts?.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Posts ({results.posts.length})
              </h2>
              <div className="space-y-3">
                {results.posts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </div>
          )}

          {/* No results */}
          {totalResults === 0 && (
            <div className="text-center py-16">
              <SearchIcon size={40} className="mx-auto mb-3 text-slate-700" />
              <p className="text-slate-400">No results for <span className="text-white">"{query}"</span></p>
              <p className="text-sm mt-1 text-slate-600">Try a different keyword, course name, or #tag</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!results && !isLoading && (
        <div className="text-center text-slate-600 py-16">
          <SearchIcon size={48} className="mx-auto mb-4" />
          <p className="text-slate-500">Start typing to search</p>
        </div>
      )}
    </div>
  );
};

export default Search;
