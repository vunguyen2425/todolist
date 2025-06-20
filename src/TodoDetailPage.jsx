import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

function TodoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    const list = saved ? JSON.parse(saved) : [];
    setTodos(list);
    const found = list.find(t => t.id === Number(id));
    setTodo(found);
    if (found) {
      setText(found.text);
      setDeadline(found.deadline || '');
    }
  }, [id]);

  const save = () => {
    const updated = todos.map(t => t.id === Number(id) ? { ...t, text, deadline } : t);
    setTodos(updated);
    localStorage.setItem('todos', JSON.stringify(updated));
    navigate('/');
  };
  const del = () => {
    const updated = todos.filter(t => t.id !== Number(id));
    setTodos(updated);
    localStorage.setItem('todos', JSON.stringify(updated));
    navigate('/');
  };
  const toggle = () => {
    const updated = todos.map(t => t.id === Number(id) ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    localStorage.setItem('todos', JSON.stringify(updated));
    setTodo(t => t ? { ...t, completed: !t.completed } : t);
  };

  if (!todo) return <div>Không tìm thấy công việc. <Link to="/">Quay lại</Link></div>;

  return (
    <div style={{padding:'1.5em'}}>
      <h2>Chi tiết công việc</h2>
      <div style={{marginBottom:12}}>
        <label>Nội dung:</label><br/>
        <input value={text} onChange={e => setText(e.target.value)} style={{width:'100%',marginBottom:8}} />
      </div>
      <div style={{marginBottom:12}}>
        <label>Deadline:</label><br/>
        <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} style={{width:'100%',marginBottom:8}} />
      </div>
      <div style={{marginBottom:12}}>
        <label>Trạng thái:</label><br/>
        <input type="checkbox" checked={todo.completed} onChange={toggle} /> {todo.completed ? 'Đã xong' : 'Chưa xong'}
      </div>
      <button className="save-btn" onClick={save}>Lưu</button>
      <button className="delete-btn" onClick={del} style={{marginLeft:8}}>Xóa</button>
      <Link to="/" style={{marginLeft:16}}>Quay lại danh sách</Link>
    </div>
  );
}

export default TodoDetailPage; 