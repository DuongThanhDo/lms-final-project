import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { configs } from '../../../configs';

const CourseImageUpload = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const { id: courseId } = useParams();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${configs.API_BASE_URL}/courses/${courseId}`
        );
        const data = response.data;
        if(data.image != null) setImageUrl(data.image.file_url);
      } catch (error) {
        console.error("Lỗi tải thông tin khóa học:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      setFile(file);
      setShowSave(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!file || !courseId) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(`${configs.API_BASE_URL}/courses/upload/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Hình ảnh đã được cập nhật thành công!");
      setShowSave(false);
    } catch (error) {
      message.error("Lưu thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p><strong>Hình ảnh khóa học</strong></p>
      <div style={{ maxWidth: "400px", border: "1px solid #ddd", padding: 10, textAlign: "center" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="image" style={{ width: 200, height: 200, objectFit: "cover" }} />
        ) : (
          <div style={{
            width: 200, height: 200, background: "#f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <UploadOutlined style={{ fontSize: 50, color: "#999" }} />
          </div>
        )}
      </div>
      <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
        <Button type="primary" style={{ marginTop: 10 }}>Tải hình ảnh lên</Button>
      </Upload>
      {showSave && (
        <Button type="primary" style={{ marginTop: 10, marginLeft: 10 }} onClick={handleSave} loading={loading}>
          Lưu
        </Button>
      )}
    </div>
  );
};

export default CourseImageUpload
