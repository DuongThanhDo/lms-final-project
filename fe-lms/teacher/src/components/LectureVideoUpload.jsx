import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Upload, Row, Col, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { configs } from "../configs";
import { CourseStatus } from "../utils/enums";
import { useCurriculum } from "../context/CurriculumContext";

const LectureVideoUpload = ({ lecture, onUpdateVideo }) => {
  const { course } = useCurriculum();
  const [videoUrl, setVideoUrl] = useState(lecture?.video?.file_url || "");
  const [fileName, setFileName] = useState(lecture?.video?.file_name || "");
  const [videoKey, setVideoKey] = useState(Date.now());

  const [loading, setLoading] = useState(false);

  const fetchUploadLectureVideo = async (lectureId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.put(
        `${configs.API_BASE_URL}/lectures/upload/${lectureId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi upload video:", error);
      throw error;
    }
  };

  useEffect(() => {
    setVideoUrl(lecture?.video?.file_url || "");
    setFileName(lecture?.video?.file_name || "");
  }, [lecture?.video]);

  const handleUpload = async (file) => {
    if (!lecture.id) {
      message.error("Không có ID bài giảng!");
      return false;
    }
  
    setLoading(true);
    try {
      const response = await fetchUploadLectureVideo(lecture.id, file);
      if (response.video) {
        const newVideoUrl = `${response.video.file_url}#${Date.now()}`;
  
        setVideoUrl(newVideoUrl);
        setFileName(response.video.file_name);
        setVideoKey(Date.now());
  
        if (onUpdateVideo) onUpdateVideo(newVideoUrl, response.video.file_name);
      }
    } catch (error) {
      message.error("Upload thất bại!");
    } finally {
      setLoading(false);
    }
  
    return false;
  };
  

  return (
    <div className="mb-3">
      {videoUrl ? (
        <Row align="middle" gutter={16}>
          <Col span={4}>
            <video key={videoKey} width="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </Col>
          <Col span={10}>
            <p className="mb-1">
              <strong>Tên file:</strong> {fileName}
            </p>
          </Col>
          {course?.status != CourseStatus.PUBLISHED && (<Col span={10} style={{ textAlign: "right" }}>
            <Upload showUploadList={false} beforeUpload={handleUpload}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loading}
              >
                {loading ? "Đang tải..." : "Thay thế video"}
              </Button>
            </Upload>
          </Col>)}
        </Row>
      ) : (
        course?.status != CourseStatus.PUBLISHED && (<Upload showUploadList={false} beforeUpload={handleUpload}>
          <Button type="primary" icon={<UploadOutlined />} loading={loading}>
            {loading ? "Đang tải..." : "Thêm video"}
          </Button>
        </Upload>)
      )}
    </div>
  );
};

export default LectureVideoUpload;
