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
         console.log('getUsers error', error);
         toast.error(error.response.data.msg);
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
         console.log('getMessages error', error);
         toast.error(error.response.data.msg);
      } finally {
         set({ isMessagesLoading: false });
      }
   },

   sendMessage: async (messageData) => {
      set({ isMessageSending: true });
      try {
         const { selectedUser, messages } = get();
         const res = await axiosInstance.post(
            `/messages/send-message/${selectedUser._id}`,
            messageData
         );
         set({ messages: [...messages, res.data.message] });
      } catch (error) {
         console.log('sendMessage error', error);
         toast.error(error.response.data.msg);
      } finally {
         set({ isMessageSending: false });
      }
   },

   editMessage: async (messageId, updatedData) => {
      try {
         const res = await axiosInstance.put(`/messages/edit-message/${messageId}`, updatedData);
         const updatedMessage = res.data.message;

         // Replace the message in state
         const updatedMessages = get().messages.map((msg) =>
            msg._id === messageId ? updatedMessage : msg
         );
         set({ messages: updatedMessages });
      } catch (error) {
         console.log('editMessage error', error);
         toast.error(error.response.data.msg);
      }
   },

   subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;
      const socket = useAuthStore.getState().socket;

      socket.on('newMessage', (newMessage) => {
         const isFromOtherUser = newMessage.senderId !== selectedUser._id;
         set({ messages: [...get().messages, newMessage] });

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
      socket.off('newMessage');
   },

   setSelectedUser: (user) => set({ selectedUser: user }),
}));

export default useChatStore;
