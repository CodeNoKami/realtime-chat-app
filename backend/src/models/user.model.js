import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
   {
      email: {
         type: String,
         unique: true,
         required: true,
      },
      fullName: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         minlength: 6,
         required: true,
      },
      profilePic: {
         type: String,
         default: '',
      },

      isOnline: {
         type: Boolean,
         default: false,
      },
      lastActiveAt: {
         type: Date,
         default: Date.now,
      },
      status: {
         type: String,
         enum: ['online', 'offline', 'away', 'busy'],
         default: 'offline',
      },
   },
   { timestamps: true }
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
