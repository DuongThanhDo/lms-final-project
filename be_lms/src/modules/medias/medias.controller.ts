import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediaService } from './medias.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {
    return this.mediaService.uploadFile(file);
  }

  @Get()
  getAllFiles() {
    return this.mediaService.getAllFiles();
  }

  @Delete(':id')
  deleteFile(@Param('id') id: number) {
    return this.mediaService.deleteFile(id);
  }
}
