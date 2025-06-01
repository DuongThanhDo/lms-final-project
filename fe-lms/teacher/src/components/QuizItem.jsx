import React, { useState } from "react";
import { Button, Input, Collapse, Modal } from "antd";
import {
  EditOutlined,
  CloseOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useCurriculum } from "../context/CurriculumContext";
import axios from "axios";
import { configs } from "../configs";
import QuizQuestionManager from "./QuizQuestionManager";
import { CourseStatus } from "../utils/enums";

const { Panel } = Collapse;
const { confirm } = Modal;

const QuizItem = ({ quiz, quizIndex }) => {
  const { fetchContentCourse, course } = useCurriculum();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(quiz.title);
  const [hovered, setHovered] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false); 

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/quizSQL/${quizId}`);
      fetchContentCourse();
    } catch (error) {
      console.error("Lỗi khi xóa quiz:", error.response?.data || error.message);
    }
  };

  const editQuiz = async (quizId, newTitle) => {
    try {
      await axios.put(`${configs.API_BASE_URL}/quizSQL/${quizId}`, {
        name: newTitle,
      });
      fetchContentCourse();
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa quiz:", error.response?.data || error.message);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận xóa quiz?",
      icon: <ExclamationCircleOutlined />,
      content: "Quiz sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        deleteQuiz(quiz.id);
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
                    editQuiz(quiz.id, title);
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
                <strong>Trắc nghiệm {quizIndex + 1}:</strong> {title}
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
        key={quiz.id}
      >
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.028)", padding: 24 }}>
          {course?.status != CourseStatus.PUBLISHED && (<Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            style={{ marginBottom: 16 }}
          >
            {showQuestionForm ? "Ẩn form" : "Tạo câu hỏi"}
          </Button>)}

          <QuizQuestionManager quizId={quiz.quizFB_id} showForm={showQuestionForm} setShowForm={setShowQuestionForm} />
        </div>
      </Panel>
    </Collapse>
  );
};

export default QuizItem;
