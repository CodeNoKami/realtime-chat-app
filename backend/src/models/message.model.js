import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    reciverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    text: {
      type: String,
    },
    image: {
      url: { type: String, required: false },
      width: { type: Number, required: false },
      height: { type: Number, required: false },
      aspectRatio: { type: String, required: false },
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
