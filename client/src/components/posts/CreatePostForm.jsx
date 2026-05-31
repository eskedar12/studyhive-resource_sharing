import { useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import usePostStore from '../../stores/postStore.js';
import TagBadge from './TagBadge.jsx';
import toast from 'react-hot-toast';

const CreatePostForm = ({ onSuccess }) => {
  const { createPost, isLoading } = usePostStore();
  const [form, setForm] = useState({
    title: '', body: '', course: '', semester: 'Fall 2025', tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState([]);

  const addTag = () => {
    const t = tagInput.trim().replace('#', '');
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('body', form.body);
    fd.append('course', form.course);
    fd.append('semester', form.semester);
    form.tags.forEach((t) => fd.append('tags[]', t));
    files.forEach((f) => fd.append('attachments', f));

    const post = await createPost(fd);
    if (post) {
      toast.success('Post created!');
      onSuccess?.(post);
    } else {
      toast.error('Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Title *</label>
        <input
          className="input-field"
          placeholder="What do you need? e.g. Need DBMS chapter 4 PPT"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Details</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Add more context..."
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Course</label>
          <input
            className="input-field"
            placeholder="e.g. CS304 — Databases"
            value={form.course}
            onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
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

      {/* Tags */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Tags</label>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="#DBMS, #PPT..."
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
                <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* File attach */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Attachments (optional)</label>
        <label className="flex items-center gap-2 cursor-pointer border border-dashed border-slate-700 rounded-lg p-3 text-slate-400 hover:border-sky-600 hover:text-sky-400 transition-colors">
          <Paperclip size={16} />
          <span className="text-sm">Attach files (PDF, images, PPT, Word)</span>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
            onChange={(e) => setFiles([...e.target.files])}
          />
        </label>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {Array.from(files).map((f, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-center gap-1">
                📎 {f.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Posting...' : 'Post Request'}
      </button>
    </form>
  );
};

export default CreatePostForm;