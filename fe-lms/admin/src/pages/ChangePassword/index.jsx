import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import { assets } from "../../assets";
import { configs } from "../../configs";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth)?.userInfo.email;
  console.log(email);
  

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(`${configs.API_BASE_URL}/users/change-password`, {
        email,
        oldPassword,
        newPassword,
      });

      if (response.data.message) {
        message.success("Đổi mật khẩu thành công!");
        dispatch(logoutUser());
        setTimeout(() => {
            navigate("/login"); 
          }, 1000);
      } else {
        message.error(response.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối đến server!");
      console.error("Change password error:", error);
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
            alt="Change Password Illustration"
            className="w-100"
          />
        </div>

        <div className="col-md-6" style={{ padding: "48px 120px" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Thay đổi mật khẩu</h2>
          </div>

          <Input.Password
            placeholder="Mật khẩu cũ"
            className="mb-3 py-2"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <Input.Password
            placeholder="Mật khẩu mới"
            className="mb-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input.Password
            placeholder="Xác nhận mật khẩu mới"
            className="mb-3 py-2"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <Button
            type="primary"
            block
            size="large"
            loading={loading}
            className="mb-3"
            onClick={handleChangePassword}
            style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
