import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CheckCircle, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate.js';
import TagBadge from './TagBadge.jsx';
import useAuth from '../../hooks/useAuth.js';
import usePostStore from '../../stores/postStore.js';
import toast from 'react-hot-toast';

const PostDetail = ({ post }) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleSave, markSolved, deletePost } = usePostStore();
  const navigate = useNavigate();
  const isOwner = String(user?._id) === String(post.author?._id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    await deletePost(post._id);
    toast.success('Post deleted');
    navigate('/');
  };

  return (
    <div className="bg-[#0d1425] border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-sky-700 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
          {post.author?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-300">{post.author?.username}</p>
          <p className="text-xs text-slate-500">
            {timeAgo(post.createdAt)} {post.course && `· ${post.course}`}
          </p>
        </div>

        {post.isSolved && (
          <span className="ml-auto flex items-center gap-1 text-green-400 text-sm font-medium bg-green-400/10 px-3 py-1 rounded-full">
            <CheckCircle size={14} /> Solved
          </span>
        )}
      </div>

      <h1 className="text-xl font-bold text-white mb-3">{post.title}</h1>
      <p className="text-slate-300 mb-4 leading-relaxed">{post.body}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {post.semester && <span className="text-xs text-slate-500">{post.semester}</span>}
          {post.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}

      {/* Attachments */}
      {post.attachments?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {post.attachments.map((file, i) => (
              <a
                key={i}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-sky-400 hover:border-sky-700 transition-colors"
              >
                📎 {file.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-800 flex-wrap">
        <span className="flex items-center gap-1.5 text-slate-500 text-sm">
          <MessageSquare size={14} /> {post.replyCount ?? 0} replies
        </span>

        {isAuthenticated && (
          <button
            onClick={() => toggleSave(post._id)}
            className={`flex items-center gap-1.5 text-sm transition-colors hover:text-sky-400 ${
              post.isSaved ? 'text-sky-400' : 'text-slate-500'
            }`}
          >
            {post.isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {post.isSaved ? 'Saved' : 'Save'}
          </button>
        )}

        {isOwner && !post.isSolved && (
          <button
            onClick={() => markSolved(post._id)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-green-400 transition-colors"
          >
            <CheckCircle size={14} /> Mark solved
          </button>
        )}

        {/* Owner actions: Edit + Delete */}
        {isOwner && (
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate(`/posts/${post._id}/edit`)}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#111827]"
            >
              <Edit2 size={14} /> Edit
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#111827]"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5">
                <span className="text-red-400 text-sm">Delete this post?</span>
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
