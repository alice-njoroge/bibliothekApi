const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subtitle: String,
    isbn: {type: String, required: true},
    numPages: Number,
    author: {type: String, required: true},
    publisher: String,
    price: {type: Number, required: true},
    cover: {type: String, required: true}
})
module.exports = mongoose.model('Book', BookSchema);

