import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { createError } from './errorHandler';

const filesDir = path.join(env.UPLOADS_DIR, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => void cb(null, filesDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(createError('Only JPEG, PNG, and TXT files are allowed', 400) as unknown as null, false);
    }
  },
});
