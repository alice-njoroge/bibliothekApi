import {Book} from "../Models/Book";
import express, {Request, Response, Router} from 'express';

const router: Router = express.Router();

/**
 * get all books
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const bookList = await Book.find();
        return res.status(200).json(bookList)
    } catch (error) {
        return res.status(500).json({message: "unable to connect to fetch books "})
    }
});

/**
 * get a single book
 */

router.get('/:isbn', async (req: Request, res: Response) => {
    const isbn = req.params.isbn;
    //:TODO maybe I will need to validate the ISBN in future?
    try {
        const book = await Book.findOne({isbn})
        if (!book) {
            return res.status(404).json({message: `book with isbn ${isbn} was not found`})
        }
        return res.status(200).json(book)

    } catch (error) {
        return res.status(500).json({message: "unable to fetch the book"})

    }
});

/**
 * update a book
 */
router.put('/:isbn', async (req: Request, res: Response) => {
    try {
        //find the book
        const book = await Book.findOne({isbn: req.params.isbn});
        if (!book) {
            return res.status(404).json({message: 'book with this ISBN was not found'})
        }

        //update it
        const {title, subtitle, isbn, author, numPages, publisher, price, cover} = req.body;
        if (!title || !isbn || !author || !cover || isNaN(price)) {
            return res.status(400).json({message: "All required fields must be provided"})
        }
        const updatedBook = await Book.updateOne(
            {isbn: book.isbn},
            {$set: {title, subtitle, isbn, author, numPages, publisher, price, cover}}
        )
        //:TODO maybe fetch the book that's just been updated
        return res.status(200).json({message: "Updated successful", data: updatedBook})

    } catch (error) {
        return res.status(500).json({message: "unable to connect to the DB"})
    }

})

/**
 * create a book
 */

router.post('/', async (req: Request, res: Response) => {
    try {
        const {title, subtitle, isbn, author, numPages, publisher, price, cover} = req.body;
        //validation
        if (!title || !isbn || !author || !cover || isNaN(price)) {
            return res.status(400).json({message: "All required fields must be provided"})
        }
        const newBook = new Book({title, subtitle, isbn, numPages, author, publisher, price, cover});
        const savedBook = await newBook.save();

        res.status(201).json({
            message: "Book created successfully!",
            data: savedBook
        });
    } catch (error) {
        return res.status(500).json({message: "unable to connect to the DB"})
    }
})


export default router;