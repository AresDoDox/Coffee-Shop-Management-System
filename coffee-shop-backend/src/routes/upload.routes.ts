import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';

const router = express.Router();

// Use memory storage to process file in buffer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

router.post('/', upload.single('image'), uploadImage);

export default router;
