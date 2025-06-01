import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './profiles.entity';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './profiles.dto';
import { MediaService } from 'src/modules/medias/medias.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private readonly mediaService: MediaService,
  ) {}

  async findByUser(userId: number): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'avatar'],
    });

    if (!profile) {
      throw new NotFoundException(
        `Hồ sơ cho ID người dùng ${userId} không được tìm thấy`,
      );
    }

    return profile;
  }

  async update(id: number, dto: UpdateUserProfileDto): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Không tìm thấy hồ sơ với ID ${id}`);
    }

    Object.assign(profile, dto);
    return this.userProfileRepository.save(profile);
  }

  async updateProfileAvatar(id: number, file: any): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { id: id },
      relations: ['avatar'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.avatar && profile.avatar.file_type != "google") {
      const avatarId = profile.avatar.id;
      profile.avatar = null; 
      await this.userProfileRepository.save(profile);
      await this.mediaService.deleteFile(avatarId);
    }

    const media = await this.mediaService.uploadFile(file);
    profile.avatar = media;

    return this.userProfileRepository.save(profile);
  }
}
