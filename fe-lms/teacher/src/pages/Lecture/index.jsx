import { Tabs, Spin, message, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentBox from "../../components/CommentBox";
import { useSelector } from "react-redux";
import { configs } from "../../configs";

const { TabPane } = Tabs;

const Lecture = () => {
  const { lectureId } = useParams();
  const user = useSelector((state) => state.auth.userInfo);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoKey, setVideoKey] = useState("");

  const fetchLecture = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/lectures/${lectureId}`
      );
      setLecture(response.data);
      setVideoKey(`video-${lectureId}-${Date.now()}`);
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi tải bài giảng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lectureId) return;
    fetchLecture();
  }, [lectureId]);

  if (loading) {
    return (
      <Spin
        tip="Đang tải bài giảng..."
        style={{ display: "flex", justifyContent: "center", padding: 100 }}
      />
    );
  }

  return (
    <div style={{ width: "100%", paddingBottom: 100 }}>
      {lecture?.video?.file_url && (
        <div
          key={lectureId}
          style={{
            width: "100%",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <video
            key={videoKey}
            width="80%"
            style={{ maxWidth: "70vw" }}
            controls
          >
            <source src={lecture.video.file_url} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ phát video.
          </video>
        </div>
      )}

      <div style={{ padding: "0px 64px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tổng quan" key="1">
            <h3>{lecture?.title || "Không có tiêu đề"}</h3>
            <Typography.Paragraph style={{ whiteSpace: "pre-line" }}>
              {lecture?.description || "Không có mô tả."}
            </Typography.Paragraph>
          </TabPane>
          <TabPane tab="Hỏi đáp" key="2">
              <CommentBox contentType="lecture" contentId={lecture.id} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Lecture;
