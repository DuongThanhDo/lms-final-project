import React from "react";
import { Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";

const CourseHeader = ({ course, navigator }) => {
  return (
    <Header className="custom-header">
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigator("/courses")} />
      <Typography.Title level={4} style={{ margin: 0, marginLeft: 12, color: "white" }}>
        {course?.name || "Khóa học"}
      </Typography.Title>
    </Header>
  );
};

export default CourseHeader;

