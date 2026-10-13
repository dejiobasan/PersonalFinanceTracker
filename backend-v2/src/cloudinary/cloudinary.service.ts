import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(image: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        image,
        {
          folder: 'personal-finance-tracker-v2',
        },
      );

      return result.secure_url;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Image upload failed');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Image deletion failed');
    }
  }
}
