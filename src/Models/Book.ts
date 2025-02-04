import mongoose, {Schema} from "mongoose";
import {IBook} from "../Interfaces/Book";


const BookSchema: Schema  = new mongoose.Schema({
    title: {type: String, required: true},
    subtitle: String,
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    numPages: Number,
    author: {type: String, required: true},
    publisher: String,
    price: {type: Number, required: true},
    cover: {type: String, required: true}
})
const Book = mongoose.model<IBook>('books', BookSchema);
export {Book, IBook}

