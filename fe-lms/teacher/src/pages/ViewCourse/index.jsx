import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { configs } from "../../configs";

const ViewCourse = () => {
  const { id: courseId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContentCourse = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/chapters/content/${courseId}`
      );
      setContent(response.data);
      setLoading(false); 
    } catch (error) {
      console.error(
        "Lỗi khi lấy chapters:",
        error.response?.data || error.message
      );
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchContentCourse();
  }, [courseId]);

  useEffect(() => {
    if (!loading) {
      if (content.length === 0) {
        message.error('Chưa có nội dung khóa học');
        navigate(`/courses`);
      } else {
        const firstContent = content[0]?.items[0];
        if (firstContent?.type === "lecture") {
          navigate(`/courses/${courseId}/lecture/${firstContent.id}`);
        } else if (firstContent?.type === "code") {
          navigate(`/courses/${courseId}/code/${firstContent.id}`);
        } else if (firstContent?.type === "quiz") {
          navigate(`/courses/${courseId}/quiz/${firstContent.id}`);
        }
      }
    }
  }, [content, loading, courseId, navigate]);

  return <p>Đang tải nội dung khóa học...</p>;
};

export default ViewCourse;
