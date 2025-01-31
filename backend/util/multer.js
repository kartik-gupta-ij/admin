const multer = require('multer');
const fs = require("fs");
module.exports = multer.diskStorage({
  filename: (req, file, callback) => {
    const filename =
      Date.now() + Math.floor(Math.random() * 100) + file.originalname;
    const newFile = filename.replaceAll(' ', '-');
    callback(null, newFile);
  },
  destination: (req, file, callback) => {
    if (!fs.existsSync('storage')) {
      fs.mkdirSync('storage');
    }
    callback(null, 'storage');
  },
});
