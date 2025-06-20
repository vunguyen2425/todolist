import { Routes, Route, Link, useLocation } from 'react-router-dom';
import TodoListPage from './TodoListPage';
import TodoDetailPage from './TodoDetailPage';
import ChartPage from './ChartPage';
import SettingsPage from './SettingsPage';
import './App.css';

function App() {
  const location = useLocation();
  return (
    <div className="todo-app">
      <nav className="nav">
        <Link to="/">Danh sách</Link>
        <Link to="/chart">Biểu đồ</Link>
        <Link to="/settings">Cài đặt</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/detail/:id" element={<TodoDetailPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
