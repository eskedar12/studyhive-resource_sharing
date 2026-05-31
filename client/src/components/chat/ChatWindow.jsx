import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import useChatStore from '../../stores/chatStore.js';
import useAuth from '../../hooks/useAuth.js';
import { Link } from 'react-router-dom';

const ChatWindow = ({ otherUser }) => {
  const { messages, isLoading, fetchMessages, sendMessage, typingUsers, resetUnread } = useChatStore();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const isTyping = typingUsers[String(otherUser?._id)];

  useEffect(() => {
    if (otherUser?._id) {
      fetchMessages(otherUser._id);
      resetUnread(otherUser._id); // clear unread badge when opening chat
    }
  }, [otherUser?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (content) => {
    await sendMessage(otherUser._id, content);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800">
        <div className="w-9 h-9 bg-sky-700 rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
          {otherUser?.avatar
            ? <img src={otherUser.avatar} alt={otherUser.username} className="w-full h-full object-cover" />
            : otherUser?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <Link
            to={`/profile/${otherUser?._id}`}
            className="font-semibold text-white hover:text-sky-400 transition-colors"
          >
            {otherUser?.username}
          </Link>
          <p className="text-xs text-slate-500 h-4">
            {isTyping
              ? <span className="text-sky-400 animate-pulse">typing...</span>
              : <span>Student</span>}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-12">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={String(msg.sender?._id || msg.sender) === String(user?._id)}
            />
          ))
        )}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <MessageInput
          otherUserId={String(otherUser?._id)}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
