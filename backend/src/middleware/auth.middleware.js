import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import error500 from "../lib/error500.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized - No Token Provided",
        isSuccess: false,
        statusCode: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        msg: "Unauthorized - Invalid Token",
        isSuccess: false,
        statusCode: 401,
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
        isSuccess: false,
        statusCode: 404,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in protectRoute middleware : ${error.message}`);
    error500(res);
  }
};
