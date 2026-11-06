import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("board_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("http://localhost:3001/users");
        const tasksRes = await fetch("http://localhost:3001/tasks");

        const usersData = await usersRes.json();
        const tasksData = await tasksRes.json();

        setUsers(usersData);
        setTasks(tasksData);
      } catch (error) {
        console.error(
          "Помилка завантаження даних. Чи запущено json-server?",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("board_user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("board_user");
  };

  const register = async (name, email, password) => {
    if (users.some((u) => u.email === email)) return false;

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "member",
      bgcolor: "#5695c9",
    };

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const savedUser = await response.json();
        setUsers((prev) => [...prev, savedUser]);
        return true;
      }
    } catch (error) {
      console.error("Помилка при збереженні користувача:", error);
    }
    return false;
  };

  const updateUser = async (userId, updates) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update the list of all users
        setUsers((prev) =>
          prev.map((u) => (String(u.id) === String(userId) ? updatedUser : u)),
        );

        // If this is the current user, update them too
        if (currentUser && String(currentUser.id) === String(userId)) {
          setCurrentUser(updatedUser);
          localStorage.setItem("board_user", JSON.stringify(updatedUser));
        }
        return true;
      }
    } catch (err) {
      console.error("Помилка при оновленні профілю:", err);
    }
    return false;
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
        return true;
      }
    } catch (err) {
      console.error("Помилка при створенні задачі", err);
    }
    return false;
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) =>
            String(task.id) === String(taskId) ? updatedTask : task,
          ),
        );
        return true;
      }
    } catch (err) {
      console.error("Помилка при оновленні задачі", err);
    }
    return false;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        String(t.id) === String(taskId) ? { ...t, status: newStatus } : t,
      ),
    );

    try {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Помилка при оновленні статусу", err);
    }
  };

  const contextValue = useMemo(
    () => ({
      currentUser,
      users,
      tasks,
      setTasks,
      login,
      logout,
      register,
      isLoading,
      addTask,
      updateTask,
      updateTaskStatus,
      updateUser,
    }),
    [currentUser, tasks, users],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
