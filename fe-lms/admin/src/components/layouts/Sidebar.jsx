import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  TeamOutlined,
  StarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "../../assets/css/Sidebar.css";
import { configs } from "../../configs";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const getActiveKey = () => {
    if (location.pathname.startsWith(configs.routes.users))
      return configs.routes.users;
    if (location.pathname.startsWith(configs.routes.courses))
      return configs.routes.courses;
    if (location.pathname.startsWith(configs.routes.center))
      return configs.routes.center;
    return "/";
  };

  return (
    <Sider
      className="fixed-sidebar"
      collapsible
      collapsed={collapsed}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      width={200}
    >
      <Menu
        theme="dark"
        mode="vertical"
        selectedKeys={[getActiveKey()]}
        className="custom-sidebar"
      >
        <Menu.Item key={configs.routes.dashboard} icon={<AppstoreOutlined />}>
          <Link style={{ textDecoration: "none" }} to={configs.routes.dashboard}>
            Tổng quan
          </Link>
        </Menu.Item>
        <Menu.Item key={configs.routes.users} icon={<TeamOutlined />}>
          <Link style={{ textDecoration: "none" }} to={configs.routes.users}>
            Người dùng
          </Link>
        </Menu.Item>
        <Menu.Item key={configs.routes.courses} icon={<BookOutlined />}>
          <Link style={{ textDecoration: "none" }} to={configs.routes.courses}>
            Khóa học
          </Link>
        </Menu.Item>
        <Menu.Item key={configs.routes.center} icon={<StarOutlined />}>
          <Link style={{ textDecoration: "none" }} to={configs.routes.center}>
            Trung tâm
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
