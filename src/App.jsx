import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { LoginPage } from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';
import { SettingsPage } from './pages/SettingsPage';

// Простая страница 404 (согласно требованиям PDF)
const NotFoundPage = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>404 - Сторінку не знайдено</h2>
    <a href="/login">Повернутися на головну</a>
  </div>
);

// Заглушки для будущих страниц (создание и просмотр задачи)
const NewTaskPage = () => <div>Форма створення задачі (Тільки для Тімліда)</div>;
const TaskDetailPage = () => <div>Картка задачі (Тут будуть деталі та коментарі)</div>;

export const App = () => {
  return (
    // AppProvider оборачивает всё приложение, давая доступ к currentUser и tasks
    <AppProvider>
      <Router>
        <Routes>
          {/* Редирект с корня на страницу логина */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Публичный маршрут */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/tasks" element={<BoardPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;