import toast from 'react-hot-toast';
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';

const useChatStore = create((set, get) => ({
   users: [],
   messages: [],
   selectedUser: null,
   isUsersLoading: false,
   isMessagesLoading: false,
   isMessageSending: false,
   editingMessage: null,

   setEditingMessage: (message) => set({ editingMessage: message }),
   clearEditingMessage: () => set({ editingMessage: null }),

   getUsers: async () => {
      set({ isUsersLoading: true });
      try {
         const res = await axiosInstance.get('/messages/users');
         set({ users: res.data.users });
      } catch (error) {
         console.error('getUsers error', error);
         toast.error(error?.response?.data?.msg || 'Failed to fetch users');
      } finally {
         set({ isUsersLoading: false });
      }
   },

   getMessages: async (receiverId) => {
      set({ isMessagesLoading: true });
      try {
         const res = await axiosInstance.get(`/messages/${receiverId}`);
         set({ messages: res.data.messages });
      } catch (error) {
         console.error('getMessages error', error);
         toast.error(error?.response?.data?.msg || 'Failed to fetch messages');
      } finally {
         set({ isMessagesLoading: false });
      }
   },

   sendMessage: async (messageData) => {
      set({ isMessageSending: true });
      try {
         const { selectedUser, messages } = get();
         if (!selectedUser?._id) throw new Error('No selected user');

         const res = await axiosInstance.post(
            `/messages/send-message/${selectedUser._id}`,
            messageData
         );
         set({ messages: [...messages, res.data.message] });
      } catch (error) {
         console.error('sendMessage error', error);
         toast.error(error?.response?.data?.msg || 'Failed to send message');
      } finally {
         set({ isMessageSending: false });
      }
   },

   editMessage: async (messageId, updatedData) => {
      try {
         const res = await axiosInstance.put(`/messages/edit-message/${messageId}`, updatedData);
         const updatedMessage = res.data.message;

         const updatedMessages = get().messages.map((msg) =>
            msg._id === messageId ? updatedMessage : msg
         );
         set({ messages: updatedMessages });
      } catch (error) {
         console.error('editMessage error', error);
         toast.error(error?.response?.data?.msg || 'Failed to edit message');
      }
   },

   subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;
      if (!socket) {
         console.warn('Socket not initialized');
         return;
      }

      // Remove any existing listener first to avoid duplicates
      socket.off('newMessage');

      socket.on('newMessage', (newMessage) => {
         // Check if the message is relevant to current chat
         if (
            !selectedUser ||
            (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id)
         ) {
            // Ignore messages not related to selected user
            return;
         }

         set((state) => ({ messages: [...state.messages, newMessage] }));

         // Play notification only if message is from other user (not me)
         const authUser = useAuthStore.getState().authUser;
         const isFromOtherUser = newMessage.senderId !== authUser?.user?._id;
         if (isFromOtherUser) {
            const audio = document.getElementById('notif-audio');
            if (audio) {
               audio.play().catch((err) => console.warn('Audio playback blocked:', err));
            }
         }
      });
   },

   unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      socket.off('newMessage');
   },

   setSelectedUser: (user) => set({ selectedUser: user }),
}));

export default useChatStore;
