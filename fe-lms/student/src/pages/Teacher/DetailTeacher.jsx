import { useEffect, useState } from "react";
import { Card, message } from "antd";
import { Row, Col } from "react-bootstrap";
import CourseCard from "../../components/CourseCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import { configs } from "../../configs";

const DetailTeacher = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState({});
  const [courses, setCourses] = useState([]);

  const fetchDataTeacher = async () => {
    try {
      const responseProfile = await axios.get(`${configs.API_BASE_URL}/user-profiles/${id}`);
      const responseProfes = await axios.get(`${configs.API_BASE_URL}/professions/${id}`);
      setTeacher({
        profile: responseProfile.data,
        profession: responseProfes.data[0],
      });
    } catch (error) {
      console.log(error);
      message.error('Lỗi lấy thông tin giảng viên')
    }
  }
  const fetchCourseTeacher = async () => {
    try {
      const response = await axios.get(`${configs.API_BASE_URL}/courses/top-courses`, {
          params: { teacherId: id, limit: 4 },
        })
      setCourses(response.data)
    } catch (error) {
      console.log(error);
      message.error('Lỗi lấy khóa học của giảng viên')
    }
  }

  useEffect(() => {
    fetchDataTeacher();
    fetchCourseTeacher();
  }, [])

  console.log(teacher);
  
  return (
    <div className="container mt-4">
      <Row>
        <Col md={3}>
          <Card className="shadow-sm rounded-3 border-0 text-center p-3">
            <img
              src={teacher.profile?.avatar?.file_url}
              alt="Teacher"
              className="rounded-circle mx-auto d-block"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
            <h4 className="mt-3">{teacher.profile?.name}</h4>
            <div className="row mt-4">
              <div className="col-6">
                <h5 className="fw-bold">5200</h5>
                <p className="text-muted">Học viên</p>
              </div>
              <div className="col-6">
                <h5 className="fw-bold">123</h5>
                <p className="text-muted">Đánh giá</p>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={9}>
          <Card className="shadow-sm rounded-3 border-0 p-3">
            <h5 className="fw-bold">Thông tin giảng viên</h5>
            <p>
              <strong>Chuyên Ngành:</strong> {teacher.profession?.major}
            </p>
            <p>
              <strong>Trình độ:</strong> {teacher.profession?.level}
            </p>
            <p>
              <strong>Gọi điện:</strong> {teacher.profile?.phone}
            </p>
            <p>
              <strong>Email:</strong> {teacher.profile?.user?.email}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {teacher.profile?.address}
            </p>
            <h5 className="fw-bold">Kinh nghiệm làm việc</h5>
            <p>{teacher.profession?.bio}</p>
          </Card>
        </Col>
      </Row>

      <h2 className="mt-5">Khóa học của giáo viên</h2>
      <Row className="mt-4 g-4">
        {courses.map((course) => (
          <Col key={course.id} md={6} lg={4} xl={3}>
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DetailTeacher;
