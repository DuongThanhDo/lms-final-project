import React from "react";
import { Button } from "antd";
import { assets } from "../assets";
import { Row, Col } from "react-bootstrap";

const HeroSection = () => {
  return (
    <div className="container py-5">
      <Row className="align-items-center">
        <Col md={12} className="text-center mb-4">
          <img
            src={assets.images.banner1}
            alt="Giảng viên và học viên"
            className="w-100"
          />
        </Col>

        <Col md={12}>
          <Row className="mt-5">
            <Col md={8}>
              <h5 className="text-muted">Kết nối giảng viên và học viên</h5>
              <h2 className="fw-bold">Đăng ký và học tập cùng với giảng viên</h2>
              <p className="text-muted">
                Học hỏi từ những chuyên gia hàng đầu với nhiều năm kinh nghiệm
                trong giảng dạy và thực tiễn, giúp bạn phát triển toàn diện và
                chinh phục mọi thử thách.
              </p>
              <Button
                type="primary"
                style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
              >
                Đăng ký ngay
              </Button>
            </Col>

            <Col md={4} className="d-flex gap-4 justify-content-end align-items-center" style={{color: "#1B8381"}}>
              <div>
                <h4 className="fw-bold">145k+</h4>
                <p className="text-muted">Số học viên</p>
              </div>
              <div>
                <h4 className="fw-bold">20+</h4>
                <p className="text-muted">Giảng viên</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;
