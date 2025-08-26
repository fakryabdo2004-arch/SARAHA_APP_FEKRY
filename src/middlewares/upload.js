import multer from 'multer';

const storage = multer.memoryStorage();
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'));
  }
  cb(null, true);
};

export default multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });