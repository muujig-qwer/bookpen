import multer from 'multer';
import path from 'path';

// Upload хадгалах фолдер: 'uploads/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // timestamp + өргөтгөл
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
