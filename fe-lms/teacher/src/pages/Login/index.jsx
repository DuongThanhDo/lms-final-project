import React, { useRef, useState } from "react";
import { Button, Input, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets";
import axios from "axios";
import { loginUser } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../utils/enums";
import { configs } from "../../configs";

const Login = () => {
  const passwordRef = useRef(null);
  const loginButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Vui lòng nhập email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${configs.API_BASE_URL}/users/login`, {
        email,
        password,
        expectedRole: Roles.TEACHER
      });

      console.log(response.data);

      if (response.data.token) {
        const token = response.data.token;
        const decodedUser = jwtDecode(token);
        const user = decodedUser.user;
        console.log(user);

        dispatch(loginUser({user, token}));

        message.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate(configs.routes.dashboard);
        }, 1000);
      } else {
        message.error(response.data.message || "Đăng nhập thất bại!");
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
        <div className="col-md-6 d-flex justify-content-center align-items-center d-none d-md-block">
          <img
            src={assets.images.gomaytinh}
            alt="Login Illustration"
            className="w-100"
          />
        </div>

        <div className="col-md-6" style={{ padding: "100px 120px" }}>
          <div className="text-center mb-4">
            <img
              src={assets.images.logo}
              alt="Logo"
              className="mb-2"
              width={100}
            />
            <h2 className="fw-bold text-dark">Đăng nhập</h2>
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
            onPressEnter={handleLogin}
          />

          <Button
            ref={loginButtonRef}
            type="primary"
            block
            size="large"
            loading={loading}
            className="mb-3"
            style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Login;
