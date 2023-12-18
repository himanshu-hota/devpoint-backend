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
app.use(cors({ credentials: true, origin:'http://localhost:5173'}));
// Define the path to the 'upload' folder
// const uploadFolderPath = path.join(__dirname, 'uploads');
// Serve files from the 'upload' folder
// app.use('/uploads', express.static(uploadFolderPath));


// routes
app.get('/',(req,res) => {
    res.json('test ok');
})

app.use('/auth',authRoutes);
app.use('/blog',upload.single('file'), blogRoutes);
app.use('/blogs', blogsRoutes);
app.use('/user', upload.single('file'), userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
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
    res.status(500).send('Something went wrong there!!');
});


// Create a Mongoose connection using promises
mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server after the database connection is established
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });