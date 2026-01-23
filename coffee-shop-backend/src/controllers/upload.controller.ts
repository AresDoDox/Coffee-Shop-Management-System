/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';

interface MulterRequest extends Request {
  file?: any; // Use any to bypass strict type checking for now
}

export const uploadImage = async (req: Request, res: Response) => {
  const multerReq = req as MulterRequest;
  try {
    if (!multerReq.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(multerReq.file.buffer).toString('base64');
    const dataURI = 'data:' + multerReq.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'coffee-shop-app',
      resource_type: 'auto',
    });

    res.json({
      message: 'Upload successful',
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};
