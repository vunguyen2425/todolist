import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, isPast, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

const FILTERS = {
  all: todo => true,
  active: todo => !todo.completed,
  completed: todo => todo.completed,
};

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function TodoListPage() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDeadline, setEditingDeadline] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    requestNotificationPermission();
    const interval = setInterval(() => {
      todos.forEach(todo => {
        if (
          todo.deadline &&
          !todo.completed &&
          isPast(parseISO(todo.deadline)) &&
          !todo.notified
        ) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nhắc nhở', { body: `Đã đến hạn: ${todo.text}` });
          }
          setTodos(tds => tds.map(t => t.id === todo.id ? { ...t, notified: true } : t));
        }
      });
    }, 60000); // check mỗi phút
    return () => clearInterval(interval);
  }, [todos]);

  const addTodo = e => {
    e.preventDefault();
    const text = inputRef.current.value.trim();
    const deadline = e.target.deadline.value;
    if (!text) return;
    setTodos([{ id: Date.now(), text, completed: false, deadline, notified: false }, ...todos]);
    inputRef.current.value = '';
    e.target.deadline.value = '';
  };

  const toggleTodo = id => setTodos(todos => todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  const deleteTodo = id => setTodos(todos => todos.filter(todo => todo.id !== id));

  const startEdit = (id, text, deadline) => {
    setEditingId(id);
    setEditingText(text);
    setEditingDeadline(deadline || '');
  };
  const saveEdit = (id) => {
    setTodos(todos => todos.map(todo => todo.id === id ? { ...todo, text: editingText, deadline: editingDeadline } : todo));
    setEditingId(null);
    setEditingText('');
    setEditingDeadline('');
  };

  const filteredTodos = todos
    .filter(FILTERS[filter])
    .filter(todo => todo.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <h1>📝 Todo List</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input ref={inputRef} className="todo-input" placeholder="Thêm việc cần làm..." maxLength={100} />
        <input type="datetime-local" name="deadline" className="todo-input" style={{maxWidth:180}} />
        <button type="submit" className="add-btn">Thêm</button>
      </form>
      <div className="controls">
        <input
          className="search-input"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tất cả</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Chưa xong</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Đã xong</button>
        </div>
      </div>
      <ul className="todo-list">
        {filteredTodos.length === 0 && <li className="empty">Không có công việc nào</li>}
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  className="edit-input"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  style={{maxWidth:180}}
                />
                <input
                  type="datetime-local"
                  className="edit-input"
                  value={editingDeadline}
                  onChange={e => setEditingDeadline(e.target.value)}
                  style={{maxWidth:180}}
                />
                <button className="save-btn" onClick={() => saveEdit(todo.id)}>Lưu</button>
              </>
            ) : (
              <>
                <span className="todo-text" onDoubleClick={() => startEdit(todo.id, todo.text, todo.deadline)}>
                  <Link to={`/detail/${todo.id}`}>{todo.text}</Link>
                </span>
                {todo.deadline && (
                  <span style={{fontSize:'0.9em', color:'#888', marginLeft:8}}>
                    {format(parseISO(todo.deadline), 'dd/MM/yyyy HH:mm')}
                  </span>
                )}
              </>
            )}
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)} title="Xóa">✕</button>
          </li>
        ))}
      </ul>
      <footer className="footer">
        <span>{todos.filter(t => !t.completed).length} việc chưa xong</span>
        <button className="clear-btn" onClick={() => setTodos(todos.filter(t => !t.completed))}>
          Xóa việc đã xong
        </button>
      </footer>
    </>
  );
}

export default TodoListPage; 