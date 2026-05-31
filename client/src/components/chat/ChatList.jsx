import { timeAgo } from '../../utils/formatDate.js';

const ChatList = ({ conversations, activeId, onSelect }) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm py-12 px-4">
        No conversations yet.<br />
        <span className="text-slate-600 text-xs">Click the pencil icon to start one.</span>
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conv) => (
        <button
          key={conv.user._id}
          onClick={() => onSelect(conv.user)}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#111827] transition-colors border-b border-slate-800/50 text-left ${
            activeId === conv.user._id ? 'bg-[#111827]' : ''
          }`}
        >
          <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center font-bold text-white shrink-0 text-sm">
            {conv.user.avatar
              ? <img src={conv.user.avatar} alt={conv.user.username} className="w-full h-full rounded-full object-cover" />
              : conv.user.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-200 text-sm truncate">{conv.user.username}</span>
              {conv.lastMessage && (
                <span className="text-xs text-slate-500 shrink-0 ml-2">{timeAgo(conv.lastMessage.createdAt)}</span>
              )}
            </div>
            {conv.lastMessage && (
              <p className="text-xs text-slate-500 truncate">{conv.lastMessage.content}</p>
            )}
          </div>
          {conv.unread > 0 && (
            <span className="bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">
              {conv.unread}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ChatList;
