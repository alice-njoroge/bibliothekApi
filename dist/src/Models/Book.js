"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BookSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    subtitle: String,
    isbn: { type: String, required: true },
    numPages: Number,
    author: { type: String, required: true },
    publisher: String,
    price: { type: Number, required: true },
    cover: { type: String, required: true }
});
const Book = mongoose_1.default.model('books', BookSchema);
exports.Book = Book;
