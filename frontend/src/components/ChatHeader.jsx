import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';

// 🧠 Format "last seen" text like "5 min ago"
const formatTimeAgo = (date) => {
   if (!date) return 'a while ago';
   const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

   if (seconds < 60) return 'just now';
   const minutes = Math.floor(seconds / 60);
   if (minutes < 60) return `${minutes} min ago`;
   const hours = Math.floor(minutes / 60);
   if (hours < 24) return `${hours} hr ago`;
   const days = Math.floor(hours / 24);
   return `${days} day${days > 1 ? 's' : ''} ago`;
};

const ChatHeader = () => {
   const { selectedUser, setSelectedUser } = useChatStore();
   const { onlineUsers } = useAuthStore();

   const isOnline = onlineUsers.includes(selectedUser._id);

   return (
      <div className="p-2.5 border-b border-base-300">
         <div className="flex items-center justify-between">
            {/* Left: Avatar + User Info */}
            <div className="flex items-center gap-3">
               <div className="avatar">
                  <div className="size-10 rounded-full relative">
                     <img
                        src={selectedUser.profilePic || '/avatar.png'}
                        alt={selectedUser.fullName}
                     />
                  </div>
               </div>

               <div>
                  <h3 className="font-medium">{selectedUser.fullName}</h3>
                  <p className={`text-sm text-base-content/70 ${isOnline ? 'text-primary' : ''}`}>
                     {isOnline ? 'online' : `last seen ${formatTimeAgo(selectedUser.lastActiveAt)}`}
                  </p>
               </div>
            </div>

            {/* Right: Close button */}
            <button onClick={() => setSelectedUser(null)}>
               <X />
            </button>
         </div>
      </div>
   );
};

export default ChatHeader;
