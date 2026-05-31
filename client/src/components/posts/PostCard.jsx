import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Bookmark, BookmarkCheck, CheckCircle, Trash2 } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate.js';
import TagBadge from './TagBadge.jsx';
import useAuth from '../../hooks/useAuth.js';
import usePostStore from '../../stores/postStore.js';
import toast from 'react-hot-toast';

const PostCard = ({ post, onDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleSave, markSolved, deletePost } = usePostStore();
  const navigate = useNavigate();
  const isOwner = String(user?._id) === String(post.author?._id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    toggleSave(post._id);
  };

  const handleMarkSolved = (e) => {
    e.preventDefault();
    markSolved(post._id);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deletePost(post._id);
    onDeleted?.(post._id);
    toast.success('Post deleted');
  };

  return (
    <div className="bg-[#0d1425] border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-colors">
      <Link to={`/posts/${post._id}`} className="block">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-sky-700 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
            {post.author?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 min-w-0">
            <span className="font-medium text-slate-300">{post.author?.username}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            {post.course && (
              <>
                <span>·</span>
                <span className="text-sky-400 truncate">{post.course}</span>
              </>
            )}
          </div>
          {post.isSolved && (
            <span className="ml-auto flex items-center gap-1 text-green-400 text-xs font-medium bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">
              <CheckCircle size={11} /> Solved
            </span>
          )}
        </div>

        {/* Title & Body */}
        <h3 className="text-white font-semibold text-base mb-1 leading-snug">{post.title}</h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.body}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {post.semester && <span className="text-xs text-slate-500">{post.semester}</span>}
            {post.tags.slice(0, 4).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </Link>

      {/* Footer — outside Link so buttons don't trigger navigation */}
      <div className="flex items-center gap-4 text-slate-500 text-sm">
        <Link to={`/posts/${post._id}`} className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
          <MessageSquare size={14} />
          {post.replyCount ?? 0} replies
        </Link>

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 transition-colors hover:text-sky-400 ${
            post.isSaved ? 'text-sky-400' : ''
          }`}
        >
          {post.isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {post.isSaved ? 'Saved' : 'Save'}
        </button>

        {isOwner && !post.isSolved && (
          <button
            onClick={handleMarkSolved}
            className="flex items-center gap-1.5 hover:text-green-400 transition-colors"
          >
            <CheckCircle size={14} /> Mark solved
          </button>
        )}

        {isOwner && (
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={(e) => { e.preventDefault(); navigate(`/posts/${post._id}/edit`); }}
              className="text-slate-500 hover:text-sky-400 transition-colors text-xs px-2 py-1 rounded hover:bg-[#111827]"
            >
              Edit
            </button>

            {!confirmDelete ? (
              <button
                onClick={(e) => { e.preventDefault(); setConfirmDelete(true); }}
                className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded hover:bg-[#111827]"
              >
                <Trash2 size={12} /> Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
                <span className="text-red-400 text-xs">Sure?</span>
                <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-xs font-bold">Yes</button>
                <button onClick={(e) => { e.preventDefault(); setConfirmDelete(false); }} className="text-slate-400 text-xs">No</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
