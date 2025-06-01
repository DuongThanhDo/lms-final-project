import React from "react";
import { Card, Badge } from "react-bootstrap";
import "../assets/css/CourseCard.css";
import { Link } from "react-router-dom";
import { Tag } from "antd";

const CourseCard = ({ course }) => {
  return (
    <Link style={{ textDecoration: "none" }} to={`/courses/${course.id}`}>
      <Card className="shadow-sm border-0 course-card">
        <div className="image-container">
          <Card.Img
            variant="top"
            src={course.image?.file_url}
            alt={course.name}
          />
        </div>
        <Card.Body>
          <Card.Title className="course-title pt-2 mb-4" style={{ fontSize: 18 }}>{course.name}</Card.Title>
          <Card.Text className="text-muted">
            {course.teacher?.profile.name || "Giảng viên"}
          </Card.Text>
          <Tag color={course.type === "online" ? "green" : "blue"}>
            {course.type}
          </Tag>
          <div className="mt-2 pb-2">
            <strong
              style={{
                color: Number(course.price) > 0 ? "#1890ff" : "#f5222d",
                fontSize: 18
              }}
            >
              {Number(course.price) > 0 ? `${course.price}đ` : "Miễn phí"}
            </strong>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CourseCard;
