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
        const bookList = await Book_1.Book.find();
        return res.status(200).json(bookList);
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
    //:TODO maybe I will need to validate the ISBN in future?
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
        return res.status(200).json(updatedBook);
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
exports.default = router;
