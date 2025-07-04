/* eslint-disable react-hooks/exhaustive-deps */
import { Image, Pencil, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useChatStore from '../store/useChatStore';

const MessageInput = () => {
   const { sendMessage, editMessage, editingMessage, clearEditingMessage, isMessageSending } =
      useChatStore();

   const [text, setText] = useState('');
   const [imagePreview, setImagePreview] = useState(null);
   const fileInputRef = useRef(null);

   const clearInput = () => {
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
         toast.error('Please choose an image file.');
         return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
         toast.error('File size exceeds 10MB. Please choose a smaller file.');
         return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImagePreview(reader.result);
   };

   const handleRemoveImage = () => {
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
   };

   const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!text.trim() && !imagePreview) return;

      try {
         const messageData = { text: text.trim(), image: imagePreview };

         if (editingMessage) {
            await editMessage(editingMessage._id, messageData);
            clearEditingMessage();
         } else {
            await sendMessage(messageData);
         }

         clearInput();
      } catch (error) {
         console.error('Failed to send message', error);
         toast.error('Failed to send message');
      }
   };

   useEffect(() => {
      if (fileInputRef.current) fileInputRef.current.value = null;
      setText('');
      setImagePreview(null);
   }, [useChatStore.getState().selectedUser?._id]);

   useEffect(() => {
      if (editingMessage) {
         setText(editingMessage.text || '');
         setImagePreview(editingMessage?.image?.url || null);
      }
   }, [editingMessage]);

   return (
      <div className="p-4 w-full">
         {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
               <div className="relative">
                  <img
                     src={imagePreview}
                     alt="Preview"
                     className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                  />
                  <button
                     className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                     type="button"
                     onClick={handleRemoveImage}
                  >
                     <X className="size-3" />
                  </button>
               </div>
            </div>
         )}

         <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
               <input
                  type="text"
                  className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                  placeholder={editingMessage ? 'Edit your message...' : 'Type a message...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isMessageSending}
               />
               <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  disabled={isMessageSending}
               />

               <button
                  type="button"
                  className={`hidden sm:flex btn btn-soft btn-circle ${
                     imagePreview ? 'btn-primary' : ''
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isMessageSending}
               >
                  <Image size={20} />
               </button>
            </div>

            <button
               type="submit"
               className={`btn btn-circle ${text.trim() || imagePreview ? 'btn-primary' : ''}`}
               disabled={(!text.trim() && !imagePreview) || isMessageSending}
            >
               {isMessageSending ? (
                  <span className="size-[22px] loading loading-spinner"></span>
               ) : editingMessage ? (
                  <Pencil size={22} />
               ) : (
                  <Send size={22} />
               )}
            </button>
         </form>

         {editingMessage && (
            <div className="text-sm text-gray-400 mt-1 flex items-center gap-4">
               <span>Editing message</span>
               <button
                  onClick={() => {
                     clearEditingMessage();
                     clearInput();
                  }}
                  className="text-xs text-red-400 underline hover:text-red-300"
                  type="button"
               >
                  Cancel
               </button>
            </div>
         )}
      </div>
   );
};

export default MessageInput;
