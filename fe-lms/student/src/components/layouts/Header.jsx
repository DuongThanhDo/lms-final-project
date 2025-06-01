import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import NotificationMenu from "../NotificationMenu";
import AvatarMenu from "./AvatarMenu";
import { assets } from "../../assets";
import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { configs } from "../../configs";

const Header = () => {
  const authState = useSelector((state) => state.auth);
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);

  return (
    <Navbar expand="lg" className="bg-light shadow-sm px-3">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">
          <img src={assets.images.logo} alt="Logo" width="50" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href={configs.routes.home}
              style={location.pathname === configs.routes.home ? { color: '#1B8381', fontWeight: 'bold' } : {}}
            >
              Trang chủ
            </Nav.Link>
            <Nav.Link
              href={configs.routes.courses}
              style={location.pathname.startsWith(configs.routes.courses) ? { color: '#1B8381', fontWeight: 'bold' } : {}}
            >
              Khóa học
            </Nav.Link>
            <Nav.Link
              href={configs.routes.teacher}
              style={location.pathname === configs.routes.teacher ? { color: '#1B8381', fontWeight: 'bold' } : {}}
            >
              Giảng viên
            </Nav.Link>
            <Nav.Link
              href={configs.routes.about}
              style={location.pathname === configs.routes.about ? { color: '#1B8381', fontWeight: 'bold' } : {}}
            >
              Về chúng tôi
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

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
      </Container>
    </Navbar>
  );
};

export default Header;
