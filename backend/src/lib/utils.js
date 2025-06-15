import jwt from "jsonwebtoken";

export const generateJWT = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in MS
    httpOnly: true, // Prevent XSS attacks cross-site scripting attacks
    sameSite: "Strict", // CSRF attacks cross-site forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
