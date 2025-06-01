import { CourseType } from "../enums";

export const validateCourseData = (courseData) => {
  let errors = [];

  if (!courseData.course.name || courseData.course.name.trim() === "") {
    errors.push("Tên khóa học không được để trống.");
  }
  if (!courseData.course.category) {
    errors.push("Khóa học phải có danh mục.");
  }
  if (!courseData.course.image || !courseData.course.image.file_url) {
    errors.push("Khóa học phải có hình ảnh.");
  }
  if (!courseData.course.price) {
    errors.push("Khóa học phải có giá.");
  }

  if (!courseData.outcomes || courseData.outcomes.length === 0) {
    errors.push("Khóa học phải có ít nhất một mục tiêu.");
  }

  if (!courseData.requirements || courseData.requirements.length === 0) {
    errors.push("Khóa học phải có ít nhất một yêu cầu.");
  }

  if (courseData.course.type == CourseType.ONLINE) {
    if (!courseData.contents || courseData.contents.length === 0) {
      errors.push("Khóa học phải có ít nhất một chương.");
    } else {
      courseData.contents.forEach((chapter, index) => {
        if (!chapter.items || chapter.items.length === 0) {
          errors.push(
            `Chương ${index + 1} (${chapter.title}) không có bài giảng nào.`
          );
        } else {
          chapter.items.forEach((lecture, lectureIndex) => {
            if (!lecture.title || lecture.title.trim() === "") {
              errors.push(
                `Bài giảng ${lectureIndex + 1} trong chương "${
                  chapter.title
                }" không có tiêu đề.`
              );
            }
            if (lecture.video && !lecture.video.file_url) {
              errors.push(
                `Bài giảng "${lecture.title}" có video nhưng không có đường dẫn.`
              );
            }
          });
        }
      });
    }
  }

  return errors;
};
