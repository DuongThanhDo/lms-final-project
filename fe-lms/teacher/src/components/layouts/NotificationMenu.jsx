import React from "react";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Menu, Dropdown } from "antd";

const NotificationMenu = () => {
  const notificationMenu = (
    <Menu>
      <Menu.Item key="header" className="d-flex justify-content-between">
        <span>Thông báo </span>
        <a href="#" style={{ color: "#1890ff" }}> Đánh dấu đã đọc</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" className="d-flex align-items-center">
        <Avatar icon={<UserOutlined />} className="me-2" />
        Đã trả lời bình luận
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={notificationMenu} placement="bottomRight" arrow trigger={["click"]}>
      <div className="position-relative">
        <BellOutlined style={{ fontSize: 20, cursor: "pointer", color: "white" }} />
      </div>
    </Dropdown>
  );
};

export default NotificationMenu;
