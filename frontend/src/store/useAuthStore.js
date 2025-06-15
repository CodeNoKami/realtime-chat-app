import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { create } from 'zustand';
import axiosInstance from '../lib/axios';

const baseUrl = import.meta.env.VITE_MODE === 'development' ? 'http://localhost:9008' : '/';

export const useAuthStore = create((set, get) => ({
   authUser: null,
   isCheckingAuth: true,
   isLoggingIn: false,
   isSignningUp: false,
   isUpdatingProfile: false,
   isLoggingOut: false,
   onlineUsers: [],
   socket: null,

   checkAuth: async () => {
      try {
         const res = await axiosInstance.get('/auth/check');
         set({ authUser: res.data });
         get().connectSocket();
      } catch (error) {
         console.log('checkAuth error', error);
         set({ authUser: null });
      } finally {
         set({ isCheckingAuth: false });
      }
   },

   signup: async (formData) => {
      set({ isSignningUp: true });
      try {
         const res = await axiosInstance.post('/auth/signup', formData);
         set({ authUser: res.data });
         toast.success(res.data.msg);
         get().connectSocket();
      } catch (error) {
         toast.error(error.response.data.msg);
      } finally {
         set({ isSignningUp: false });
      }
   },

   login: async (formData) => {
      set({ isLoggingIn: true });
      try {
         const res = await axiosInstance.post('/auth/login', formData);

         set({ authUser: res.data });
         toast.success(res.data.msg);
         get().connectSocket();
      } catch (error) {
         toast.error(error.response.data.msg);
      } finally {
         set({ isLoggingIn: false });
      }
   },

   logout: async () => {
      set({ isLoggingOut: true });
      try {
         const res = await axiosInstance.post('/auth/logout');
         toast.success(res.data.msg);
         set({ authUser: null });
         get().disconnectSocket();
      } catch (error) {
         toast.error(error.response.data.msg);
      } finally {
         set({ isLoggingOut: false });
      }
   },

   updateProfile: async (profilePic) => {
      set({ isUpdatingProfile: true });
      try {
         const res = await axiosInstance.put('/auth/update-profile', profilePic);
         set({ authUser: res.data });
         toast.success(res.data.msg);
      } catch (error) {
         toast.error(error.response?.data?.msg || 'Image upload failed');
      } finally {
         set({ isUpdatingProfile: false });
      }
   },

   connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;
      const socket = io(baseUrl, {
         query: { userId: authUser.user._id },
      });
      socket.connect();
      set({ socket: socket });
      socket.on('getOnlineUsers', (userIds) => {
         set({ onlineUsers: userIds });
      });
   },

   disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
   },
}));
