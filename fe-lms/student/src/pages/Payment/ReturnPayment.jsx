import React, { useEffect, useRef } from "react";
import { Card, Typography, Button, Space } from "antd";
import { CheckCircle, Clock, XCircle } from "react-bootstrap-icons";
import { StatusPayment } from "../../utils/enums";
import { Link } from "react-router-dom";
import { configs } from "../../configs";
import axios from "axios";
import { useSelector } from "react-redux";

const { Title, Paragraph } = Typography;

const ReturnPayment = ({ status, courseId }) => {
  const user = useSelector((state) => state.auth.userInfo);
  const sentEmailRef = useRef(false);

  useEffect(() => {
    if (
      status === StatusPayment.COMPLETED &&
      user.email &&
      !sentEmailRef.current 
    ) {
      sendEmail(user.email);
      sentEmailRef.current = true;
    }
  }, [status, user.email]);

  const sendEmail = async (email) => {
    try {
      await axios.post(`${configs.API_BASE_URL}/mailer/send`, {
        to: email,
        subject: "Xác nhận thanh toán khóa học",
        html: `<p>Cảm ơn bạn đã thanh toán thành công khóa học. Chúc bạn học tập hiệu quả!</p>`,
      });
      console.log("Email đã được gửi thành công");
    } catch (error) {
      console.error("Gửi email thất bại:", error.response?.data || error.message);
    }
  };

  let icon = null;
  let title = "";
  let description = "";

  switch (status) {
    case StatusPayment.COMPLETED:
      icon = <CheckCircle className="text-success" size={64} />;
      title = "Thanh toán thành công!";
      description =
        "Cảm ơn bạn đã thanh toán. Bạn có thể bắt đầu học ngay bây giờ.";
      break;
    case StatusPayment.FAILED:
      icon = <XCircle className="text-danger" size={64} />;
      title = "Thanh toán thất bại!";
      description =
        "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.";
      break;
    case StatusPayment.PENDING:
    default:
      icon = (
        <Clock
          className="text-warning animate__animated animate__pulse animate__infinite"
          size={64}
        />
      );
      title = "Đang xử lý thanh toán...";
      description =
        "Vui lòng chờ trong giây lát. Đang kiểm tra trạng thái thanh toán.";
      break;
  }

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Card style={{ width: 400 }} className="text-center shadow" bordered>
        <Space direction="vertical" size="middle" className="w-100">
          <div>{icon}</div>
          <Title level={3}>{title}</Title>
          <Paragraph type="secondary">{description}</Paragraph>
          <Link to={courseId === 0 ? "/courses" : `/courses/${courseId}`}>
            <Button type="primary" block>
              {courseId === 0 ? "Quay về khóa học" : "Đi tới khóa học"}
            </Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export default ReturnPayment;
