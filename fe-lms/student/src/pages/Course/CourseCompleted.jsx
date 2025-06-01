import React, { useEffect, useState } from "react";
import { Button, message, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { configs } from "../../configs";
import { useSelector } from "react-redux";

const CourseCompleted = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const { id } = useParams();

  const [centerInfo, setCenterInfo] = useState(null)

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/central-information/1`
      );
      setCenterInfo(response.data)
    } catch (error) {}
  };

  const checkCompleted = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/course-registrations/get-one`,
        {
          params: {
            userId: user.id,
            courseId: id,
          },
        }
      );

      if (!response || response.data.progress != 100) window.history.back();
    } catch (error) {
      window.history.back();
    }
  };

  useEffect(() => {
    checkCompleted();
    fetchData();
  }, []);

  const handleViewMyCourse = () => {
    navigate("/my-courses");
  };

  const handleDownloadCertificate = () => {
    navigate(`/cretificate/${id}/student/${user.id}`);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Chúc mừng bạn đã hoàn thành khóa học!</h1>
      <p>Bạn đã làm được một điều thật tuyệt vời! 🎉</p>
      <p>Tiếp theo, bạn có 2 lựa chọn:</p>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Button type="primary" onClick={handleViewMyCourse}>
          Quay về khóa học của tôi
        </Button>
        <Button type="default" onClick={handleDownloadCertificate}>
          Nhận chứng chỉ khóa học
        </Button>
      </Space>
      <div style={{ marginTop: "30px" }}>
        <p>
          Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, hãy liên hệ với chúng
          mình qua:
        </p>
        <p>Email: <strong>{centerInfo?.email || 'N/A'}</strong></p>
        <p>Phone: <strong>{centerInfo?.phone || 'N/A'}</strong></p>
      </div>
      <p style={{ marginTop: "30px" }}>Trân trọng,</p>
      <p><strong>{centerInfo?.name || 'Tên trung tâm'}</strong></p>
    </div>
  );
};

export default CourseCompleted;
