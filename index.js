const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const helmet = require('helmet');
// const path = require('path');

const { upload } = require('./middlewares/multerMiddleware');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();
dotenv.config();

// essentials
app.use(morgan('combined'));
app.use(helmet());

// body parser for plain text
app.use(express.json());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true, }));
// handles cookies
// app.use(cookieParser());
// allow cors requestes
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions));


// routes
app.use('/auth', authRoutes);
app.use('/blog', upload.single('file'), blogRoutes);
app.use('/blogs', blogsRoutes);
app.use('/user', upload.single('file'), userRoutes);

// Default route
app.get('*', (req, res) => {
    return res.status(404).json({ message: 'You reached the space station!!!' });
});

// error handling
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).send('Something went wrong!');
});


const MONGO_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 4000;


// Create a Mongoose connection using promises
mongoose
    .connect(MONGO_URL)
    .then(() => {
        // Start the server after the database connection is established
        app.listen(PORT);
    })
    .catch((err) => {
        // res.status(500).json({message:'Internal server error'});
        console.log('Could not start the server');
    });