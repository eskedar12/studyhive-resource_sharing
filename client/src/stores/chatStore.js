import { create } from 'zustand';
import messageService from '../services/messageService.js';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,  // userId string of the OTHER person
  messages: [],
  isLoading: false,
  typingUsers: {},

  fetchConversations: async () => {
    try {
      const conversations = await messageService.getConversations();
      set({ conversations });
    } catch {}
  },

  fetchMessages: async (userId) => {
    set({ isLoading: true, messages: [], activeConversation: String(userId) });
    try {
      const messages = await messageService.getMessages(userId);
      set({ messages, isLoading: false });
    } catch { set({ isLoading: false }); }
  },

  sendMessage: async (toUserId, content) => {
    try {
      const message = await messageService.sendMessage(toUserId, content);
      // Immediately add to local messages so sender sees it without waiting for socket echo
      if (message) {
        const { messages, activeConversation } = get();
        const alreadyExists = messages.some((m) => String(m._id) === String(message._id));
        if (!alreadyExists) {
          set({ messages: [...messages, message] });
        }
        // Update conversation sidebar
        get()._upsertConversation(message);
      }
      return message;
    } catch { return null; }
  },

  addMessage: (message) => {
    const { activeConversation, messages } = get();
    const senderId = String(message.sender?._id || message.sender);
    const receiverId = String(message.receiver?._id || message.receiver);

    // This message belongs to the open chat if the other person is sender or receiver
    const isActiveChat =
      activeConversation === senderId || activeConversation === receiverId;

    const alreadyExists = messages.some((m) => String(m._id) === String(message._id));

    if (isActiveChat && !alreadyExists) {
      set({ messages: [...messages, message] });
    }

    // Update sidebar conversation list
    get()._upsertConversation(message);
  },

  // Update or insert a conversation in the sidebar without a full refetch
  _upsertConversation: (message) => {
    const { conversations } = get();
    const currentUserId = String(message.sender?._id || message.sender);
    const otherUser = message.receiver; // populated object

    if (!otherUser || !otherUser._id) {
      // Fall back to full fetch if not populated
      get().fetchConversations();
      return;
    }

    const otherId = String(otherUser._id);
    const existing = conversations.find((c) => String(c.user._id) === otherId);

    if (existing) {
      // Update lastMessage and recalculate unread
      const updated = conversations.map((c) => {
        if (String(c.user._id) !== otherId) return c;
        const isIncoming = String(message.sender?._id || message.sender) !== currentUserId;
        return {
          ...c,
          lastMessage: message,
          unread: isIncoming ? (c.unread || 0) + 1 : c.unread,
        };
      });
      set({ conversations: updated });
    } else {
      // New conversation — prepend it
      get().fetchConversations();
    }
  },

  // Reset unread count when opening a conversation
  resetUnread: (userId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        String(c.user._id) === String(userId) ? { ...c, unread: 0 } : c
      ),
    }));
  },

  setTyping: (userId, isTyping) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [String(userId)]: isTyping },
    }));
  },
}));

export default useChatStore;
