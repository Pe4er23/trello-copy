import React, { useEffect, useState } from "react";
import { useApp } from "../AppContext";

export const TaskModal = ({ isOpen, onClose, task }) => {
  const { users, addTask, updateTask, currentUser } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setAssigneeId(task?.assigneeId ? String(task.assigneeId) : "");
    setPriority(task?.priority || "normal");
    setDueDate(task?.dueDate || "");
  }, [isOpen, task]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length < 5 || title.length > 80)
      return alert("Заголовок має бути від 5 до 80 символів");
    if (description.length < 10)
      return alert("Опис має бути не менше 10 символів");
    if (!assigneeId) return alert("Оберіть виконавця");

    const assignee = users.find((u) => String(u.id) === String(assigneeId));

    const taskData = {
      title,
      description,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      priority,
      dueDate,
    };

    const success = task
      ? await updateTask(task.id, taskData)
      : await addTask({
          id: Date.now().toString(),
          ...taskData,
          status: "todo",
          createdAt: new Date().toISOString(),
          createdBy: currentUser.id,
          comments: [],
        });

    if (success) {
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setDueDate("");
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#dadada",
          padding: "30px",
          borderRadius: "8px",
          width: "500px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, color: "black" }}>
            {task ? "Редагувати задачу" : "Створити задачу"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "black",
            }}
          >
            ✖
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            placeholder="Заголовок (5-80 символів)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Опис задачі..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
              style={{ flex: 1 }}
            >
              <option value="" disabled>
                Оберіть виконавця...
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <input
            type="date"
            value={dueDate}
            min={task ? undefined : today}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#0079bf",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {task ? "Зберегти" : "Створити"}
          </button>
        </form>
      </div>
    </div>
  );
};
