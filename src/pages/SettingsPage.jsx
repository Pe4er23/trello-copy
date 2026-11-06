import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";

const PALETTE = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F033FF",
  "#33FFF0",
  "#FF33A8",
  "#A833FF",
  "#FF8C00",
  "#2E8B57",
  "#8B0000",
  "#4B0082",
  "#000000",
];

export const SettingsPage = () => {
  const { currentUser, updateUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setSelectedColor(currentUser.avatarColor || "");
    } else {
      void navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      return alert("Ім'я має бути не коротше 2 символів");
    }

    const success = await updateUser(currentUser.id, {
      name: name,
      avatarColor: selectedColor,
    });

    if (success) {
      void navigate("/tasks");
    } else {
      alert("Помилка при збереженні. Перевірте з'єднання із сервером.");
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "40px auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          className="settings-back-button"
          onClick={() => navigate("/tasks")}
        >
          &lt;= Назад
        </button>
        <h2 style={{ margin: 0 }}>Налаштування профілю</h2>
      </div>

      <form
        onSubmit={handleSave}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          background: "#f4f5f7",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Name and avatar preview block */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* The avatar preview updates immediately when the name or color changes */}
          <Avatar
            user={currentUser}
            size={80}
            customColor={selectedColor}
          />
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Ваше ім'я
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
              required
            />
          </div>
        </div>

        {/* Color selection block */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Колір фону аватарки
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {PALETTE.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  cursor: "pointer",
                  border:
                    selectedColor === color
                      ? "3px solid #000"
                      : "1px solid #ccc",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                title={color}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSelectedColor("")}
            style={{
              marginTop: "10px",
              fontSize: "13px",
              background: "none",
              border: "none",
              color: "#0079bf",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Скинути до стандартного (генерація по імені)
          </button>
        </div>

        {/* Save button */}
        <div
          style={{
            marginTop: "10px",
            borderTop: "1px solid #ddd",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              background: "#5aac44",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Зберегти зміни
          </button>
        </div>
      </form>
    </div>
  );
};
