import { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import replyService from '../../services/replyService.js';
import toast from 'react-hot-toast';

const ReplyForm = ({ postId, onReply }) => {
  const [body, setBody] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('body', body);
      files.forEach((f) => fd.append('attachments', f));
      const reply = await replyService.createReply(postId, fd);
      onReply(reply);
      setBody('');
      setFiles([]);
      toast.success('Reply posted');
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d1425] border border-slate-800 rounded-xl p-4">
      <textarea
        className="input-field min-h-[80px] resize-y mb-3"
        placeholder="Share a resource or help out..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-sky-400 text-sm transition-colors">
          <Paperclip size={16} />
          <span>Attach file</span>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
            onChange={(e) => setFiles([...e.target.files])}
          />
        </label>
        {files.length > 0 && (
          <span className="text-xs text-slate-400">{files.length} file(s) selected</span>
        )}
        <button
          type="submit"
          disabled={isLoading || !body.trim()}
          className="flex items-center gap-2 btn-primary disabled:opacity-50"
        >
          <Send size={14} />
          {isLoading ? 'Posting...' : 'Reply'}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;