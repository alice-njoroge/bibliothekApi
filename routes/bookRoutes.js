const express = require('express');
const Book = require('../Models/Book.js')
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {title, subtitle, isbn, author, numPages, publisher, price, cover} = req.body;
        //validation
        if (!title || !isbn || !author || !cover || !price) {
            return res.status(400).json({message: "All required fields must be provided"})
        }
        const newBook = new Book({title, subtitle, isbn, numPages, author, publisher, price, cover});
        const savedBook = await newBook.save();

        res.status(201).json({
            message: "Book created successfully!",
            data: savedBook
        });
    } catch (error) {
        return res.status(500).json({message: "unable to connect to the "})
    }
})

module.exports = router;