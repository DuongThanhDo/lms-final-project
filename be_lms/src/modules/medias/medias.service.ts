import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  async uploadFile(file: any): Promise<Media> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result: UploadApiResponse) => {
        if (error) return reject(error);
        
        const media = this.mediaRepository.create({
          file_name: file.originalname,
          file_folder: result.folder || null,
          file_url: result.secure_url,
          file_type: result.resource_type,
          cloud_id: result.public_id,
          service: 'cloudinary',
          duration: result.duration,
        });

        await this.mediaRepository.save(media);
        resolve(media);
      }).end(file.buffer);
    });
  }

  async getAllFiles(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  async deleteFile(id: number): Promise<void> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new Error('File not found');

    await cloudinary.uploader.destroy(media.cloud_id);
    await this.mediaRepository.remove(media);
  }
}
