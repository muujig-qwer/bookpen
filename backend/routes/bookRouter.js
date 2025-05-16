import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controller/bookController.js';
import {Book}  from '../models/bookModel.js'; // ✅ энэ заавал байх ёстой
import multer from "multer";

const router = express.Router();

import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage });
router.post("/upload/:id", upload.single("image"), async (req, res) => {
  const bookId = req.params.id;
  const image = req.file?.filename;
  const description = req.body.description;

  if (!image && !description) {
    return res.status(400).json({ message: "Зураг эсвэл тайлбар заавал байх ёстой" });
  }

  const updateFields = {};
  if (image) updateFields.image = image;
  if (description) updateFields.description = description;

  await Book.findByIdAndUpdate(bookId, updateFields);
  res.json({ message: "Амжилттай хадгалагдлаа", ...updateFields });
});

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);


export default router;
