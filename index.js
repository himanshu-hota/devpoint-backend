const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const helmet = require('helmet');
// const path = require('path');

const {upload} = require('./middlewares/multerMiddleware');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();


// essentials
app.use(morgan('combined'));
app.use(helmet());
// make env variables available in this file
dotenv.config();
// body parser for plain text
app.use(express.json());
// handles cookies
app.use(cookieParser())
// allow cors requestes
app.use(cors());
// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://devpoint-frontend.vercel.app/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});


// routes
app.use('/auth',authRoutes);
app.use('/blog',upload.single('file'), blogRoutes);
app.use('/blogs', blogsRoutes);
app.use('/user', upload.single('file'), userRoutes);

// Default route
app.get('*', (req, res) => {
    res.status(404).json({message:'You reached the space station!!!'});
});

app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
});


const MONGO_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 4000; 

// Use the newUrlParser and useUnifiedTopology options
// const mongooseOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// };

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send('Internal server error');
});


// Create a Mongoose connection using promises
mongoose
    .connect(MONGO_URL)
    .then(() => {
        // Start the server after the database connection is established
        app.listen(PORT);
    })
    .catch((err) => {
        res.status(500).json({message:'Internal server error'});
    });