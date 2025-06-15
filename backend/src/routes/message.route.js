import express from "express";
import {
  getMessages,
  getUsers,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ** /api/messages/users **
router.get("/users", protectRoute, getUsers);

// ** /api/messages/:id **
router.get("/:id", protectRoute, getMessages);

// ** /api/messages/send-message/:id **
router.post("/send-message/:id", protectRoute, sendMessage);

export default router;
