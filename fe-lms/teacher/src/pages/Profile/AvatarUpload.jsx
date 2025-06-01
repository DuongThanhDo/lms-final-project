import React, { useEffect, useState } from "react";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { configs } from "../../configs";

const AvatarUpload = () => {
  const [profileId, setProfileId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const user = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserAvatar = async () => {
      try {
        const response = await axios.get(`${configs.API_BASE_URL}/user-profiles/${user.id}`);
        if(response.data.avatar != null) setImageUrl(response.data.avatar.file_url);
        setProfileId(response.data.id);
      } catch (error) {
        console.error("Lỗi tải ảnh đại diện:", error);
      }
    };

    fetchUserAvatar();
  }, [user?.id]);

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
    if (!file || !user?.id) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(`${configs.API_BASE_URL}/user-profiles/upload/${profileId}`, formData, {
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
      <p><strong>Xem trước hình ảnh</strong></p>
      <div style={{ maxWidth: "400px", border: "1px solid #ddd", padding: 10, textAlign: "center" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="Avatar" style={{ width: 200, height: 200, objectFit: "cover" }} />
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

export default AvatarUpload;
