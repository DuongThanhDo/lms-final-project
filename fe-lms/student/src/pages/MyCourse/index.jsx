import React, { useEffect, useState } from "react";
import { message, Tabs } from "antd";
import axios from "axios";
import { configs } from "../../configs";
import { useSelector } from "react-redux";
import { CourseType } from "../../utils/enums";
import MyCourseList from "./MyCourseList";
const { TabPane } = Tabs;

const MyCourse = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const [courseOnline, setCourseOnline] = useState([]);
  const [courseOffline, setCourseOffline] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchMyCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/course-registrations/student/${user.id}`
      );
      const on = [];
      const off = [];
      response.data.forEach((data) => {
        if (data.course.type === CourseType.ONLINE) {
          on.push(data);
        } else {
          off.push(data);
        }
      });
      setCourseOnline(on);
      setCourseOffline(off);
    } catch (error) {
      message.error(
        error?.response?.data?.message || error.message || "Đã xảy ra lỗi"
      );
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    if (user?.id) {
      fetchMyCourse();
    }
  }, [user]);
  
  return (
    <div className="container mt-4">
      <h2>Khóa học của tôi</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Khóa học trực tuyến" key="1">
          <MyCourseList data={courseOnline} loading={loading} />
        </TabPane>
        <TabPane tab="Khóa học trực tiếp" key="2">
          <MyCourseList data={courseOffline} loading={loading} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MyCourse;
