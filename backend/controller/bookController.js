import { Book } from '../models/bookModel.js';

// Ном бүртгэх
export const createBook = async (req, res) => {
  try {
    const { title, author, publishYear, description } = req.body;

    if (!title || !author || !publishYear || !description) {
      return res.status(400).send({
        message: 'Бүх талбарыг бөглөнө үү (гарчиг, зохиогч, он, тайлбар)',
      });
    }

    const newBook = { title, author, publishYear, description };
    const book = await Book.create(newBook);

    return res.status(201).json({
      message: 'Ном амжилттай бүртгэгдлээ',
      data: book,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// Ном жагсаалт
export const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const count = await Book.countDocuments();

    res.status(200).json({ data: books, count });
  } catch (err) {
    res.status(500).json({ error: 'Алдаа гарлаа', message: err.message });
  }
};

// ID-р ном авах
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Ном олдсонгүй' });
    }
    return res.status(200).json(book);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Алдаа гарлаа' });
  }
};

// Ном шинэчлэх
export const updateBook = async (req, res) => {
  try {
    const { title, author, publishYear, description } = req.body;

    if (!title || !author || !publishYear || !description) {
      return res.status(400).json({
        message: 'Бүх талбарыг бөглөнө үү (гарчиг, зохиогч, он, тайлбар)',
      });
    }

    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result)
      return res.status(404).json({
        message: 'Ном олдсонгүй',
      });

    return res.status(200).json({
      message: 'Амжилттай шинэчлэгдлээ',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Ном устгах
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return res.status(400).json({ message: 'Ном олдсонгүй' });
    }

    return res.status(200).json({ message: 'Ном устгагдлаа' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
