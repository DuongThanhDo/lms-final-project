import React from "react";
import { Card, Button, Typography, Space, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ReadOutlined,
  BookOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { configs } from "../configs";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const CourseInfoSell = ({ course }) => {
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate()

  const handleBuyCourse = async () => {
    if (Number(course.price) > 0) {
      try {
        const response = await axios.get(
          `${configs.API_BASE_URL}/payment/create`,
          {
            params: {
              courseId: course.id,
              userId: user.id,
              amount: course.price,
            },
          }
        );
        console.log(response);

        if (response.data && response.data.url) {
          window.location.href = response.data.url;
        } else {
          message.error("Không thể tạo URL thanh toán.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo thanh toán:", error);
        message.error("Đã có lỗi xảy ra khi xử lý thanh toán.");
      }
    } else {
      try {
        await axios.post(`${configs.API_BASE_URL}/course-registrations`, {
          userId: user.id,
          courseId: course.id,
        });
      } catch (error) {
        message.error("Đăng ký khóa học miễn phí thất bại!");
      } finally {
        message.success("Đăng ký khóa học miễn phí thành công!");
        setTimeout(() => {
          navigate(`/my-courses`);
        }, 1000);
      }
    }
  };

  return (
    <Card
      hoverable
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      cover={
        <img
          alt={course.name}
          src={course.image?.file_url}
          style={{ height: 160, objectFit: "cover" }}
        />
      }
    >
      <Title
        level={4}
        style={{ color: "#f5222d", marginBottom: 8, textAlign: "center" }}
      >
        {Number(course.price) > 0 ? course.price + "đ" : "Miễn phí"}
      </Title>

      <Button
        type="primary"
        block
        onClick={handleBuyCourse}
        style={{ marginBottom: 16, backgroundColor: "#00bfa6", border: "none" }}
      >
        Đăng ký học
      </Button>

      <Space direction="vertical" size={10}>
        <Text>
          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          Cơ bản đến nâng cao
        </Text>
        <Text>
          <ReadOutlined style={{ color: "#1890ff", marginRight: 8 }} />
          Tài liệu đi kèm
        </Text>
        <Text>
          <BookOutlined style={{ color: "#722ed1", marginRight: 8 }} />
          Linh hoạt thời gian
        </Text>
        <Text>
          <ClockCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
          Học mọi thiết bị
        </Text>
      </Space>
    </Card>
  );
};

export default CourseInfoSell;
