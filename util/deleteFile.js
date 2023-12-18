const fs = require('fs');

exports.deleteFileSync = (filePath) => {
    try {
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            throw new Error("File doesn't exists");
            }

        // Delete the file synchronously
        fs.unlinkSync(filePath);
        
    } catch (error) {
        throw new Error('Could not delete file!!');
    }
}


