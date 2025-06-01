import React, { useState } from "react";
import {
  Table,
  Tag,
  Image,
  Menu,
  Dropdown as AntDropdown,
  message,
  Modal,
  Card,
  Input,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button } from "react-bootstrap";
import { configs } from "../configs";
import { useNavigate } from "react-router-dom";
import { CourseStatus } from "../utils/enums";
import axios from "axios";

const statusColors = {
  draft: "gray",
  pending: "orange",
  published: "green",
  hidden: "blue",
  rejected: "red",
};

const statusLabels = {
  draft: "Nháp",
  pending: "Chờ duyệt",
  published: "Đã xuất bản",
  hidden: "Ẩn",
  rejected: "Bị từ chối",
};

const CourseList = ({ courses, fetchCourses }) => {
  const navigate = useNavigate();
  const [rejectionReason, setRejectionReason] = useState("");

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(
        `${configs.API_BASE_URL}/courses/${courseId}`
      );
      message.success("Khóa học đã được xóa thành công");
      fetchCourses();
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error);
      message.error("Không thể xóa khóa học. Vui lòng thử lại.");
    }
  };

  const handleActionConfirm = async (key, record) => {
    let _status = '';
    if (key === "published") {
      _status = CourseStatus.PUBLISHED;
    } else if (key === "rejected") {
      _status = CourseStatus.REJECTED;
    } else {
      return;
    }

    try {
      await axios.put(`${configs.API_BASE_URL}/courses/${record.id}`,
        {
          status: _status,
        }
      );
      message.success('Duyệt khóa học thành công')
    } catch (error) {
      message.error("Lỗi duyệt khóa học");
    } finally {
      fetchCourses();
    }
  };

const handleAction = async (key, record) => {
  if (key === "rejected") {
    let reason = "";
    Modal.confirm({
      title: "Từ chối khóa học",
      content: (
        <div>
          <p>Vui lòng nhập lý do từ chối khóa học:</p>
          <Input.TextArea
            rows={4}
            onChange={(e) => {
              reason = e.target.value;
            }}
            placeholder="Nhập lý do từ chối..."
          />
        </div>
      ),
      okText: "Từ chối",
      cancelText: "Hủy",
      onOk: async () => {
        if (!reason.trim()) {
          message.error("Vui lòng nhập lý do từ chối");
          throw new Error();
        }
        try {
          await axios.patch(`${configs.API_BASE_URL}/courses/${record.id}/reject`, {
            status: CourseStatus.REJECTED,
            reason: reason,
          });
          message.success("Từ chối khóa học thành công");
        } catch (error) {
          message.error("Lỗi khi từ chối khóa học");
        } finally {
          fetchCourses();
        }
      },
    });
    return;
  }

  if (key === "published") {
    Modal.confirm({
      title: "Duyệt khóa học",
      icon: <CheckCircleOutlined style={{ color: "green" }} />,
      content: "Bạn có chắc chắn muốn duyệt khóa học này không?",
      okText: "Duyệt",
      cancelText: "Hủy",
      onOk() {
        handleActionConfirm(key, record);
      },
    });
  }
};


  const columns = [
    {
      title: "Khóa học",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={record.image?.file_url}
            width={80}
            height={50}
            style={{ borderRadius: 5 }}
          />
          <div style={{ marginLeft: 12, maxWidth: 300 }}>
            <div
              style={{
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/courses/view/${record.id}`)}
            >
              {record.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giáo viên",
      dataIndex: "teacher_name",
      key: "teacher_name",
      render: (teacher_name) => teacher_name || "N/A",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => category || "N/A",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price !== null && price !== undefined && price != 0 && price != "0.00"
          ? `${price.toLocaleString()} VND`
          : "Miễn phí",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "online" ? "blue" : "purple"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <AntDropdown
          overlay={
            <Menu onClick={(e) => handleAction(e.key, record)}>
              <Menu.Item
                key="published"
                icon={<CheckCircleOutlined />}
                style={{ color: "#1890ff" }}
              >
                Duyệt
              </Menu.Item>
              <Menu.Item key="rejected" icon={<CloseCircleOutlined />} danger>
                Từ chối
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button variant="light" className="border-0">
            <EllipsisOutlined style={{ fontSize: "18px" }} />
          </Button>
        </AntDropdown>
      ),
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default CourseList;
