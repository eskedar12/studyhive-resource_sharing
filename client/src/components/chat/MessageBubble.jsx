import { timeAgo } from '../../utils/formatDate.js';

const MessageBubble = ({ message, isMine }) => (
  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
        isMine
          ? 'bg-sky-600 text-white rounded-br-md'
          : 'bg-[#111827] text-slate-200 rounded-bl-md border border-slate-800'
      }`}
    >
      <p>{message.content}</p>
      <p className={`text-xs mt-1 ${isMine ? 'text-sky-200' : 'text-slate-500'}`}>
        {timeAgo(message.createdAt)}
      </p>
    </div>
  </div>
);

export default MessageBubble;