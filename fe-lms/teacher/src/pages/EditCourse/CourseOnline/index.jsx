import React, { useEffect, useState } from "react";
import { Tabs, Button, message } from "antd";
import CourseOverview from "./CourseOverview";
import Curriculum from "./Curriculum";
import TargetStudents from "./TargetStudents";
import CourseImageUpload from "./CourseImageUpload";
import { CurriculumProvider } from "../../../context/CurriculumContext";
import { validateCourseData } from "../../../utils/functions/courses";
import { useParams } from "react-router-dom";
import axios from "axios";
import CourseValidationModal from "../../../components/CourseValidationModal";
import { CourseStatus } from "../../../utils/enums";
import { configs } from "../../../configs";

const { TabPane } = Tabs;

const CourseOnline = () => {
  const { id: courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [course, setCourse] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/courses/${courseId}`
      );
      const data = response.data;
      setCourse(data);
    } catch (error) {
      console.error("Lỗi tải thông tin khóa học:", error);
    }
  };

  useEffect(() => {
    if (!courseId) return;

    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/courses/all-info/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      throw new Error("Không thể lấy dữ liệu khóa học.");
    }
  };

  const submitCourse = async (courseId) => {
    try {
      const response = await axios.put(
        `${configs.API_BASE_URL}/courses/${courseId}`,
        {
          status: CourseStatus.PENDING,
        }
      );

      console.log("Khóa học đã được gửi:", response.data);
      fetchCourseDetails();
      
    } catch (error) {
      if (error.response) {
        message.error(`Lỗi từ server`);
      } else if (error.request) {
        message.error("Không nhận được phản hồi từ server.");
      } else {
        message.error("Không thể gửi khóa học.");
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const courseData = await fetchCourseData(courseId);
      const validationErrors = validateCourseData(courseData);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsModalVisible(true);
      } else {
        message.success("Dữ liệu hợp lệ, sẵn sàng gửi!");
        await submitCourse(courseId);
      }
    } catch (error) {
      message.error("Lỗi khi kiểm tra dữ liệu khóa học!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Thông tin khóa học</h2>
        {(course.status == CourseStatus.DRAFT || course.status == CourseStatus.REJECTED) && (
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={handleSubmit}
            loading={loading}
          >
            Gửi đi để xem xét
          </Button>
        )}
      </div>

      <CourseValidationModal
        errors={errors}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />

      <Tabs defaultActiveKey="1">
        <TabPane tab="Tổng quan khóa học" key="1">
          <CourseOverview />
        </TabPane>
        <TabPane tab="Chương trình giảng dạy" key="2">
          <CurriculumProvider>
            <Curriculum />
          </CurriculumProvider>
        </TabPane>
        <TabPane tab="Học viên mục tiêu" key="3">
          <TargetStudents />
        </TabPane>
        <TabPane tab="Hình ảnh khóa học" key="4">
          <CourseImageUpload />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CourseOnline;
