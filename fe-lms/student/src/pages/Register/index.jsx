import React, { useEffect, useRef, useState } from "react";
import { Button, Input, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets";
import axios from "axios";
import { Roles } from "../../utils/enums";
import { configs } from "../../configs";
import LoginWithGoogle from "../../components/LoginWithGoogle";

const Register = () => {
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${configs.API_BASE_URL}/users/register`, {
        email,
        password,
        role: Roles.STUDENT,
      });

      console.log({
        email,
        password,
        role: Roles.STUDENT,
      });

      console.log(response.data);
      

      if (response.data?.id) {
        message.success("Đăng ký thành công!");
        setTimeout(() => {
          navigate(configs.routes.login); 
        }, 1000);
      } else {
        message.error(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối đến server!");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-80">
      <div className="row">
        <div className="col-md-6" style={{ padding: "48px 120px" }}>
          <div className="text-center mb-4">
            <img
              src={assets.images.logo}
              alt="Logo"
              className="mb-2"
              width={100}
            />
            <h2 className="fw-bold text-dark">Đăng ký</h2>
          </div>

          <Input
            autoFocus
            placeholder="Email"
            className="mb-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onPressEnter={() => passwordRef.current?.focus()}
          />

          <Input.Password
            ref={passwordRef}
            placeholder="Mật khẩu"
            className="mb-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={() => confirmPasswordRef.current?.focus()}
          />

          <Input.Password
            ref={confirmPasswordRef}
            placeholder="Nhập lại mật khẩu"
            className="mb-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onPressEnter={handleRegister}
          />

          <Button
            type="primary"
            block
            size="large"
            loading={loading}
            className="mb-3"
            style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
            onClick={handleRegister}
          >
            Đăng ký
          </Button>

          <div className="text-center text-muted mb-2">Các tùy chọn khác</div>

          <LoginWithGoogle />

          <div className="text-center mt-3">
            <span className="text-muted">Đã có tài khoản? </span>
            <Link to={configs.routes.login} className="text-primary">
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center d-none d-md-block">
          <img
            src={assets.images.gomaytinh}
            alt="Login Illustration"
            className="w-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
