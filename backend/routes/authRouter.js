import express from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Бүртгэл
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Энгийн валидаци
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Нэвтрэх нэр болон нууц үг шаардлагатай" });
  }

  try {
    // Хэрэглэгч аль хэдийн оршиж байгаа эсэхийг шалгах
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Хэрэглэгч аль хэдийн оршин байна" });
    }

    // Нууц үгийг энгийн хэлбэрээр хадгалах (bcrypt ашиглахгүй)
    const user = await User.create({ username, password, role });

    // JWT токен үүсгэх
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Бүртгэл амжилттай",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Бүртгэлийн алдаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Нэвтрэх
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Нэвтрэх нэр болон нууц үг шаардлагатай" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // Нууц үгийг шууд харьцуулах (bcrypt ашиглахгүй)
    if (password !== user.password) {
      return res.status(401).json({ error: "Нууц үг буруу" });
    }

    // JWT токен үүсгэх
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({
      message: "Нэвтрэлт амжилттай",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Нэвтрэх алдаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Хэрэглэгчийн жагсаалт
router.get("/users", async (req, res) => {
  try {
    // Нууц үгийг хасах projection ашиглах
    const users = await User.find({}, );
    res.json(users);
  } catch (err) {
    console.error("Хэрэглэгчийн жагсаалтын алдаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Нууц үг солих
router.put("/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Токен шаардлагатай" });
  }

  try {
    // Токен шалгах
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // Хуучин нууц үгийг шууд шалгах
    if (oldPassword !== user.password) {
      return res.status(400).json({ error: "Хуучин нууц үг буруу байна" });
    }

    // Шинэ нууц үгийг шууд хадгалах
    user.password = newPassword;
    await user.save();

    res.json({ message: "Нууц үг амжилттай солигдлоо" });
  } catch (err) {
    console.error("Нууц үг солих алдаа:", err);

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Хүчингүй токен" });
    }

    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

export default router;


// Профайл шинэчлэх
router.put("/update-profile", async (req, res) => {
  const { username } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Токен шаардлагатай" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // Хэрэглэгчийн нэр шинэчлэх
    user.username = username;
    await user.save();

    res.json({
      message: "Профайл амжилттай шинэчлэгдлээ",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Профайл шинэчлэх алдаа:", err);

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Хүчингүй токен" });
    }

    res.status(500).json({ error: "Серверийн алдаа" });
  }
});