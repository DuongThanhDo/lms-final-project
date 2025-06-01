import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { configs } from "../../../configs";
import { useSelector } from "react-redux";

const getLastCompletedLesson = (chapters) => {
  const flatItems = [];

  chapters.forEach((chapter, chapterIndex) => {
    chapter.items.forEach((item, itemIndex) => {
      flatItems.push({
        ...item,
        chapterIndex,
        itemIndex,
      });
    });
  });

  if (flatItems.length === 0) {
    return null;
  }

  let lastCompletedIndex = -1;

  for (let i = 0; i < flatItems.length; i++) {
    if (flatItems[i].status === true) {
      lastCompletedIndex = i;
    }
  }

  console.log("flatItems:", flatItems);

  if (lastCompletedIndex === -1) {
    return flatItems[0];
  } else if (lastCompletedIndex < flatItems.length - 1) {
    return flatItems[lastCompletedIndex + 1];
  } else {
    return flatItems[lastCompletedIndex];
  }
}


const ViewCourse = () => {
  const { id: courseId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  const fetchContentCourse = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/chapters/student/content?userId=${user.id}&courseId=${courseId}`
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

  console.log(content);
  

  useEffect(() => {
    if (!loading) {
      if (content.length === 0) {
        message.error('Chưa có nội dung khóa học');
        window.history.back();
      } else {
        let contentTaget = getLastCompletedLesson(content);

        if(!contentTaget) contentTaget = content[0]?.items[0];
        if (contentTaget?.type === "lecture") {
          navigate(`/courses/${courseId}/lecture/${contentTaget.id}`);
        } else if (contentTaget?.type === "code") {
          navigate(`/courses/${courseId}/code/${contentTaget.id}`);
        } else if (contentTaget?.type === "quiz") {
          navigate(`/courses/${courseId}/quiz/${contentTaget.id}`);
        }
      }
    }
  }, [content, loading, courseId, navigate]);

  return <p>Đang tải nội dung khóa học...</p>;
};

export default ViewCourse;
