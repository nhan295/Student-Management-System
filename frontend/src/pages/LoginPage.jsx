import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Login.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = ()=>{
    setShowPassword (prev=>!prev)  //// hàm callback nhận giá trị hiện tại (prev) rồi đảo ngược nó
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/user_auth/login",{ username, password });
      
      localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
      console.log("Login response:", response.data);

      navigate("/homepage");
    } catch (error) {
      console.log(error.response?.data);
      alert(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      );
    }
  };

  return (
    <div className="login-page-background">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Hệ thống quản lí học viên</h2>

          <div className="login-input-group">
            <div className="input-icon-box">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
            />
          </div>

          <div className="login-input-group">
            <div className="input-icon-box">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
            <button
            type="button"
            onClick={togglePassword}
            className="toggle-password-btn">     
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          <button className="login-btn-form" type="submit">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
