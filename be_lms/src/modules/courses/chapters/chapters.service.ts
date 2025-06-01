import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapters.entity';
import { CreateChapterDto, GetContentByStudentDto, UpdateChapterDto } from './chapters.dto';
import { Course } from '../courses.entity';
import { Lecture } from './lectures/lectures.entity';
import { QuizSQL } from './quizSQL/quizSQL.entity';
import { CourseRegistration } from 'src/modules/registrations/course-registrations.entity';
import { LessonProgress } from 'src/modules/registrations/lesson-progress/lesson-progress.entity';
import { LessonType } from 'src/common/constants/enum';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(QuizSQL)
    private quizRepository: Repository<QuizSQL>,
    @InjectRepository(CourseRegistration)
    private courseRegistrationRepository: Repository<CourseRegistration>,
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async findAll(courseId: number): Promise<Chapter[]> {
    return await this.chapterRepository.find({
      where: { course: { id: courseId } },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!chapter)
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    return chapter;
  }

  async create(dto: CreateChapterDto): Promise<Chapter> {
    const course = await this.courseRepository.findOne({
      where: { id: Number(dto.courseId) },
    });
    if (!course)
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);

    const maxOrder = await this.chapterRepository
      .createQueryBuilder('chapter')
      .select('MAX(chapter.order)', 'max')
      .where('chapter.course = :courseId', { courseId: dto.courseId })
      .getRawOne();

    const newOrder = (maxOrder?.max ?? 0) + 1;

    const newChapter = this.chapterRepository.create({
      ...dto,
      course,
      order: newOrder,
    });

    return await this.chapterRepository.save(newChapter);
  }

  async update(id: number, dto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    Object.assign(chapter, dto);
    return await this.chapterRepository.save(chapter);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chapterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
  }

  async getTotalDurationForChapter(chapterId: number): Promise<number> {
    const [lectures, quizzes] = await Promise.all([
      // const [lectures, exercises, quizzes] = await Promise.all([
      this.lectureRepository.find({ where: { chapter: { id: chapterId } } }),
      // this.codeExerciseRepository.find({ where: { chapter: { id: chapterId } } }),
      this.quizRepository.find({ where: { chapter: { id: chapterId } } }),
    ]);

    const totalLectureDuration = lectures.reduce(
      (sum, l) => sum + (l.duration || 0),
      0,
    );
    return totalLectureDuration;
  }

  // Hàm lấy danh sách khóa học tương ứng theo từng chương cho khóa học
  async getChaptersWithContent(courseId: number): Promise<any[]> {
    const chapters = await this.chapterRepository.find({
      where: { course: { id: courseId } },
      relations: ['lectures', 'lectures.video', 'quizzes'],
      order: { order: 'ASC' },
    });

    const chaptersWithContent = await Promise.all(
      chapters.map(async (chapter) => {
        const lectures = chapter.lectures
          ? chapter.lectures.map((lecture) => ({
              type: 'lecture',
              id: lecture.id,
              title: lecture.title,
              video: lecture.video ?? null,
              order: lecture.order,
              description: lecture.description,
              duration: lecture.duration,
            }))
          : [];

        const quizzes = chapter.quizzes
          ? chapter.quizzes.map((quiz) => ({
              type: 'quiz',
              id: quiz.id,
              title: quiz.name,
              order: quiz.order,
              quizFB_id: quiz.quizFB_id
            }))
          : [];

        const durationChapter = await this.getTotalDurationForChapter(
          chapter.id,
        );

        return {
          id: chapter.id,
          title: chapter.title,
          duration: durationChapter,
          items: [...lectures, ...quizzes].sort((a, b) => a.order - b.order),
        };
      }),
    );

    return chaptersWithContent;
  }

  // Hàm lấy danh sách bài học có "Tiến độ học tập" tương ứng theo từng chương cho khóa học
  async getChaptersWithContentAndProgress(dto: GetContentByStudentDto): Promise<any[]> {
    const { courseId, userId } = dto;
    
    const chapters = await this.chapterRepository.find({
      where: { course: { id: courseId } },
      relations: ['lectures', 'lectures.video', 'quizzes'],
      order: { order: 'ASC' },
    });
  
    const courseRegistration = await this.courseRegistrationRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
    });
  
    if (!courseRegistration) {
      throw new Error('User chưa đăng ký khóa học này');
    }
  
    const lessonProgresses = await this.lessonProgressRepository.find({
      where: { courseRegistration: { id: courseRegistration.id } },
    });
  
    const getLessonProgressData = (lessonId: number, type: LessonType) => {
      return lessonProgresses.find(lp => (lp.lesson_id === lessonId && lp.type === type));
    };
  
    const chaptersWithContent = await Promise.all(
      chapters.map(async (chapter) => {
        const lectures = chapter.lectures?.map((lecture) => {
          const progress = getLessonProgressData(lecture.id, LessonType.LECTURE);
          return {
            type: 'lecture',
            id: lecture.id,
            title: lecture.title,
            video: lecture.video ?? null,
            order: lecture.order,
            description: lecture.description,
            duration: lecture.duration,
            lesson_id: progress?.id,
            status: progress?.status ?? false,
            progress: progress?.progress ?? 0,
            score: progress?.score ?? null,
          };
        }) || [];
  
        const quizzes = chapter.quizzes?.map((quiz) => {
          const progress = getLessonProgressData(quiz.id, LessonType.QUIZ);
          return {
            type: 'quiz',
            id: quiz.id,
            title: quiz.name,
            quizFB_id: quiz.quizFB_id,
            order: quiz.order,
            lesson_id: progress?.id,
            status: progress?.status ?? false,
            progress: progress?.progress ?? 0,
            score: progress?.score ?? null,
          };
        }) || [];
  
        const durationChapter = await this.getTotalDurationForChapter(chapter.id);
  
        return {
          id: chapter.id,
          title: chapter.title,
          duration: durationChapter,
          items: [...lectures, ...quizzes].sort((a, b) => a.order - b.order),
        };
      }),
    );
  
    return chaptersWithContent;
  }
  
}
