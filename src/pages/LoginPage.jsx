import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import { Loading } from "../components/Loading";
import { LoadingOnPage } from "../components/LoadingOnPage";

function randomLoadingTime(){
  const randomValue = new Uint32Array(1);
  window.crypto.getRandomValues(randomValue);
  return (randomValue[0] % 1001) + 500; // от 500 до 1500 мс
}

export const LoginPage = () => {
  const [typeForm, setTypeForm] = useState("login"); // 'login' | 'register'

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, users } = useApp();
  const navigate = useNavigate();

  const handleLoading = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, randomLoadingTime());
    });
  };

  const handleCaptcha = () => {
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaVerified(true);
      setCaptchaLoading(false);
    }, 2000);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    try {
      await handleLoading();
      const success = login(email, password);

      if (success) {
        const user = users.find((u) => u.email === email) || { role: "member" };
        void navigate(user.role === "lead" ? "/tasks" : "/tasks?assignee=me");
      } else {
        alert("Невірний логін, або пароль");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!captchaVerified) return;

    setLoading(true);
    try {
      await handleLoading();
      const success = register(name, email, password);
      if (success) {
        setTypeForm("login");
        setPassword("");
        setEmail("");
        setName("");
        setCaptchaVerified(false);
      } else {
        alert("Помилка реєстрації. Можливо, такий email вже існує.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginSubmit = async (selectedUser) => {
    setLoading(true);
    try {
      await handleLoading();
      const success = login(selectedUser.email, selectedUser.password);

      if (success) {
        void navigate(
          selectedUser.role === "lead" ? "/tasks" : "/tasks?assignee=me",
        );
      } else {
        alert("Невірний логін або пароль");
      }
    } finally {
      setLoading(false);
    }
  };

  let captchaIndicator;
  if (captchaLoading) {
    captchaIndicator = <Loading size="16" />;
  } else if (captchaVerified) {
    captchaIndicator = <i className="fa-solid fa-square-check" />;
  } else {
    captchaIndicator = (
      <div
        style={{
          backgroundColor: "#7a7878",
          width: "16px",
          height: "16px",
        }}
      />
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* ЛЕВАЯ ЧАСТЬ: Формы логина и регистрации */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Переключатель вкладок */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <button
            onClick={() => setTypeForm("login")}
            style={{
              padding: "8px 24px",
              fontWeight: typeForm === "login" ? "bold" : "normal",
              backgroundColor: typeForm === "login" ? "#4e4d4d" : "#242525",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Вхід
          </button>
          <button
            onClick={() => setTypeForm("register")}
            style={{
              padding: "8px 24px",
              fontWeight: typeForm === "register" ? "bold" : "normal",
              backgroundColor: typeForm === "register" ? "#4e4949" : "#242525",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Реєстрація
          </button>
        </div>

        {/* Отрисовываем форму входа, если typeForm === 'login' */}
        {typeForm === "login" && (
          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <h2>Вхід в систему</h2>
            <input
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "10px", cursor: "pointer" }}
            >
              Увійти
            </button>
          </form>
        )}

        {/* Отрисовываем форму регистрации, если typeForm === 'register' */}
        {typeForm === "register" && (
          <form
            className="register-form"
            onSubmit={handleRegister}
          >
            <h2>Реєстрація</h2>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="captcha-button"
              type="button"
              onClick={handleCaptcha}
              disabled={captchaVerified || captchaLoading}
              style={{
                padding: "10px",
                border: "1px solid #7a7878",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              {captchaIndicator}
              Я не робот
            </button>

            <button
              type="submit"
              disabled={!captchaVerified || loading}
              style={{
                padding: "10px",
                cursor: captchaVerified ? "pointer" : "not-allowed",
              }}
            >
              Зареєструватися
            </button>
            
          </form>
        )}
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Боковая панель быстрого входа (видна только при логине) */}
      {typeForm === "login" && (
        <div className="quick-login" style={{}}>
          <h3>Швидкий вхід</h3>
          {users.map((user) => (
            <button
              type="button"
              key={user.email}
              onClick={() => handleQuickLoginSubmit(user)}
              disabled={loading}
              className="quick-login-user"
              style={{}}
            >
              <Avatar user={user} className="user-avatar" />
              <div>
                <strong>{user.name}</strong>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  Роль: {user.role === "lead" ? "Teamlead" : "Member"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {loading && <LoadingOnPage />}
    </div>
  );
};
