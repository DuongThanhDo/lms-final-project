import React from "react";
import { Card, Progress } from "antd";
import { Link } from "react-router-dom";

const { Meta } = Card;

const MyCourseItem = ({ course }) => {
  const courseData = course.course;
  const teacherName = courseData.teacher?.profile?.name || "Giáo viên ẩn danh";
  const courseTitle = courseData.name || "Tên khóa học";
  const courseImage = courseData.image?.file_url;
  const progress = course.progress || 0;

  return (
    <Link style={{ textDecoration: "none" }} to={`${courseData.id}`}>
      <Card
        hoverable
        style={{ width: "100%" }}
        bodyStyle={{ padding: 12 }}
        cover={
          courseImage ? (
            <img
              alt={courseTitle}
              src={courseImage}
              style={{
                height: 160,
                objectFit: "cover",
                width: "100%",
              }}
            />
          ) : (
            <div
              className="bg-gray-100 flex items-center justify-center"
              style={{ height: 140 }}
            >
              <span className="text-gray-400">Ảnh khóa học</span>
            </div>
          )
        }
      >
        <Meta
          title={
            <div style={{ minHeight: 40, fontWeight: 600 }}>{courseTitle}</div>
          }
          description={
            <div style={{ color: "gray", fontSize: 13 }}>{teacherName}</div>
          }
        />

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}>
            Hoàn thành {progress}%
          </div>
          <Progress
            percent={progress}
            size="small"
            strokeColor="#722ED1"
            showInfo={false}
          />
        </div>
      </Card>
    </Link>
  );
};

export default MyCourseItem;
