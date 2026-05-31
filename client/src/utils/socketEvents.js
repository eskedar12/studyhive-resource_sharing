export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  // Chat
  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  TYPING: 'typing',

  // Notifications
  NOTIFICATION: 'notification',
  NEW_REPLY: 'new_reply',

  // Rooms
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
};