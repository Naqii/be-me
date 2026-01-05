import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from './env';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * HANYA untuk image kecil
 */
const toDataURL = (file: Express.Multer.File) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

type UploadResult = {
  url: string;
  publicId: string;
  resourceType: 'image' | 'video' | 'raw';
};

export default {
  /**
   * IMAGE
   */
  async uploadSingle(file: Express.Multer.File): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(toDataURL(file), {
        resource_type: 'image',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: 'image',
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  /**
   * VIDEO (stream, tanpa DataURL)
   */
  async uploadVideo(file: Express.Multer.File): Promise<UploadResult> {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video' },
          (error, result) => {
            if (error || !result) return reject(error);

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              resourceType: 'video',
            });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  },

  /**
   * MULTIPLE IMAGE
   */
  async uploadMultiple(files: Express.Multer.File[]): Promise<UploadResult[]> {
    try {
      return await Promise.all(files.map(this.uploadSingle));
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload multiple images');
    }
  },

  /**
   * ARCHIVE (zip, rar, 7z, tar, gz, dll)
   */
  async uploadArchive(file: Express.Multer.File): Promise<UploadResult> {
    try {
      const allowedMimeTypes = [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/x-tar',
        'application/gzip',
        'application/octet-stream', // fallback
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid archive format');
      }

      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            use_filename: true, // pakai nama asli
            unique_filename: true, // hindari collision
            filename_override: file.originalname, // PERTAHANKAN EKSTENSI
          },
          (error, result) => {
            if (error || !result) return reject(error);

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              resourceType: 'raw',
            });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      console.error('Error uploading archive:', error);
      throw new Error('Failed to upload archive');
    }
  },

  /**
   * DELETE — SATU-SATUNYA CARA YANG BENAR
   */
  async remove(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ) {
    try {
      if (!publicId) {
        throw new Error('publicId is required');
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      if (result.result !== 'ok') {
        throw new Error(`Cloudinary delete failed: ${result.result}`);
      }

      return result;
    } catch (error) {
      console.error('Error removing file:', error);
      throw error;
    }
  },
};
