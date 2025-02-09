"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Book_1 = require("../Models/Book");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * get all books
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit; //how many items do I want to skip
        const bookList = await Book_1.Book.find().skip(skip).limit(limit);
        const totalBooks = await Book_1.Book.countDocuments();
        return res.status(200).json({
            totalBooks,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            books: bookList
        });
    }
    catch (error) {
        return res.status(500).json({ message: "unable to connect to fetch books " });
    }
});
/**
 * get a single book
 */
router.get('/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    //:TODO maybe I will need to validate the ISBN?
    try {
        const book = await Book_1.Book.findOne({ isbn });
        if (!book) {
            return res.status(404).json({ message: `book with isbn ${isbn} was not found` });
        }
        return res.status(200).json(book);
    }
    catch (error) {
        return res.status(500).json({ message: "unable to fetch the book" });
    }
});
/**
 * update a book
 */
router.put('/:isbn', async (req, res) => {
    try {
        //find the book
        const book = await Book_1.Book.findOne({ isbn: req.params.isbn });
        if (!book) {
            return res.status(404).json({ message: 'book with this ISBN was not found' });
        }
        //update it
        const { title, subtitle, isbn, author, numPages, publisher, price, cover } = req.body;
        if (!title || !isbn || !author || !cover || isNaN(price)) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        const updatedBook = await Book_1.Book.updateOne({ isbn: book.isbn }, { $set: { title, subtitle, isbn, author, numPages, publisher, price, cover } });
        //:TODO maybe fetch the book that's just been updated
        return res.status(200).json({ message: "Updated successful", data: updatedBook });
    }
    catch (error) {
        return res.status(500).json({ message: "unable to connect to the DB" });
    }
});
/**
 * create a book
 */
router.post('/', async (req, res) => {
    try {
        const { title, subtitle, isbn, author, numPages, publisher, price, cover } = req.body;
        //validation
        if (!title || !isbn || !author || !cover || isNaN(price)) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        const newBook = new Book_1.Book({ title, subtitle, isbn, numPages, author, publisher, price, cover });
        const savedBook = await newBook.save();
        res.status(201).json({
            message: "Book created successfully!",
            data: savedBook
        });
    }
    catch (error) {
        return res.status(500).json({ message: "unable to connect to the DB" });
    }
});
/**
 * delete a book
 */
router.delete('/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = Book_1.Book.findOneAndDelete({ isbn: isbn });
        if (!book) {
            return res.status(404).json({ message: `Book with isbn ${isbn} was not found` });
        }
        return res.status(200).json("book deleted successfully");
    }
    catch (error) {
        return res.status(500).json({ message: "unable to connect to the db" });
    }
});
exports.default = router;
