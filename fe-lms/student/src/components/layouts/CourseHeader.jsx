import React from "react";
import { Button, Typography, Progress } from "antd";
import { ArrowLeftOutlined, MessageOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

const CourseHeader = ({
  course,
  navigator,
  progress,
  totalLessons,
  completedLessons,
}) => {
  return (
    <Header
      className="custom-header"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigator("/my-courses")}
      />
      <Typography.Title
        level={4}
        style={{ margin: 0, marginLeft: 12, color: "white" }}
      >
        {course?.course?.name || "Khóa học"}
      </Typography.Title>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Progress
          type="circle"
          percent={Math.round(progress)}
          size={36}
          strokeColor="#1B8381"
          format={(p) => <span style={{ color: "white" }}>{p}%</span>}
        />
        <Typography.Text style={{ color: "white" }}>
          {completedLessons}/{totalLessons} bài học
        </Typography.Text>
        <Link
          to={`/message?teacher=${course?.course?.teacher?.id}`}
          style={{
            color: "#1B8381",
            fontWeight: 600,
            fontSize: 16,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MessageOutlined style={{ fontSize: 18 }} />
          Nhắn tin
        </Link>
      </div>
    </Header>
  );
};

export default CourseHeader;
