import React, { useEffect, useState } from "react";
import { Layout, Card } from "antd";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Chart, registerables } from "chart.js";
import { configs } from "../../configs";
import axios from "axios";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const { Content } = Layout;

const Dashboard = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const [overview, setOverview] = useState({
    students: 0,
    courses: 0,
    published: 0,
    pending: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchChart();
  }, []);

  const fetchOverview = async () => {
    const res = await axios.get(
      `${configs.API_BASE_URL}/statistics/teacher/${user.id}/overview`
    );
    setOverview(res.data);
  };

  const fetchChart = async () => {
    const res = await axios.get(
      `${configs.API_BASE_URL}/statistics/teacher/${user.id}/registrations-per-month`
    );
    setChartData(res.data);
  };

  const statsData = [
    {
      icon: <UserOutlined />,
      label: "Học viên của tôi",
      value: overview.totalStudents,
    },
    {
      icon: <BookOutlined />,
      label: "Khóa học của tôi",
      value: overview.totalCourses,
    },
    {
      icon: <CheckCircleOutlined />,
      label: "Khóa học đã xuất bản",
      value: overview.publishedCourses,
    },
    {
      icon: <ClockCircleOutlined />,
      label: "Khóa học chờ duyệt",
      value: overview.pendingCourses,
    },
  ];

  const lineChartData = {
    labels: chartData.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Thống kê đăng ký",
        data: chartData.map((item) => item.revenue),
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <Layout>
      <Content className="container mt-4">
        <div className="row mb-4">
          {statsData.map((stat, index) => (
            <div key={index} className="col-md-3">
              <Card>
                <h4>
                  {stat.icon} {stat.value}
                </h4>
                <p>{stat.label}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <Card title="Lượt đăng ký khóa học trong năm">
              <Line data={lineChartData} options={{ responsive: true }} />
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
