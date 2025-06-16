import cloudinary from '../lib/cloudinary.js';
import error500 from '../lib/error500.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsers = async (req, res) => {
   try {
      const users = await User.find({ _id: { $ne: req.user._id } })
         .select('-password')
         .sort([
            ['isOnline', -1], // online users first
            ['lastActiveAt', -1], // then recently active
            ['fullName', 1], // then alphabetically
         ]);

      res.status(200).json({
         users,
         msg: 'Users fetched successfully.',
         isSuccess: true,
         statusCode: 200,
      });
   } catch (error) {
      console.log(`Error in getUsers controller : ${error.message}`);
      error500(res);
   }
};

export const getMessages = async (req, res) => {
   try {
      const { id: whoRecivedMessageId } = req.params;
      const myId = req.user._id;
      const messages = await Message.find({
         $or: [
            { senderId: myId, reciverId: whoRecivedMessageId },
            { senderId: whoRecivedMessageId, reciverId: myId },
         ],
      });

      res.status(200).json({
         messages,
         msg: 'Messages fetched successfully.',
         isSuccess: true,
         statusCode: 200,
      });
   } catch (error) {
      console.log(`Error in getMessages controller : ${error.message}`);
      error500(res);
   }
};

export const sendMessage = async (req, res) => {
   try {
      const { id: reciverId } = req.params;
      const { text, image } = req.body;
      const senderId = req.user._id;
      let imageData = {};
      if (image) {
         // Upload the image to Cloudinary
         const uploadResponse = await cloudinary.uploader.upload(image, {
            resource_type: 'image',
            transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
         });

         // Determine image ratio
         let ratio;
         if (uploadResponse.width > uploadResponse.height) {
            ratio = 'aspect-[16/9]';
         } else if (uploadResponse.width < uploadResponse.height) {
            ratio = 'aspect-[1/2]';
         } else {
            ratio = 'aspect-[1/1]';
         }

         console.log('Image Ratio:', ratio);

         // Store image data
         imageData = {
            url: uploadResponse.secure_url || '',
            width: uploadResponse.width || 0,
            height: uploadResponse.height || 0,
            aspectRatio: ratio,
         };
      }

      const newMessage = await Message.create({
         senderId,
         reciverId,
         text,
         image: imageData,
      });

      await newMessage.save();

      res.status(201).json({
         message: newMessage,
         msg: 'Message sent successfully.',
         isSuccess: true,
         statusCode: 201,
      });

      const receiverSocketId = getReceiverSocketId(reciverId);

      if (receiverSocketId) {
         io.to(receiverSocketId).emit('newMessage', {
            ...newMessage,
            receiverId: reciverId, // ✅ Add this
         });
      }
   } catch (error) {
      console.log(`Error in sendMessage controller : ${error.message}`);
      error500(res);
   }
};

export const editMessage = async (req, res) => {
   try {
      const { messageId } = req.params;
      const { text, image } = req.body;
      const userId = req.user._id;

      const message = await Message.findById(messageId);

      if (!message) {
         return res.status(404).json({ msg: 'Message not found', isSuccess: false });
      }

      // ✅ Ensure the user is the sender
      if (message.senderId.toString() !== userId.toString()) {
         return res
            .status(403)
            .json({ msg: 'Unauthorized to edit this message', isSuccess: false });
      }

      let imageData = message.image; // Default to existing image

      // ✅ If new image is sent, upload it
      if (image && image !== message.image?.url) {
         const uploadResponse = await cloudinary.uploader.upload(image, {
            resource_type: 'image',
            transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
         });

         let ratio;
         if (uploadResponse.width > uploadResponse.height) {
            ratio = 'aspect-[16/9]';
         } else if (uploadResponse.width < uploadResponse.height) {
            ratio = 'aspect-[1/2]';
         } else {
            ratio = 'aspect-[1/1]';
         }

         imageData = {
            url: uploadResponse.secure_url || '',
            width: uploadResponse.width || 0,
            height: uploadResponse.height || 0,
            aspectRatio: ratio,
         };
      }

      // ✅ Update the message
      message.text = text || message.text;
      message.image = imageData;
      await message.save();

      // ✅ Emit event to frontend
      const receiverSocketId = getReceiverSocketId(message.reciverId);
      if (receiverSocketId) {
         io.to(receiverSocketId).emit('messageEdited', message);
      }

      res.status(200).json({
         message,
         msg: 'Message updated successfully.',
         isSuccess: true,
         statusCode: 200,
      });
   } catch (error) {
      console.error('Error editing message:', error.message);
      error500(res);
   }
};
