import toast from 'react-hot-toast';
import { create } from 'zustand';
import notificationSound from '../assets/iphone_notification.mp3';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';

const useChatStore = create((set, get) => ({
   users: [],
   messages: [],
   selectedUser: null,
   isUsersLoading: false,
   isMessagesLoading: false,
   isMessageSending: false,
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

   subscribeToMessages: () => {
      const { selectedUser } = get();
      const socket = useAuthStore.getState().socket;
      const authUser = useAuthStore.getState().authUser;

      if (!socket || !authUser) return;

      const notificationAudio = new Audio(notificationSound);

      socket.on('newMessage', (newMessage) => {
         const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser?._id;

         // Add new message to state
         set({ messages: [...get().messages, newMessage] });

         // ✅ If this user is the receiver and not actively chatting with the sender, play sound
         if (newMessage.receiverId === authUser._id && !isMessageSentFromSelectedUser) {
            notificationAudio.play().catch((err) => console.warn('Failed to play sound:', err));
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
