import React, { useState } from "react";
import { Button, Input, Collapse, Modal } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useCurriculum } from "../context/CurriculumContext";
import axios from "axios";
import LectureVideoUpload from "./LectureVideoUpload";
import { configs } from "../configs";
import { CourseStatus } from "../utils/enums";

const { Panel } = Collapse;
const { confirm } = Modal;

const LectureItem = ({ lecture, lectureIndex }) => {
  const { fetchContentCourse, course } = useCurriculum();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(lecture.description || "");
  const [hovered, setHovered] = useState(false);

  const deleteLecture = async (lectureId) => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/lectures/${lectureId}`);
      fetchContentCourse();
    } catch (error) {
      console.error(
        "Lỗi khi xóa bài giảng:",
        error.response?.data || error.message
      );
    }
  };

  const editLecture = async (lectureId, newTitle, newDescription) => {
    try {
      await axios.put(`${configs.API_BASE_URL}/lectures/${lectureId}`, {
        title: newTitle,
        description: newDescription,
      });
      fetchContentCourse();
    } catch (error) {
      console.error(
        "Lỗi khi chỉnh sửa bài giảng:",
        error.response?.data || error.message
      );
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận xóa bài giảng?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bài giảng sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        deleteLecture(lecture.id);
      },
    });
  };

  return (
    <Collapse className="mb-3" style={{ width: "100%" }}>
      <Panel 
        header={
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ display: "flex", alignItems: "center" }}
          >
            {isEditingTitle ? (
              <>
                <Input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", marginRight: 8 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    editLecture(lecture.id, title, description);
                    setIsEditingTitle(false);
                  }}
                  icon={<CheckOutlined />}
                >
                  Lưu
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(false);
                  }}
                  icon={<CloseOutlined />}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <span style={{ minHeight: 24 }}>
                <strong>Bài giảng {lectureIndex + 1}:</strong> {title}
              </span>
            )}

            {hovered && !isEditingTitle && course?.status != CourseStatus.PUBLISHED && (
              <div>
                <Button
                  size="small"
                  className="me-2"
                  style={{ marginLeft: 8 }}
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                />
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    showDeleteConfirm();
                  }}
                />
              </div>
            )}
          </div>
        }
        key={lecture.id}
      >
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.028)", padding: 24 }}>
          <LectureVideoUpload lecture={lecture} />
  
          {isEditingDesc ? (
            <>
              <h4>Mô tả bài giảng</h4>
              <Input.TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <div style={{ marginTop: 10 }}>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setIsEditingDesc(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    editLecture(lecture.id, title, description);
                    setIsEditingDesc(false);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  Lưu
                </Button>
              </div>
            </>
          ) : description ? (
            <>
              <p style={{ whiteSpace: "pre-line" }}>{description}</p>
              <Button
                type="dashed"
                icon={<EditOutlined />}
                onClick={() => setIsEditingDesc(true)}
              >
                Sửa mô tả
              </Button>
            </>
          ) : (
            course?.status != CourseStatus.PUBLISHED && (<Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => setIsEditingDesc(true)}
            >
              Thêm mô tả
            </Button>)
          )}
        </div>
      </Panel>
    </Collapse>
  );
};

export default LectureItem;
