import cloudinary from "../lib/cloudinary.js";
import error500 from "../lib/error500.js";
import { generateJWT } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // Check user input fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        msg: "All fields are required.",
        isSuccess: false,
        statusCode: 400,
      });
    }

    // Check email alrady exist or not.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        msg: "email is already exist.",
        isSuccess: false,
        statusCode: 409,
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 character long.",
        isSuccess: false,
        statusCode: 400,
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateJWT(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic,
        },
        msg: "User signup successfully.",
        isSuccess: true,
        statusCode: 201,
      });
    } else {
      res.status(400).json({
        msg: "Invalid user data",
        isSuccess: false,
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(`Error in signup controller : ${error.message}`);
    error500(res);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user input fields
    if (!email || !password) {
      return res.status(400).json({
        msg: "All fields are required.",
        isSuccess: false,
        statusCode: 400,
      });
    }

    // Find user is avaliable or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid user credentials",
        isSuccess: false,
        statusCode: 400,
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        msg: "Invalid user credentials",
        isSuccess: false,
        statusCode: 400,
      });
    }

    generateJWT(user._id, res);
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
      },
      msg: "User login successfully.",
      isSuccess: true,
      statusCode: 200,
    });
  } catch (error) {
    console.log(`Error in login controller : ${error.message}`);
    error500(res);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      msg: "User logout successfully.",
      isSuccess: true,
      statusCode: 200,
    });
  } catch (error) {
    console.log(`Error in logout controller : ${error.message}`);
    error500(res);
  }
};

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  try {
    if (!profilePic) {
      return res.status(400).json({
        msg: " Profile picture is required.",
        isSuccess: false,
        statusCode: 400,
      });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      resource_type: "image",
      transformation: [{ width: 2000, height: 2000, crop: "limit" }],
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        profilePic: updatedUser.profilePic,
      },
      msg: "User profile updated successfully.",
      isSuccess: true,
      statusCode: 200,
    });
  } catch (error) {
    console.log(`Error in updateProfile controller : ${error.message}`);
    error500(res);
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
      msg: "User is authenticated.",
      isSuccess: true,
      statusCode: 200,
    });
  } catch (error) {
    console.log(`Error in checkAuth controller : ${error.message}`);
    error500(res);
  }
};
