import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getSocket } from '../../hooks/useSocket.js';

const MessageInput = ({ onSend, otherUserId }) => {
  const [value, setValue] = useState('');
  const typingRef = useRef(false);
  const stopTypingTimer = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(stopTypingTimer.current), []);

  const emitTyping = (isTyping) => {
    const socket = getSocket();
    if (!socket || !otherUserId) return;
    socket.emit(isTyping ? 'typing_start' : 'typing_stop', otherUserId);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      emitTyping(true);
    }
    // Auto-stop typing after 2s of inactivity
    clearTimeout(stopTypingTimer.current);
    stopTypingTimer.current = setTimeout(() => {
      typingRef.current = false;
      emitTyping(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    // Stop typing indicator immediately on send
    clearTimeout(stopTypingTimer.current);
    typingRef.current = false;
    emitTyping(false);
    onSend(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="input-field flex-1"
        placeholder="Type a message..."
        value={value}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="btn-primary px-4 disabled:opacity-50"
      >
        <Send size={16} />
      </button>
    </form>
  );
};

export default MessageInput;
