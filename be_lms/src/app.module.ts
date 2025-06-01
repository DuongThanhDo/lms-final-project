import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './modules/users/profiles/profiles.module';
import { ProfessionsService } from './modules/users/professions/professions.service';
import { ProfessionsModule } from './modules/users/professions/professions.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ChaptersModule } from './modules/courses/chapters/chapters.module';
import { LecturesModule } from './modules/courses/chapters/lectures/lectures.module';
import { CentralInformationModule } from './modules/central_information/central-information.module';
import { RoomModule } from './modules/central_information/rooms/room.module';
import { MediaModule } from './modules/medias/medias.module';
import { CategoriesModule } from './modules/central_information/categories/categories.module';
import { CourseOutcomesModule } from './modules/courses/outcomes/course-outcomes.module';
import { CourseRequirementsModule } from './modules/courses/requirements/course-requirements.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NoteModule } from './modules/courses/chapters/lectures/notes/notes.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { QuizSQLModule } from './modules/courses/chapters/quizSQL/quizSQL.module';
import { CourseRegistrationsModule } from './modules/registrations/course-registrations.module';
import { LessonProgressesModule } from './modules/registrations/lesson-progress/less-progress.module';
import { PaymentModule } from './modules/payments/payment.module';
import { VNPaymentModule } from './modules/payments/vnpay/vnpay.module';
import { CourseScheduleModule } from './modules/courses/schedules/course-schedule.module';
import { CertificateModule } from './modules/central_information/certificates/certificate.module';
import { MessagesModule } from './modules/messages/messages.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { StudentCertModule } from './modules/central_information/certificates/student_cert/student-cert.module';
import { OpenAIModule } from './modules/openai/openai.module';
import { MailerCustomModule } from './modules/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    ProfilesModule,
    ProfessionsModule,
    CoursesModule,
    ChaptersModule,
    LecturesModule,
    CentralInformationModule,
    RoomModule,
    MediaModule,
    CategoriesModule,
    CourseOutcomesModule,
    CourseRequirementsModule,
    CommentsModule,
    NoteModule,
    FirebaseModule,
    QuizSQLModule,
    CourseRegistrationsModule,
    LessonProgressesModule,
    PaymentModule,
    VNPaymentModule,
    CourseScheduleModule,
    CertificateModule,
    MessagesModule,
    StatisticsModule,
    StudentCertModule,
    OpenAIModule,
    MailerCustomModule
  ],
  controllers: [AppController],
  providers: [AppService, ProfessionsService],
})
export class AppModule {}
