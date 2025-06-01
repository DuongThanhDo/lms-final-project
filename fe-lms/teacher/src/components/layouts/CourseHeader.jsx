import React from "react";
import { Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { CourseStatus } from "../../utils/enums";

const CourseHeader = ({ course, navigator }) => {
  return (
    <Header
      className="custom-header"
      style={{ display: "flex", alignItems: 'center' }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigator("/courses")}
      />
      <Typography.Title
        level={4}
        style={{ margin: 0, marginLeft: 12, color: "white" }}
      >
        {course?.name || "Khóa học"}
      </Typography.Title>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {course?.status == CourseStatus.PUBLISHED && (
          <Link to={`/students/${course?.id}`} style={{ color: '#1B8381', fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
            Danh sách học viên
          </Link>
        )}
      </div>
    </Header>
  );
};

export default CourseHeader;
