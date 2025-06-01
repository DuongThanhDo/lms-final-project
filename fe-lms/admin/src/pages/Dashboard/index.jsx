import React, { useEffect, useState } from "react";
import { Layout, Card, Table, List, message } from "antd";
import { Line } from "react-chartjs-2";
import {
  UserOutlined,
  BookOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Chart, registerables } from "chart.js";
import { configs } from "../../configs";
import axios from "axios";

Chart.register(...registerables);
const { Content } = Layout;

const Dashboard = () => {
  const [overview, setOverview] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCoursesPublished: 0,
    totalCoursesPending: 0, 
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const fetchData = async () => {
    try {
      const [overviewRes, revenueRes] = await Promise.all([
        axios.get(`${configs.API_BASE_URL}/statistics/overview`),
        axios.get(`${configs.API_BASE_URL}/statistics/revenue-by-month`),
      ]);

      setOverview(overviewRes.data);
      setMonthlyRevenue(revenueRes.data);
    } catch (error) {
      message.error("Failed to load dashboard statistics.");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const statsData = [
    {
      icon: <UserOutlined />,
      label: "Học viên",
      value: overview.totalStudents,
    },
    {
      icon: <FileTextOutlined />,
      label: "Giảng viên",
      value: overview.totalTeachers,
    },
    {
      icon: <BookOutlined />,
      label: "Khóa học xuất bản",
      value: overview.totalCoursesPublished,
    },
    {
      icon: <FileSearchOutlined />,
      label: "Khóa học chờ duyệt",
      value: overview.totalCoursesPending,
    },
  ];

  const lineChartData = {
    labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: monthlyRevenue.map((m) => m.revenue),
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
            <Card title="Thống kê doanh thu theo tháng">
              <Line data={lineChartData} options={{ responsive: true }} />
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
