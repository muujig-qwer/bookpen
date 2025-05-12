import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Бүртгэл
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role });
    res.status(201).json({ message: "Бүртгэл амжилттай", user });
  } catch (err) {
    res.status(400).json({ error: "Бүртгэл амжилтгүй", details: err });
  }
});

// Нэвтрэх
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Хэрэглэгч олдсонгүй" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Нууц үг буруу" });

    res.json({ message: "Нэвтрэлт амжилттай", role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа", details: err });
  }
});

export default router;


router.get("/users", async (req, res) => {
  const users = await User.find({}, ); // нууц үгийг нуух
  res.json(users);
});