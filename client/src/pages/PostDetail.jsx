import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePostStore from '../stores/postStore.js';
import PostDetailComp from '../components/posts/PostDetail.jsx';
import ReplyList from '../components/replies/ReplyList.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const PostDetail = () => {
  const { id } = useParams();
  const { currentPost, isLoading, fetchPost } = usePostStore();

  useEffect(() => {
    fetchPost(id);
  }, [id]);

  if (isLoading) return <LoadingSpinner className="min-h-screen" size="lg" />;
  if (!currentPost) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-500">
      Post not found.
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to feed
      </Link>
      <PostDetailComp post={currentPost} />
      <ReplyList postId={id} />
    </div>
  );
};

export default PostDetail;