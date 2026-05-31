import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/posts/CreatePostForm.jsx';

const CreatePost = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Ask the community</h1>
      <p className="text-slate-400 mb-6">Be specific about what you need — course, chapter, and file type.</p>
      <div className="card">
        <CreatePostForm onSuccess={(post) => navigate(`/posts/${post._id}`)} />
      </div>
    </div>
  );
};

export default CreatePost;