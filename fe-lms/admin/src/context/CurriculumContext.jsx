import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { configs } from "../configs";

const CurriculumContext = createContext();

export const useCurriculum = () => useContext(CurriculumContext);

export const CurriculumProvider = ({ children }) => {
  const { id: courseId } = useParams();
  const [sections, setSections] = useState([]);

  const fetchContentCourse = async () => {
    try {
      const response = await axios.get(`${configs.API_BASE_URL}/chapters/content/${courseId}`);
      setSections(response.data);
    } catch (error) {
      console.error(
        "Lỗi khi lấy chapters:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchContentCourse();
  }, [courseId]);

  const addSection = async (title) => {
    if (!title.trim() || !courseId) return;
    try {
      const response = await axios.post(`${configs.API_BASE_URL}/chapters`, {
        courseId,
        title,
      });
      if (response.status === 201) fetchContentCourse();
    } catch (error) {
      console.error(
        "Lỗi khi thêm section:",
        error.response?.data || error.message
      );
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/chapters/${sectionId}`);
      setSections((prevSections) =>
        prevSections.filter((s) => s.id !== sectionId)
      );
    } catch (error) {
      console.error(
        "Lỗi khi xóa section:",
        error.response?.data || error.message
      );
    }
  };

  const editSection = async (sectionId, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      await axios.put(`${configs.API_BASE_URL}/chapters/${sectionId}`, {
        title: newTitle,
      });
      setSections((prevSections) =>
        prevSections.map((s) =>
          s.id === sectionId ? { ...s, title: newTitle } : s
        )
      );
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật tiêu đề:",
        error.response?.data || error.message
      );
    }
  };

  const addItem = async (sectionId, type, title, order) => {
    if (!title.trim()) return;
    let response = null;
    try {
      switch (type) {
        case "lecture":
          response = await axios.post("${configs.API_BASE_URL}/lectures", {
            chapterId: Number(sectionId),
            title,
            order,
          });
          break;
        case "coding":
          console.log("API coding");
          break;
        case "quiz":
          console.log("API quiz");
          break;
        default:
          console.warn("Loại không hợp lệ:", type);
          return;
      }

      if (response?.status === 201) {
        fetchContentCourse();
      }
    } catch (error) {
      console.error("Lỗi khi thêm mục:", error.response?.data || error.message);
    }
  };

  return (
    <CurriculumContext.Provider
      value={{ sections, addSection, deleteSection, editSection, addItem, fetchContentCourse }}
    >
      {children}
    </CurriculumContext.Provider>
  );
};
