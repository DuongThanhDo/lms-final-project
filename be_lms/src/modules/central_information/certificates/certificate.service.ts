import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCertificateDto, UpdateCertificateDto } from './certificate.dto';
import { Certificate } from './certificate.entity';
import { Course } from 'src/modules/courses/courses.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private repo: Repository<Certificate>,
    @InjectRepository(Course)
    private repoCourse: Repository<Course>,
  ) {}

  create(dto: CreateCertificateDto) {
    const cert = this.repo.create(dto);
    return this.repo.save(cert);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findAllStatus(status: boolean) {
    return await this.repo.find({ where: { status: Boolean(status) } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateCertificateDto) {
    const cert = await this.repo.findOneBy({ id });
    if (!cert) throw new NotFoundException('Không tìm thấy chứng chỉ');

    Object.assign(cert, dto);
    return this.repo.save(cert);
  }

  async remove(id: number) {
    const cert = await this.repo.findOneBy({ id });
    const courses = await this.repoCourse.find({
      where: { certificate: { id: id } },
    });
    if (courses.length > 0)
      throw new NotFoundException('Đang có khóa học sử dụng chứng chỉ này');
    if (!cert) throw new NotFoundException('Không tìm thấy chứng chỉ');
    return this.repo.remove(cert);
  }
}
