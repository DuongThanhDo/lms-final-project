export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export enum CourseType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  REJECTED = 'rejected',
}

export enum CommentableType {
  LECTURE = 'lecture',
  CODE = 'code',
  QUIZ = 'quiz',
  COMMENT = 'comment'
}

export enum StatusPayment {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum LessonType {
  LECTURE = 'lecture',
  QUIZ = 'quiz',
  CODE = 'code'
}

export enum CertificateStatus {
  INIT = 'init',
  ACTIVE = 'active',
  LOCKED = 'locked',
}