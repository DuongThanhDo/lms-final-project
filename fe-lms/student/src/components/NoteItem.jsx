import React, { useState } from "react";
import { Button, Card, Input, Modal, Space, Typography, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { formatDuration } from "../utils/functions/time";
import { Link } from "react-router-dom";
import axios from "axios";
import { configs } from "../configs";

const { Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const NoteItem = ({ note, fetchNotes }) => {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleEdit = async () => {
    try {
      const response = await axios.patch(
        `${configs.API_BASE_URL}/notes/${note.id}`,
        {
          content: editedContent,
        }
      );
      message.success("Đã cập nhật ghi chú!");
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật ghi chú:",
        error.response?.data || error.message
      );
      message.error("Cập nhật ghi chú thất bại!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/notes/${note.id}`);
      message.success("Đã xoá ghi chú!");
      fetchNotes();
    } catch (error) {
      console.error(
        "Lỗi khi xoá ghi chú:",
        error.response?.data || error.message
      );
      message.error("Xoá ghi chú thất bại!");
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận xóa ghi chú?",
      icon: <ExclamationCircleOutlined />,
      content: "Ghi chú sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        handleDelete();
      },
    });
  };

  return (
    <Card
      className="mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Space>
          <Link
            to={`/courses/${note.course?.id}/lecture/${note.lecture?.id}?timestamp=${note.timestamp}`}
          >
            <Button type="primary" shape="round" size="small">
              {formatDuration(Number(note.timestamp))}
            </Button>
          </Link>
          <Text strong>{note.lecture?.title || "Không có tiêu đề"}</Text>
        </Space>

        {hovered && !isEditing && (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => setIsEditing(true)}
            />
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={(e) => {
                e.stopPropagation();
                showDeleteConfirm();
              }}
            />
          </Space>
        )}

        {isEditing && (
          <Space>
            <Button
              icon={<SaveOutlined />}
              size="small"
              type="primary"
              onClick={() => handleEdit(note.id, { content: editedContent })}
            >
              Lưu
            </Button>
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={() => {
                setEditedContent(note.content);
                setIsEditing(false);
              }}
            >
              Hủy
            </Button>
          </Space>
        )}
      </div>

      <TextArea
        autoFocus
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={2}
        readOnly={!isEditing}
        style={{
          background: isEditing ? "#fff" : "#f5f6fa",
          marginTop: 4,
          borderColor: isEditing ? "#40a9ff" : "#d9d9d9",
        }}
      />
    </Card>
  );
};

export default NoteItem;
