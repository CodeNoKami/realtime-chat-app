import { Image, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const { sendMessage, selectedUser, isMessageSending } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type (image only)
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setImagePreview(base64Image);
    };
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      const messageData = { text: text.trim(), image: imagePreview };
      await sendMessage(messageData);
      setText("");
      setImagePreview(null);
      if (fileInputRef?.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.log("Failed to send message", error);
    }
  };

  useEffect(() => {
    if (fileInputRef?.current) {
      fileInputRef.current.value = null;
    }
    setText("");
    setImagePreview(null);
  }, [selectedUser._id]);

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img
              src={imagePreview}
              alt='Preview'
              className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
            />
            <button
              className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center'
              type='button'
              onClick={handleRemoveImage}>
              <X className='size-3' />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
            type='text'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type='file'
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type='button'
            className={`hidden sm:flex btn btn-soft btn-circle ${
              imagePreview && "btn-primary"
            }`}
            onClick={() => fileInputRef?.current.click()}>
            <Image size={20} />
          </button>
        </div>
        <button
          type='submit'
          className={`btn btn-circle  ${
            text.trim() || imagePreview ? "btn-primary" : ""
          } `}
          disabled={(!text.trim() && !imagePreview) || isMessageSending}>
          {isMessageSending ? (
            <span className='size-[22px] loading loading-spinner'></span>
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
