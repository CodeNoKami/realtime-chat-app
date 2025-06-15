import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) return;

    // Check file type (image only)
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className='max-h-screen overflow-y-auto pt-20 scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300'>
      <div className='max-w-3xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold '>Profile</h1>
            <p className='mt-2'>Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={selectedImg || authUser.user.profilePic || "/avatar.png"}
                alt='Profile'
                className='size-32 rounded-full object-cover border-4 border-primary '
              />
              <label
                htmlFor='avatar-upload'
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? " pointer-events-none" : ""}
                `}>
                {isUpdatingProfile ? (
                  <div className='w-5 h-5 grid place-items-center'>
                    <span className='loading text-base-200 loading-spinner size-5'></span>
                  </div>
                ) : (
                  <Camera className='w-5 h-5 text-base-200' />
                )}

                <input
                  type='file'
                  id='avatar-upload'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className='text-sm text-base-content/60'>
              {isUpdatingProfile ? (
                <div className='flex items-center gap-2'>
                  <span className='loading loading-spinner size-5'></span>
                  <span>Uploading...</span>
                </div>
              ) : (
                "Click the camera icon to update your photo"
              )}
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-sm text-base-content/60 flex items-center gap-2'>
                <User className='w-4 h-4' />
                Full Name
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                {authUser?.user.fullName}
              </p>
            </div>

            <div className='space-y-1.5'>
              <div className='text-sm text-base-content/60 flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                Email Address
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                {authUser?.user.email}
              </p>
            </div>
          </div>

          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-lg font-medium  mb-4'>Account Information</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-base-content/20'>
                <span>Member Since</span>
                <span>{authUser.user.createdAt?.split("T")[0]}</span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span>Account Status</span>
                <span className='text-green-500'>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
