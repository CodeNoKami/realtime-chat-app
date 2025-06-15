import mongoose from "mongoose";
import error500 from "../lib/error500.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );

    res.status(200).json({
      users,
      msg: "Users fetched successfully.",
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
      msg: "Messages fetched successfully.",
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
        resource_type: "image",
        transformation: [{ width: 2000, height: 2000, crop: "limit" }],
      });

      // Determine image ratio
      let ratio;
      if (uploadResponse.width > uploadResponse.height) {
        ratio = "aspect-[16/9]";
      } else if (uploadResponse.width < uploadResponse.height) {
        ratio = "aspect-[1/2]";
      } else {
        ratio = "aspect-[1/1]";
      }

      console.log("Image Ratio:", ratio);

      // Store image data
      imageData = {
        url: uploadResponse.secure_url || "",
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
      msg: "Message sent successfully.",
      isSuccess: true,
      statusCode: 201,
    });

    const receiverSocketId = getReceiverSocketId(reciverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    console.log(`Error in sendMessage controller : ${error.message}`);
    error500(res);
  }
};
