import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { configs } from "../configs";
import { loginUser } from "../store/slices/authSlice";

const LoginWithGoogle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const res = await axios.post(
              `${configs.API_BASE_URL}/users/google`,
              {
                token: credentialResponse.credential,
              }
            );

            const data = res.data;

            if (data.accessToken) {
              const decoded = jwtDecode(data.accessToken);
              const user = decoded?.user || {
                id: decoded.sub,
                email: decoded.email,
              };

              dispatch(loginUser({ user, token: data.accessToken }));

              message.success("Đăng nhập với Google thành công!");
              navigate(configs.routes.home);
            } else {
              message.error(data.message || "Đăng nhập thất bại!");
            }
          } catch (error) {
            console.error("Google login error:", error);
            message.error("Có lỗi xảy ra khi đăng nhập với Google!");
          }
        }}
        onError={() => {
          console.log("Login Failed");
          message.error("Đăng nhập Google thất bại!");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginWithGoogle;
