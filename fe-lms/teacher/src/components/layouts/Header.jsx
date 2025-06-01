import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import NotificationMenu from "./NotificationMenu";
import AvatarMenu from "./AvatarMenu";
import { assets } from "../../assets";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../assets/css/Header.css";

const Header = () => {
  const authState = useSelector((state) => state.auth);

  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm px-3">
      <div className="d-flex justify-content-between align-items-center" style={{width: "100vw"}}>
        <Navbar.Brand href="/">
          <img src={assets.images.logo} alt="Logo" width="50" />

          <span style={{color: "#1D8381", marginLeft: 12 }}><strong>Giảng viên</strong></span>
        </Navbar.Brand>
        <div className="d-flex align-items-center gap-3">
          {isLoggedIn ? (
            <>
              <NotificationMenu />
              <AvatarMenu />
            </>
          ) : (
            <div className="d-flex">
              <Link to="/login">
                <Button
                  color="cyan"
                  variant="outlined"
                  className="me-2"
                  // style={{ borderColor: "#1B8381", color: "#1B8381" }}
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  color="cyan"
                  variant="solid"
                  // style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
                >
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
