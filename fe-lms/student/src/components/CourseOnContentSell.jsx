import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ClockCircleOutlined, CodeOutlined, PlayCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { formatDuration } from "../utils/functions/time";
import { configs } from "../configs";

const { Paragraph } = Typography;
const { Panel } = Collapse;

const CourseOnContentSell = () => {
  const { id: courseId } = useParams();
  const [contents, setContents] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [activeKeys, setActiveKeys] = useState([]);

  const fetchCourseContent = async () => {
    try {
      const contentsResponse = await axios.get(
        `${configs.API_BASE_URL}/chapters/content/${courseId}`
      );
      const data = contentsResponse.data;

      const lessonsCount = data.reduce(
        (acc, chapter) => acc + chapter.items.length,
        0
      );
      const durationSum = data.reduce(
        (acc, chapter) => acc + chapter.duration,
        0
      );

      setContents(data);
      setTotalLessons(lessonsCount);
      setTotalDuration(durationSum);

      if (data.length > 0) {
        setActiveKeys([String(data[0].id)]);
      }
    } catch (error) {
      console.error("Lỗi tải thông tin khóa học:", error);
    }
  };

  useEffect(() => {
    fetchCourseContent();
  }, []);

  const renderIconAndDuration = (item) => {
    if (item.type === "lecture") {
      return (
          <PlayCircleOutlined style={{ marginRight: 8 }} />
      );
    }

    if (item.type === "code") {
      return (
          <CodeOutlined style={{ marginRight: 8 }} />
      );
    }

    if (item.type === "quiz") {
      return (
          <QuestionCircleOutlined style={{ marginRight: 8 }} />
      );
    }

    return null;
  };

  return (
    <div style={{ marginTop: 24 }}>
      <Paragraph>
        <strong>{contents.length}</strong> chương – <strong>{totalLessons}</strong> bài học – Thời lượng{" "}
        <strong>{formatDuration(totalDuration, 'text')}</strong>
      </Paragraph>
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}>
        {contents.map((chapter, chapterIndex) => (
          <Panel
            style={{ paddingTop: 12 }}
            key={chapter.id || chapterIndex}
            header={
              <div
                style={{
                  display: "flex",  
                  justifyContent: "space-between",
                  width: "100%",
                  height: 30
                }}
              >
                <span>
                  <strong>
                    {chapterIndex + 1}. {chapter.title}
                  </strong>
                </span>
                <span style={{ color: "#999" }}>
                  {chapter.items.length} bài học
                </span>
              </div>
            }
          >
            <div>
              {chapter.items.map((lesson, idx) => (
                <div
                  key={lesson.id || idx}
                  style={{
                    padding: "18px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {renderIconAndDuration(lesson)}
                    <span>
                      {idx + 1}. {lesson.title}
                    </span>
                  </div>
                  <div style={{ color: "#999", fontSize: 13 }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {lesson.duration ? formatDuration(lesson.duration) : lesson.type}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default CourseOnContentSell;
