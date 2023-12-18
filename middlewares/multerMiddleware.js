const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder for uploaded files
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Set the filename for uploaded files using path.join()
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    },
});

// const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
    // Accept only jpg, jpeg, webp, and png files
    const allowedFileTypes = /jpeg|jpg|png|webp/;
    const extname = allowedFileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images with jpg, jpeg, webp, or png extensions are allowed!');
    }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });
// exports.upload = multer({ fileFilter: fileFilter });
