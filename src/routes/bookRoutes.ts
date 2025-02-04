import {Book} from "../Models/Book";
import express, {Request, Response, Router} from 'express';
import BooksController from "../Controllers/BooksController"
import booksController from "../Controllers/BooksController";

const router: Router = express.Router();


/**
 * get all books
 */
router.get('/', BooksController.getBooks.bind(BooksController));

/**
 * get a single book
 */
router.get('/:isbn', BooksController.getBook.bind(BooksController));

/**
 * update a book
 */
router.put('/:isbn', BooksController.updateBook.bind(BooksController))

/**
 * create a book
 */

router.post('/', BooksController.createBook.bind(BooksController))

/**
 * delete a book
 */
router.delete('/:isbn', BooksController.deleteBook.bind(BooksController))


export default router;