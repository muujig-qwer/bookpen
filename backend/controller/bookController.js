import { Book } from '../models/bookModel.js';

export const createBook = async (req, res ) => {
    try {
        const {title, author, publishYear } = req.body
        if (!title || !author  ||!publishYear){
            return res.status(400).send({
                message:'Fill all required fields'
            })
        }
        const newBook = {title, author, publishYear}
        const book = await Book.create(newBook)
        return res.status(201).json({message:'Book created succesfully', data:book})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:error.message})
    }
}
export const getAllBooks = async (req, res ) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit

        const books = await Book.find().skip(skip).limit(limit)
        const count = await Book.countDocuments()
        res.status(200).json({
            data: books,
            count: count
        })
    } catch (err) {
        res.status(500).json({ error: 'Алдаа гарлаа', message: err.message });
        }
}

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({message:'Ном олдсонгүй'})
        }
        return res.status(200).json(book)
    } catch (error) {
        console.log(err)
        return res.status(500).json({message:'aldaa'})
    }
};

export const updateBook = async (req, res) => {
    try {
        const {title, author, publishYear} = req.body
        
        if (!title || !author || !publishYear) {
            return res.status(400).json({
                message:'Бүх талбарыг бөглөнө үү'
            })
        }
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body)

        if(!result) res.status(404).json({
            message:'404 Ном олдсонгүй'
        })
        return res.status(200).json({
            message:'Амжилттай шинэчлэгдлээ'
        })
    }
    catch(error){
        console.log(error.message)
        res.status(500).send({message:error.message})
    }
}

export const deleteBook = async (req,res) => {
    try{
        const { id } = req.params;
        const result = await Book.findByIdAndDelete(id)

        if(!result){
            return res.status(400).json({
                message:'Book not found'
            })
        }
        return res.status(200).json({
            message:'Book deleted'
        })
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message}  )
    }
}