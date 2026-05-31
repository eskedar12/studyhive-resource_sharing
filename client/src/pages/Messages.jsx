import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Edit, X, Search } from 'lucide-react';
import useChatStore from '../stores/chatStore.js';
import ChatList from '../components/chat/ChatList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import api from '../services/api.js';

const Messages = () => {
  const { userId } = useParams();
  const { conversations, fetchConversations, isLoading } = useChatStore();
  const [activeUser, setActiveUser] = useState(null);

  // New conversation modal state
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId && conversations.length > 0) {
      const conv = conversations.find((c) => c.user._id === userId);
      if (conv) setActiveUser(conv.user);
    }
  }, [userId, conversations]);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (showNewMsg) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearchQ('');
      setSearchResults([]);
    }
  }, [showNewMsg]);

  // Debounced user search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!searchQ.trim()) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get('/users/search', { params: { q: searchQ } });
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQ]);

  const startConversation = (user) => {
    setActiveUser(user);
    setShowNewMsg(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare size={22} className="text-sky-400" /> Messages
      </h1>

      <div className="bg-[#0d1425] border border-slate-800 rounded-2xl overflow-hidden flex" style={{ height: '70vh' }}>
        {/* Sidebar */}
        <div className="w-72 border-r border-slate-800 shrink-0 flex flex-col">
          {/* Sidebar header with New Message button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="font-semibold text-white">Messages</span>
            <button
              onClick={() => setShowNewMsg(true)}
              title="New message"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-sky-400 hover:bg-[#1a2640] transition-colors"
            >
              <Edit size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <LoadingSpinner className="py-16" />
            ) : (
              <ChatList
                conversations={conversations}
                activeId={activeUser?._id}
                onSelect={setActiveUser}
              />
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1">
          {activeUser ? (
            <ChatWindow otherUser={activeUser} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
              <MessageSquare size={48} className="text-slate-700" />
              <p>Select a conversation to start messaging</p>
              <button
                onClick={() => setShowNewMsg(true)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Edit size={14} /> New Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewMsg(false)} />
          <div className="relative bg-[#0d1425] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white">New Message</h2>
              <button
                onClick={() => setShowNewMsg(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search input */}
            <div className="px-5 py-3 border-b border-slate-800">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  ref={searchRef}
                  className="w-full bg-[#111827] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Search by username..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto">
              {searching && (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
                </div>
              )}

              {!searching && searchQ && searchResults.length === 0 && (
                <p className="text-center text-slate-500 text-sm py-8">No users found for "{searchQ}"</p>
              )}

              {!searching && !searchQ && (
                <p className="text-center text-slate-600 text-sm py-8">Type a username to search</p>
              )}

              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => startConversation(user)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#111827] transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                      : user.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 text-sm">{user.username}</p>
                    {user.bio && <p className="text-xs text-slate-500 truncate max-w-xs">{user.bio}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
