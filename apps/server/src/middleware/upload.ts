import multer from 'multer';
import { createError } from './errorHandler';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(createError('Only JPEG, PNG, and TXT files are allowed', 400) as unknown as null, false);
    }
  },
});
