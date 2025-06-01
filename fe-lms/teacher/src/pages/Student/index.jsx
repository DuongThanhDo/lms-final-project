import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { configs } from "../../configs";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Students = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);

  const fetchStudentsByCourse = async (courseId) => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/course-registrations/students/${courseId}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách học viên:", error);
    }
  };

  const fetchCourseInfo = async (courseId) => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/courses/${courseId}`
      );
      setCourse(response.data);
    } catch (error) {
      console.error("Lỗi khi tải thông tin khóa học:", error);
    }
  };

  useEffect(() => {
    if (!courseId) return;

    fetchStudentsByCourse(courseId);
    fetchCourseInfo(courseId);
  }, [courseId]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên học viên",
      key: "fullName",
      render: (record) => record.user?.profile?.name || "Không có tên",
    },
    {
      title: "Email",
      key: "email",
      render: (record) => record.user?.email || "Không có email",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 32,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
          onClick={() => window.history.back()}
        />
        <h3 style={{ margin: 0 }}>
          Học viên khóa học {course?.name}
        </h3>
      </div>

      <Table
        dataSource={students}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Students;
