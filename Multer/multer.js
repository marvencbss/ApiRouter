const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));
    },
    limits: { fileSize: 50 * 1024 * 1024 }
});

const upload = multer({ storage });
module.exports = upload;