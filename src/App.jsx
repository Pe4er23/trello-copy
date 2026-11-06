import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { LoginPage } from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';
import { SettingsPage } from './pages/SettingsPage';

// Simple 404 page (according to PDF requirements)
const NotFoundPage = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>404 - Сторінку не знайдено</h2>
    <a href="/login">Повернутися на головну</a>
  </div>
);

// Placeholders for future pages (creating and viewing tasks)
const NewTaskPage = () => <div>Task creation form (Team lead only)</div>;
const TaskDetailPage = () => <div>Task card (details and comments will be here)</div>;

export const App = () => {
  return (
    // AppProvider wraps the entire app and provides access to currentUser and tasks
    <AppProvider>
      <Router>
        <Routes>
          {/* Redirect from the root to the login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public route */}
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