import express, { response } from "express"
import { PORT, mongoDBURL } from "./config.js"
import mongoose from "mongoose"
import booksRoute from './routes/bookRouter.js'
import cors from 'cors'
import pensRoute from './routes/penRouter.js'
import authRoute from './routes/authRouter.js'
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.json())

app.use(cors())


app.get('/', (req, res) =>{
    console.log(req)
    return res.status(234).send('Welcome to MERN Stack')
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/auth", authRoute);
app.use('/pens', pensRoute)
app.use('/books', booksRoute);


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App is connected to db')
        app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`);    
        })
    })
    .catch((error) => {
        console.log(error)
    })