import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from "@ant-design/icons";
import { assets } from "../../assets";

const Footer = () => {
  return (
    <footer style={{backgroundColor: "#181821", color: "#C0C0C0", paddingTop: "60px", marginTop: "100px"}}>
      <Container>
        <Row className="pb-4">
          <Col md={4} className="mb-2 text-start">
            <h5 className="d-flex align-items-center mb-4" style={{color: "#1B8381"}}>
              <img
                src={assets.images.logo}
                alt="Logo"
                width="40"
                className="me-2"
              />
              Liên hệ với chúng tôi
            </h5>
            <p>
              <strong>Điện thoại:</strong>{" "}
              <a href="tel:1919 8989" style={{color: "#C0C0C0"}} className="text-decoration-none">
                1919 8989
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:eduhub@mail.edu.vn" style={{color: "#C0C0C0"}} className="text-decoration-none">
                eduhub@mail.edu.vn
              </a>
            </p>
            <p>
              <strong>Địa chỉ:</strong> Số 1, kiệt 41, Hồ Đắc Di, TP Huế
            </p>
          </Col>

          <Col md={4} className="mb-2 text-start">
            <h5 className="mb-4" style={{color: "#1B8381"}}>Khám phá Eduhub</h5>
            <p><a href="#" style={{color: "#C0C0C0"}} className="text-decoration-none">Tải ứng dụng</a></p>
            <p><a href="#" style={{color: "#C0C0C0"}} className="text-decoration-none">Đơn vị liên kết</a></p>
            <p><a href="#" style={{color: "#C0C0C0"}} className="text-decoration-none">Trợ giúp và hỗ trợ</a></p>
          </Col>

          <Col md={4} className="mb-2 text-start" style={{color: "#1B8381"}}>
            <h5 className="mb-4">Pháp lý và khả năng tiếp cận</h5>
            <p><a href="#" style={{color: "#C0C0C0"}} className="text-decoration-none">Chính sách về quyền riêng tư</a></p>
            <p><a href="#" style={{color: "#C0C0C0"}} className="text-decoration-none">Sơ đồ trang web</a></p>
            <p><a href="#" style={{color: "#C0C0C0"}} className="text-decoration-none">Điều khoản</a></p>
          </Col>
        </Row>

        {/* Border Top & Bản quyền */}
        <Row className="border-top border-light p-3">
          <Col className="d-flex justify-content-between align-items-center">
            <p className="mb-0">© 2024 - 2030 - Bản quyền từ Eduhub.</p>
            <div className="social-icons">
              <a href="#" style={{color: "#C0C0C0"}} className="mx-2">
                <InstagramOutlined style={{ fontSize: 24 }} />
              </a>
              <a href="#" style={{color: "#C0C0C0"}} className="mx-2">
                <YoutubeOutlined style={{ fontSize: 24 }} />
              </a>
              <a href="#" style={{color: "#C0C0C0"}} className="mx-2">
                <FacebookOutlined style={{ fontSize: 24 }} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
