import {RouteResponse} from "../Interfaces/RouteResponse";
import {RouteResponseController} from "./RouteResponseController";
import {Book} from "../Models/Book";
import {Request, Response} from "express";
import {ValidationError} from "./ValidationError";

//TODO remember to implement the interface
class BooksController extends RouteResponseController {
    public static instance: BooksController;

    private constructor() {
        super(Book)
    }

    public static getInstance(): BooksController {
        if (!BooksController.instance) {
            BooksController.instance = new BooksController();
        }
        return BooksController.instance;
    }

    public init() {
        console.log("BookController initialized.");
    }

    public async getBooks(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit; //how many items do I want to skip

            const sortField = req.query.sort as string || 'title';
            const sortOrder = req.query.order === 'desc' ? -1 : 1;

            const minPages = parseInt(req.query.numPages_gte as string) || 0;
            const maxPages = parseInt(req.query.numPages_lte as string) || Number.MAX_SAFE_INTEGER;

            if (minPages < 0 || maxPages < 0 || minPages > maxPages) {
                let error = new RangeError("Invalid minPages or maxPages values")
                return this.handleError(res, error.name, error.message, 400)
            }

            const bookList = await Book.find({numPages: {$gte: minPages, $lte: maxPages}})
                .sort({[sortField]: sortOrder})
                .skip(skip)
                .limit(limit);
            const totalBooks = await Book.countDocuments({
                numPages: {$gte: minPages, $lte: maxPages}
            });

            const returnData = {
                totalBooks,
                currentPage: page,
                totalPages: Math.ceil(totalBooks / limit),
                books: bookList
            }
            return this.handleSuccess(res, returnData);
        } catch (error) {
            return this.handleError(res, error, "unable to connect to fetch books", 500)
        }
    }

    public async getBook(req: Request, res: Response) {
        const isbn = req.params.isbn;
        //:TODO maybe I will need to validate the ISBN?
        try {
            const book = await Book.findOne({isbn})
            if (!book) {
                let error = new SyntaxError(`book with isbn ${isbn} was not found`);
                return this.handleError(res, error.name, error.message, 404)
            }
            return this.handleSuccess(res, book)

        } catch (error) {
            return this.handleError(res, error, "unable to connect to fetch books", 500)
        }
    }

    public async updateBook(req: Request, res: Response) {
        try {
            //find the book
            const isbnParam = req.params.isbn;
            const book = await Book.findOne({isbn: isbnParam});

            if (!book) {
                let error = new SyntaxError(`book with isbn ${isbnParam} was not found`);
                return this.handleError(res, error.name, error.message, 404)
            }

            //update it
            const {title, subtitle, isbn, author, numPages, publisher, price, cover} = req.body;
            if (!title || !isbn || !author || !cover || isNaN(price) || price < 0) {
                let error = new ValidationError("Invalid or missing book properties");
                return this.handleError(res, error.name, error.message, 400);
            }
            const updatedBook = await Book.updateOne(
                {isbn: book.isbn},
                {$set: {title, subtitle, isbn, author, numPages, publisher, price, cover}}
            )
            //:TODO maybe fetch the book that's just been updated
            return this.handleSuccess(res, updatedBook);

        } catch (error) {
            return this.handleError(res, error, "unable to connect to fetch books", 500)
        }
    }

    public async createBook(req: Request, res: Response) {
        try {
            //TODO find if the ISBN already exists in the db
            const {title, subtitle, isbn, author, numPages, publisher, price, cover} = req.body;
            //validation
            if (!title || !isbn || !author || !cover || isNaN(price) || price < 0) {
                let error = new ValidationError("Invalid or missing book properties");
                return this.handleError(res, error.name, error.message, 400);
            }
            const newBook = new Book({title, subtitle, isbn, numPages, author, publisher, price, cover});
            const savedBook = await newBook.save();
            return this.handleSuccess(res, savedBook)
        } catch (error) {
            return this.handleError(res, error, "unable to connect to fetch books", 500)
        }
    }

    public async deleteBook(req: Request, res: Response) {
        const isbn = req.params.isbn;

        try {
            const book = Book.findOneAndDelete({isbn: isbn});
            if (!book) {
                let error = new SyntaxError(`book with isbn ${isbn} was not found`);
                return this.handleError(res, error.name, error.message, 404)
            }
            return this.handleSuccess(res, book)

        } catch (error) {
            return res.status(500).json({message: "unable to connect to the DB"})
        }

    }

}

export default BooksController.getInstance();