import { Trash2 } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate.js';
import FileAttachment from './FileAttachment.jsx';
import useAuth from '../../hooks/useAuth.js';
import replyService from '../../services/replyService.js';
import toast from 'react-hot-toast';

const ReplyItem = ({ reply, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === reply.author?._id;

  const handleDelete = async () => {
    try {
      await replyService.deleteReply(reply._id);
      onDelete(reply._id);
      toast.success('Reply deleted');
    } catch {
      toast.error('Failed to delete reply');
    }
  };

  return (
    <div className="bg-[#0d1425] border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {reply.author?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-300">{reply.author?.username}</span>
          <span className="text-xs text-slate-500">{timeAgo(reply.createdAt)}</span>
        </div>
        {isOwner && (
          <button onClick={handleDelete} className="text-slate-600 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">{reply.body}</p>

      {reply.attachments?.length > 0 && (
        <div className="mt-3 space-y-2">
          {reply.attachments.map((file, i) => (
            <FileAttachment key={i} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;