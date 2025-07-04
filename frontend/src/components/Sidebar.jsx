import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';

const Sidebar = () => {
   const { getUsers, users, isUsersLoading, selectedUser, setSelectedUser } = useChatStore();
   const { onlineUsers } = useAuthStore();

   const [showOnlineOnly, setShowOnlineOnly] = useState(false);

   const filteredUsers = showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;

   useEffect(() => {
      getUsers();
   }, [getUsers, onlineUsers.length]);

   if (isUsersLoading) return <SidebarSkeleton />;

   return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
         <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
               <Users className="size-6" />
               <span className="font-medium hidden lg:block">Contacts</span>
            </div>

            {/* TODO: Online filter toggle */}
            <div className="mt-3 hidden lg:flex items-center gap-2">
               <label className="cursor-pointer flex items-center gap-2">
                  <input
                     type="checkbox"
                     checked={showOnlineOnly}
                     onChange={(e) => setShowOnlineOnly(e.target.checked)}
                     className="toggle toggle-sm checked:bg-primary/30 checked:text-primary"
                  />
                  <span className="text-sm">Show online only</span>
               </label>
               <span className="text-xs badge badge-sm badge-soft badge-primary text-zinc-500">
                  {onlineUsers.length - 1} online
               </span>
            </div>
         </div>
         {/* User lists */}
         <div className="overflow-y-auto w-full py-3 scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300">
            {filteredUsers.map((user) => (
               <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-200 transition-colors
              ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
               >
                  <div
                     className={`relative size-10 avatar  mx-auto lg:mx-0 ${
                        onlineUsers.includes(user._id) ? 'avatar-online' : 'avatar-offline'
                     }`}
                  >
                     <img
                        src={user.profilePic || '/avatar.png'}
                        alt={user.name}
                        className="avatar avatar-online object-cover rounded-full"
                     />
                  </div>

                  {/* User info - only visible on larger screens */}
                  <div className="hidden lg:block text-left min-w-0">
                     <div className="font-medium truncate">{user.fullName}</div>
                     <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                     </div>
                  </div>
               </button>
            ))}
            {filteredUsers.length === 0 && <p className="p-3 text-center">No contacts found.</p>}
         </div>
      </aside>
   );
};

export default Sidebar;
