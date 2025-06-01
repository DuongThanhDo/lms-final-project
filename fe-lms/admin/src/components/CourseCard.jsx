import React, { useState } from "react";
import { Card, Dropdown, Button, Badge } from "react-bootstrap";
import { Menu, Dropdown as AntDropdown } from "antd";
import { EllipsisOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import "../assets/css/CourseCard.css"


const CourseCard = ({ course }) => {
  const [checked, setChecked] = useState(course.published);

  const handleToggle = () => {
    setChecked(!checked);
  };

  const menu = (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} >
        Xem chi tiết
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} style={{ color: "#1890ff" }}>
        Sửa khóa học
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Xóa khóa học
      </Menu.Item>
    </Menu>
  );

  return (
    <Card className="p-3 shadow-sm course-card">
      <div className="d-flex align-items-center justify-content-between" style={{ minHeight: "48px" }}>
        <h5 className="m-0">{course.title}</h5>

        <AntDropdown overlay={menu} trigger={["click"]}>
          <Button variant="light" className="border-0">
            <EllipsisOutlined style={{ fontSize: "18px" }} />
          </Button>
        </AntDropdown>
      </div>

      <div className="image-container"><Card.Img variant="top" src={course.image} className="mt-2 rounded course-image" /></div>

      <div className="mt-2">
        <p>
          <Badge bg="secondary">{course.category}</Badge> • {course.mode}
        </p>
        <p className="fw-bold text-primary">{course.price} VNĐ</p>
      </div>
    </Card>
  );
};

export default CourseCard;