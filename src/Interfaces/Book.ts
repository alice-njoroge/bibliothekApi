import {Document} from "mongoose";

export interface BookInput {
    title: string;
    subtitle?: string;
    isbn: string;
    numPages?: number;
    author: string;
    publisher?: string;
    price: number;
    cover: string;
}

export interface IBook extends Document, BookInput {
}