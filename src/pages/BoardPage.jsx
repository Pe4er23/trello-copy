import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../AppContext";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { TaskModal } from "../components/TaskModal";
import { ProfileCard } from "../components/ProfileCard";

const COLUMNS = ["todo", "in-progress", "review", "done"];
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export const BoardPage = () => {
  const { tasks, currentUser, updateTaskStatus } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const currentAssigneeFilter = searchParams.get("assignee");

  const filteredTasks = useMemo(() => {
    let result = tasks || [];
    if (currentAssigneeFilter === "me" && currentUser) {
      result = result.filter(
        (task) => String(task.assigneeId) === String(currentUser.id),
      );
    }
    return result;
  }, [tasks, searchParams, currentUser]);

  const getDeadlineInfo = (dueDate, status) => {
    if (!dueDate) return null;

    const due = new Date(dueDate).getTime();
    const now = Date.now();
    if (Number.isNaN(due)) return null;

    if (status !== "done" && now > due) {
      return {
        overdue: Math.max(1, Math.floor((now - due) / DAY_IN_MILLISECONDS)),
      };
    }

    return {
      remaining: Math.ceil((due - now) / DAY_IN_MILLISECONDS),
    };
  };

  // === DRAG AND DROP LOGIC ===
  const handleDragStart = (e, task) => {
    if (!task) return;
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => String(t.id) === String(taskId));

    if (!task || task.status === targetColumn) return;

    if (currentUser.role === "member") {
      if (String(task.assigneeId) !== String(currentUser.id)) {
        return alert("Ви не можете переміщувати чужі задачі!");
      }
      if (task.status === "todo" && targetColumn !== "in-progress") {
        return alert("Задачу можна перевести тільки в In-Progress");
      }
      if (task.status === "in-progress" && targetColumn !== "review") {
        return alert("Задачу можна перевести тільки в Review");
      }
      if (task.status === "review" || targetColumn === "done") {
        return alert(
          "Очікує перевірки тімліда. Ви не можете рухати цю задачу далі.",
        );
      }
    }

    if (currentUser.role === "lead") {
      if (task.status === "review" && targetColumn === "todo") {
        return alert(
          "Тімлід може повернути задачу з review тільки в in-progress",
        );
      }
    }

    updateTaskStatus(task.id, targetColumn);
  };

  return (
    <div className="board" style={{ padding: "20px", minHeight: "100vh" }}>
      <header className="board-header" style={{}}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h2 style={{ margin: 0 }}>Дошка задач</h2>
          <button
            onClick={() => {
              if (currentUser.role === "member") {
                if (currentAssigneeFilter === "me") {
                  searchParams.delete("assignee");
                } else {
                  searchParams.set("assignee", "me");
                }
                setSearchParams(searchParams);
              }
            }}
            disabled={currentUser?.role !== "member"}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: currentUser?.role === "member" ? "pointer" : "default",
              backgroundColor: "#232429",
              color: "#d3cccc",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: "18px",
                width: "16px",
                height: "16px",
                border: "1px solid #a0a0a0",
                padding: "1.5px",
                marginRight: "6px",
                backgroundColor:
                  currentAssigneeFilter === "me" ? "" : "#a0a0a0",
                color: currentAssigneeFilter === "me" ? "" : "black",
              }}
            >
              {currentAssigneeFilter === "me" ? "" : "x"}
            </span>
            Показати всі задачі
          </button>
        </div>
        <ProfileDropdown />
      </header>

      {/* Columns container */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {COLUMNS.map((col) => (
          <div
            key={col}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col)}
            style={{
              minWidth: "300px",
              backgroundColor: "#ebecf0",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                textTransform: "capitalize",
                paddingLeft: "10px",
                color: "#172b4d",
              }}
            >
              {col}
            </h3>

            {filteredTasks
              .filter((t) => t.status === col)
              .map((task) => {
                const deadlineInfo = getDeadlineInfo(task.dueDate, task.status);
                return (
                  <div
                    key={task.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, task)}
                    style={{
                      background: "#fff",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "4px",
                      boxShadow: "0 1px 2px rgba(9,30,66,0.25)",
                      cursor: "grab",
                    }}
                  >
                    <h4 style={{ margin: "0 0 10px 0" }}>{task.title}</h4>

                    {task.priority === "high" && (
                      <span
                        style={{
                          background: "#ffccc7",
                          color: "#cf1322",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        High
                      </span>
                    )}

                    {deadlineInfo && (
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {deadlineInfo.overdue !== undefined ? (
                          <div style={{ color: "red", marginTop: "4px" }}>
                            Прострочено на {deadlineInfo.overdue} днів!
                          </div>
                        ) : (
                          task.status !== "done" && (
                            <div style={{ color: "#5e6c84", marginTop: "4px" }}>
                              До дедлайну: {deadlineInfo.remaining} днів
                            </div>
                          )
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: currentUser?.role === "lead" ? "space-between" : "flex-end",
                        alignItems: "center",
                      }}
                    >
                      {currentUser?.role === "lead" && (
                        <button
                          type="button"
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsModalOpen(true);
                          }}
                          style={{
                            marginTop: "10px",
                            padding: "4px 8px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "16px",
                          }}
                        >
                          <i className="fa-solid fa-gear" style={{
                            color: "#5e6c84",
                            fontSize: "16px",
                          }}></i>
                        </button>
                      )}
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "14px",
                          color: "gray",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <ProfileCard userId={task.assigneeId} />
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* "Add card" button (Team lead only and only in the Todo column) */}
            {currentUser?.role === "lead" && col === "todo" && (
              <button
                onClick={() => {
                  setTaskToEdit(null);
                  setIsModalOpen(true);
                }}
                type="button"
                style={{
                  width: "100%",
                  padding: "10px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: "#5e6c84",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#dadbe2")
                }
                onFocus={(e) => (e.target.style.backgroundColor = "#dadbe2")}
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                onBlur={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                + Додати картку
              </button>
            )}
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={taskToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
      />
    </div>
  );
};
