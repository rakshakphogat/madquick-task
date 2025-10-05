import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { VaultItem } from "../models/VaultItem.js";

const router = express.Router();

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token from cookie
const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Get all vault items for authenticated user
router.get("/", verifyToken, async (req: any, res) => {
  try {
    const vaultItems = await VaultItem.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      vaultItems,
    });
  } catch (error) {
    console.error("Get vault items error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create new vault item
router.post("/", verifyToken, async (req: any, res) => {
  try {
    const { title, username, password, url, notes } = req.body;

    // Validation
    if (!title || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Title, username, and password are required",
      });
    }

    const vaultItem = new VaultItem({
      userId: req.user._id,
      title,
      username,
      password, // Encrypted on client-side
      url: url || "",
      notes: notes || "",
    });

    await vaultItem.save();

    res.status(201).json({
      success: true,
      message: "Vault item created successfully",
      vaultItem: {
        _id: vaultItem._id,
        title: vaultItem.title,
        username: vaultItem.username,
        password: vaultItem.password,
        url: vaultItem.url,
        notes: vaultItem.notes,
        createdAt: vaultItem.createdAt,
        updatedAt: vaultItem.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create vault item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update vault item
router.put("/:id", verifyToken, async (req: any, res) => {
  try {
    const { title, username, password, url, notes } = req.body;
    const { id } = req.params;

    // Validation
    if (!title || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Title, username, and password are required",
      });
    }

    const vaultItem = await VaultItem.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!vaultItem) {
      return res.status(404).json({
        success: false,
        message: "Vault item not found",
      });
    }

    vaultItem.title = title;
    vaultItem.username = username;
    vaultItem.password = password; // Encrypted on client-side
    vaultItem.url = url || "";
    vaultItem.notes = notes || "";

    await vaultItem.save();

    res.json({
      success: true,
      message: "Vault item updated successfully",
      vaultItem: {
        _id: vaultItem._id,
        title: vaultItem.title,
        username: vaultItem.username,
        password: vaultItem.password,
        url: vaultItem.url,
        notes: vaultItem.notes,
        createdAt: vaultItem.createdAt,
        updatedAt: vaultItem.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update vault item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete vault item
router.delete("/:id", verifyToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    const vaultItem = await VaultItem.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!vaultItem) {
      return res.status(404).json({
        success: false,
        message: "Vault item not found",
      });
    }

    res.json({
      success: true,
      message: "Vault item deleted successfully",
    });
  } catch (error) {
    console.error("Delete vault item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
