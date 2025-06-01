import React from "react";
import { Button } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import HeroSection from "../../components/HeroSection";
import { assets } from "../../assets";
import { CheckCircleOutlined } from "@ant-design/icons";

const reasons = [
  "Giảng viên hàng đầu",
  "Hỗ trợ 24/7",
  "Học tập linh hoạt, mọi lúc mọi nơi",
  "Ứng dụng công nghệ hiện đại",
  "Lộ trình cá nhân hóa",
];

const About = () => {
  return (
    <>
      <HeroSection />

      <Container className="my-5 p-4 bg-light text-center rounded">
        <h3 className="text-primary">Sứ mệnh của chúng tôi</h3>
        <p className="px-5">
          Chúng tôi cung cấp kiến thức, rèn luyện kỹ năng thực tiễn và nâng cao
          cơ hội nghề nghiệp cho học viên. Trung tâm cam kết tạo môi trường học
          tập chất lượng, khuyến khích tư duy sáng tạo và luôn đồng hành, hỗ trợ
          học viên đạt được mục tiêu một cách hiệu quả.
        </p>
      </Container>

      <Container className="my-5">
        <Row className="align-items-center">
          {/* Hình ảnh minh họa */}
          <Col md={6}>
            <img
              src={assets.images.about1}
              alt="Giới thiệu"
              className="img-fluid"
            />
          </Col>

          {/* Nội dung giới thiệu */}
          <Col md={6} className="p-4">
            <h3>Giới thiệu</h3>
            <p>
              Chào mừng bạn đến với EduHub, nền tảng học tập trực tuyến giúp bạn
              tiếp cận tri thức dễ dàng và linh hoạt. Với đội ngũ giảng viên
              chất lượng, chúng tôi mang đến các khóa học chuyên sâu, nâng cao
              kỹ năng và cơ hội nghề nghiệp. Hãy đồng hành cùng EduHub để chinh
              phục tri thức và phát triển bản thân!
            </p>

            {/* Những giải pháp cho bạn */}
            <h4 className="mt-4">Những giải pháp cho bạn</h4>
            <ul className="list-unstyled">
              <li className="d-flex align-items-start mb-3">
                <span className="me-2"><CheckCircleOutlined style={{ color: "#1B8381" }} /></span>
                <div>
                  <strong>Chọn khóa học</strong>
                  <p className="mb-0">
                    Tìm khóa học phù hợp với mục tiêu của bạn và dễ dàng đăng ký
                    tại EduHub. Đội ngũ giảng viên chất lượng mang đến nội dung
                    chuyên sâu, giúp bạn nâng cao kiến thức và kỹ năng.
                  </p>
                </div>
              </li>

              <li className="d-flex align-items-start mb-3">
                <span className="me-2"><CheckCircleOutlined style={{ color: "#1B8381" }} /></span>
                <div>
                  <strong>Học tập linh hoạt</strong>
                  <p className="mb-0">
                    Lựa chọn lộ trình và thời gian học linh hoạt theo nhu cầu
                    của bạn. Hệ thống học tập trực tuyến giúp bạn theo dõi tiến
                    trình hiệu quả nhất.
                  </p>
                </div>
              </li>

              <li className="d-flex align-items-start">
                <span className="me-2"><CheckCircleOutlined style={{ color: "#1B8381" }} /></span>
                <div>
                  <strong>Nhận hỗ trợ từ giảng viên</strong>
                  <p className="mb-0">
                    Đội ngũ giảng viên và chuyên gia giàu kinh nghiệm luôn sẵn
                    sàng hỗ trợ, cùng bạn giải quyết vấn đề chi tiết để đạt được
                    mục tiêu học tập một cách tốt nhất.
                  </p>
                </div>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6} className="p-4">
            <h3 className="fw-bold">Tại sao chọn EduHub?</h3>
            <p>
              Khám phá những lý do bạn nên lựa chọn EduHub để nâng cao kiến thức
              và phát triển bản thân. Chúng tôi mang đến nền tảng học tập chất
              lượng, linh hoạt và cá nhân hóa, giúp bạn tiếp cận tri thức dễ
              dàng và hiệu quả. Hãy cùng EduHub chinh phục tri thức và mở rộng
              cơ hội nghề nghiệp!
            </p>

            <ul className="list-unstyled">
              {reasons.map((reason, index) => (
                <li key={index} className="d-flex align-items-center mb-2">
                  <CheckCircleOutlined style={{ color: "#1B8381" }} /> <span className="ms-2">{reason}</span>
                </li>
              ))}
            </ul>

            <Button
              type="primary"
              style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
            >
              Đăng ký ngay
            </Button>
          </Col>

          <Col md={6} className="text-center">
            <img
              src={assets.images.about2}
              alt="Lý do chọn EduHub"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
