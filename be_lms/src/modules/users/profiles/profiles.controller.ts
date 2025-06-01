import { Body, Controller, Get, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateUserProfileDto } from './profiles.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfile } from './profiles.entity';

@Controller('user-profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: number) {
    return this.profilesService.findByUser(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.profilesService.update(id, updateUserProfileDto);
  }

  @Put('/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateProfileAvatar(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<UserProfile> {
    return this.profilesService.updateProfileAvatar(parseInt(id), file);
  }
}
