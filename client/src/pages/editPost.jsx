import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import postService from '../services/postService.js';
import usePostStore from '../stores/postStore.js';
import toast from 'react-hot-toast';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deletePost } = usePostStore();
  const [form, setForm] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const post = await postService.getPost(id);
        setForm({
          title: post.title || '',
          body: post.body || '',
          course: post.course || '',
          semester: post.semester || 'Fall 2025',
          tags: post.tags || [],
        });
      } catch {
        toast.error('Failed to load post');
        navigate('/');
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim().replace('#', '');
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setIsLoading(true);
    try {
      await postService.updatePost(id, form);
      toast.success('Post updated');
      navigate(`/posts/${id}`);
    } catch {
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await deletePost(id);
    toast.success('Post deleted');
    navigate('/');
  };

  if (isFetching) return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-500">Loading...</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          🗑 Delete post
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What do you need?"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Details</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Add more context..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Course</label>
              <input
                className="input-field"
                value={form.course}
                onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                placeholder="e.g. CS304 — Databases"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Semester</label>
              <select
                className="input-field"
                value={form.semester}
                onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
              >
                {['Fall 2025', 'Spring 2026', 'Summer 2025', 'Fall 2024'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              />
              <button type="button" onClick={addTag} className="btn-secondary px-4">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag-badge flex items-center gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
