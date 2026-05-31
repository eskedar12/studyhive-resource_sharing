import { useState } from 'react';
import { X } from 'lucide-react';
import postService from '../../services/postService.js';
import toast from 'react-hot-toast';

const EditPostForm = ({ post, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    title: post.title || '',
    body: post.body || '',
    course: post.course || '',
    semester: post.semester || 'Fall 2025',
    tags: post.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addTag = () => {
    const t = tagInput.trim().replace('#', '');
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await postService.updatePost(post._id, form);
      toast.success('Post updated');
      onSuccess?.(updated);
    } catch {
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="input-field"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Title"
      />
      <textarea
        className="input-field min-h-[100px] resize-y"
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        placeholder="Details"
      />
      <input
        className="input-field"
        value={form.course}
        onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
        placeholder="Course"
      />
      <div className="flex gap-2">
        <input
          className="input-field flex-1"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder="Add tag"
        />
        <button type="button" onClick={addTag} className="btn-secondary">Add</button>
      </div>
      {form.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {form.tags.map((t) => (
            <span key={t} className="tag-badge flex items-center gap-1">
              #{t}
              <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default EditPostForm;