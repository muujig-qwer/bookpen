import mongoose, { mongo } from 'mongoose'

const penShchema = new mongoose.Schema (
    {
        title:{
            type:String,
            required:true
        },
        brand:{
            type:String,
            required: true
        },
        publishYear:{
            type:Number,
            required:true
        }
    },
    {
        timestamps:true
    }
)
const Pen = mongoose.models.Pen || mongoose.model('Pen', penShchema)
export default Pen