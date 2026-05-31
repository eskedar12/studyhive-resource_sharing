import { useEffect, useState } from 'react';
import replyService from '../../services/replyService.js';
import ReplyItem from './ReplyItem.jsx';
import ReplyForm from './ReplyForm.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import useAuth from '../../hooks/useAuth.js';

const ReplyList = ({ postId }) => {
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await replyService.getReplies(postId);
        setReplies(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleNewReply = (reply) => setReplies((r) => [...r, reply]);
  const handleDelete = (id) => setReplies((r) => r.filter((x) => x._id !== id));

  return (
    <div className="mt-6">
      <h3 className="text-slate-300 font-semibold mb-4 text-sm">
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h3>

      {isLoading ? (
        <LoadingSpinner className="py-8" />
      ) : (
        <div className="space-y-3">
          {replies.map((reply) => (
            <ReplyItem key={reply._id} reply={reply} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-6">
          <ReplyForm postId={postId} onReply={handleNewReply} />
        </div>
      )}
    </div>
  );
};

export default ReplyList;