const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes.js')
require('dotenv').config()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//db connection 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB!")
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
}

connectDB();

//Routes
app.use('/books', bookRoutes)


app.listen(process.env.PORT, () => {
    console.log(`listening to port  ${process.env.PORT || 3000}`);
})