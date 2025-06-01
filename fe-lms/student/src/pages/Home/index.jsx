import React, { useEffect, useState } from "react";
import HeroSection from "../../components/HeroSection";
import { Col, Row } from "react-bootstrap";
import CourseCard from "../../components/CourseCard";
import { Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { configs } from "../../configs";

const Home = () => {
  const [hotCourses, setHotCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [cateTwoCourses, setCateTwoCourses] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  const fetchCourses = async () => {
    try {
      const [hot, free, cate2, topCate] = await Promise.all([
        axios.get(`${configs.API_BASE_URL}/courses/top-courses`, {
          params: { limit: 4 },
        }),
        axios.get(`${configs.API_BASE_URL}/courses/top-courses`, {
          params: { isFree: true, limit: 4 },
        }),
        axios.get(`${configs.API_BASE_URL}/courses/top-courses`, {
          params: { category: 2, limit: 4 },
        }),
        axios.get(`${configs.API_BASE_URL}/categories/top`, {
          params: { limit: 8 },
        }),
      ]);

      setHotCourses(hot.data);
      setFreeCourses(free.data);
      setCateTwoCourses(cate2.data);
      setTopCategories(topCate.data);
    } catch (error) {
      console.error('Lỗi khi fetch courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <HeroSection />

      <h1 style={{ color: "#1B8381", marginTop: "40px", marginBottom: "60px" }}>
        Khóa học sẽ học tiếp theo
      </h1>

      <h2>Được đề xuất cho bạn</h2>
      <Row className="my-5">
        {hotCourses.map((course) => (
          <Col key={course.id} md={6} lg={4} xl={3} className="mb-4">
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>

      <h2>Khóa học miễn phí</h2>
      <Row className="my-5">
        {freeCourses.map((course) => (
          <Col key={course.id} md={6} lg={4} xl={3} className="mb-4">
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>

      <div
        style={{ background: "#E6FFFB", padding: "40px 32px", borderRadius: "8px", marginBottom: "100px" }}
      >
        <h2 style={{ color: "#00796B" }}>Chủ đề đề xuất dành cho bạn</h2>
        <Row className="g-4 mt-2">
          {topCategories.map((cate) => (
            <Col key={cate.id} xs={12} md={3}>
              <Link to={`${configs.routes.courses}?category=${cate.id}`}>
                <Button
                  type="primary"
                  style={{ width: "100%", height: "60px", backgroundColor: "#1B8381", borderColor: "#1B8381" }}
                >
                  {cate.name}
                </Button>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      
      <h1 style={{ color: "#1B8381", marginTop: "40px", marginBottom: "60px" }}>
        Khóa học có thể bạn quan tâm
      </h1>

      <h2>Khóa học hàng đầu về an toàn thông tin</h2>
      <Row className="my-5">
        {cateTwoCourses.map((course) => (
          <Col key={course.id} md={6} lg={4} xl={3} className="mb-4">
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
