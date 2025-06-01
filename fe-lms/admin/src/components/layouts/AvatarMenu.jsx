import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Avatar, Modal } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import { configs } from "../../configs";

const AvatarMenu = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserAvatar = async () => {
      try {
        const response = await fetch(
          `${configs.API_BASE_URL}/user-profiles/${user.id}`
        );
        if (!response.ok) throw new Error("Không thể tải ảnh đại diện.");
        const data = await response.json();
        setImageUrl(data.avatar.file_url);
      } catch (error) {
        console.error("Lỗi tải ảnh đại diện:", error);
      }
    };

    fetchUserAvatar();
  }, [user?.id]);

  const confirmLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      icon: <LogoutOutlined />,
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      centered: true,
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk() {
        dispatch(logoutUser());
        navigate("/login");
      },
    });
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link className="text-decoration-none" to={configs.routes.profile}>
          Trang cá nhân
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="6">
        <Link className="text-decoration-none" to={configs.routes.changePassword}>
          Đổi mật khẩu
        </Link>
      </Menu.Item>
      <Menu.Item onClick={confirmLogout} key="7">
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={userMenu} placement="bottomRight" arrow trigger={["click"]}>
      <div>
        {imageUrl ? (
          <img
            src={`${imageUrl}?timestamp=${new Date().getTime()}`}
            alt="Avatar"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        ) : (
          <Avatar
            icon={<UserOutlined />}
            style={{ cursor: "pointer", verticalAlign: "middle" }}
          />
        )}
      </div>
    </Dropdown>
  );
};

export default AvatarMenu;
