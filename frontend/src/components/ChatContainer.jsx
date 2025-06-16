import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatMessageTime } from '../lib/utils.js';
import { useAuthStore } from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import LightBox from './LightBox';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {
   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
   const [lightboxImage, setLightboxImage] = useState(null);

   const messageEndRef = useRef(null);
   const {
      messages,
      getMessages,
      isMessagesLoading,
      selectedUser,
      subscribeToMessages,
      unsubscribeFromMessages,
      startEditingMessage,
   } = useChatStore();

   const { authUser } = useAuthStore();

   useEffect(() => {
      if (!selectedUser?._id) return;
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
   }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

   useEffect(() => {
      if (messageEndRef.current && messages.length) {
         messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   useEffect(() => {
      const chatContainer = document.querySelector('.chatContainer');
      if (chatContainer) {
         chatContainer.scrollTop = chatContainer.scrollHeight;
      }
   }, [messages]);

   if (isMessagesLoading)
      return (
         <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
         </div>
      );

   return (
      <div className="flex flex-1 flex-col overflow-auto">
         <ChatHeader />

         <div className="chatContainer scroll-smooth flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300 px-4">
            {messages.length ? (
               <>
                  {messages.map((message) => {
                     const isOwn = message.senderId === authUser.user._id;
                     return (
                        <div
                           key={message._id}
                           className={`chat ${isOwn ? 'chat-end' : 'chat-start'}`}
                           ref={messageEndRef}
                        >
                           <div className="chat-image avatar">
                              <div className="size-10 rounded-full border">
                                 <img
                                    src={
                                       isOwn
                                          ? authUser.user.profilePic || '/avatar.png'
                                          : selectedUser.profilePic || '/avatar.png'
                                    }
                                    alt="profile pic"
                                 />
                              </div>
                           </div>

                           <div className="chat-header mb-1 flex items-center gap-2">
                              <time className="text-xs opacity-50 ml-1">
                                 {formatMessageTime(message.createdAt)}
                              </time>
                              {isOwn && (
                                 <button
                                    className="btn btn-xs btn-ghost p-1"
                                    onClick={() => startEditingMessage(message)}
                                 >
                                    <Pencil size={14} />
                                 </button>
                              )}
                           </div>

                           <div
                              className={`chat-bubble flex flex-col ${
                                 isOwn ? 'chat-bubble-primary' : 'bg-base-200'
                              }`}
                           >
                              {message.image && (
                                 <img
                                    onClick={() => {
                                       setIsLightboxOpen(true);
                                       setLightboxImage(message.image.url);
                                    }}
                                    src={message.image.url}
                                    alt="Attachment"
                                    className={`max-w-[250px] max-h-[200px] rounded-md mb-2 ${
                                       message.image.aspectRatio || ''
                                    } cursor-pointer`}
                                 />
                              )}
                              {message.text && <p>{message.text}</p>}
                           </div>
                        </div>
                     );
                  })}
               </>
            ) : (
               <div className="w-full h-full flex justify-center items-center">
                  <p className="text-center">
                     There is no messages. Say{' '}
                     <strong className="text-primary">&quot;Hello&quot;</strong> to start a
                     conversation
                  </p>
               </div>
            )}
         </div>

         <MessageInput />

         {isLightboxOpen && (
            <LightBox src={lightboxImage} onClose={() => setIsLightboxOpen(false)} />
         )}
      </div>
   );
};

export default ChatContainer;
