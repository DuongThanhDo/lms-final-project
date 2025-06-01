import React from "react";
import {
  Table,
  Tag,
  Image,
  Menu,
  Dropdown as AntDropdown,
  message,
  Modal,
} from "antd";
import {
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

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/courses/${courseId}`);
      message.success("Khóa học đã được xóa thành công");
      fetchCourses();
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error);
      message.error("Không thể xóa khóa học. Vui lòng thử lại.");
    }
  };

  const confirmDeleteCourse = (courseId) => {
    Modal.confirm({
      title: "Xác nhận xóa khóa học",
      icon: <DeleteOutlined style={{ color: "red" }} />,
      content: "Bạn có chắc chắn muốn xóa khóa học này không?",
      centered: true,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk() {
        handleDeleteCourse(courseId);
      },
    });
  };

  const handleAction = (key, record) => {
    if (key === "view") {
      navigate(`/courses/view/${record.id}`);
    } else if (key === "edit") {
      navigate(`/courses/edit/${record.id}`);
    } else if (key === "delete") {
      confirmDeleteCourse(record.id);
    }
  };

  const showRejectionReason = (reason) => {
    Modal.info({
      title: "Lý do bị từ chối",
      content: <div>{reason || "Không có lý do cụ thể"}</div>,
      okText: "Đóng",
      centered: true,
    });
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
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => category || "Chưa xác định",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price !== null && price !== undefined && price !== 0 && price !== "0.00"
          ? `${Number(price).toLocaleString()} VND`
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (status === CourseStatus.REJECTED) {
          return (
            <Tag
              color={statusColors[status]}
              style={{ cursor: "pointer" }}
              onClick={() => showRejectionReason(record.rejectionReason)}
            >
              {statusLabels[status]}
            </Tag>
          );
        }
        return <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>;
      },
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
              <Menu.Item key="view" icon={<EyeOutlined />}>
                Xem chi tiết
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />} style={{ color: "#1890ff" }}>
                Sửa khóa học
              </Menu.Item>
              {record.status === CourseStatus.DRAFT && (
                <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                  Xóa khóa học
                </Menu.Item>
              )}
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
    <Table
      columns={columns}
      dataSource={courses}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default CourseList;
