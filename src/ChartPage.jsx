import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, isThisWeek, isThisMonth, isToday, parseISO } from 'date-fns';

function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

function ChartPage() {
  const [todos, setTodos] = useState([]);
  const [mode, setMode] = useState('day');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    setTodos(saved ? JSON.parse(saved) : []);
  }, []);

  let data = [];
  if (mode === 'day') {
    const byDay = groupBy(todos, t => t.deadline ? format(parseISO(t.deadline), 'yyyy-MM-dd') : 'Không có');
    data = Object.entries(byDay).map(([day, list]) => ({
      name: day,
      completed: list.filter(t => t.completed).length,
      active: list.filter(t => !t.completed).length,
    }));
  } else if (mode === 'week') {
    // group by week number
    const byWeek = groupBy(todos, t => t.deadline ? format(parseISO(t.deadline), 'yyyy-ww') : 'Không có');
    data = Object.entries(byWeek).map(([week, list]) => ({
      name: week,
      completed: list.filter(t => t.completed).length,
      active: list.filter(t => !t.completed).length,
    }));
  } else if (mode === 'month') {
    const byMonth = groupBy(todos, t => t.deadline ? format(parseISO(t.deadline), 'yyyy-MM') : 'Không có');
    data = Object.entries(byMonth).map(([month, list]) => ({
      name: month,
      completed: list.filter(t => t.completed).length,
      active: list.filter(t => !t.completed).length,
    }));
  }

  return (
    <div style={{padding:'1.5em'}}>
      <h2>Biểu đồ công việc</h2>
      <div style={{marginBottom:16}}>
        <button onClick={() => setMode('day')} className={mode==='day'?'active':''}>Ngày</button>
        <button onClick={() => setMode('week')} className={mode==='week'?'active':''} style={{marginLeft:8}}>Tuần</button>
        <button onClick={() => setMode('month')} className={mode==='month'?'active':''} style={{marginLeft:8}}>Tháng</button>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#4caf50" name="Đã xong" />
          <Bar dataKey="active" fill="#f44336" name="Chưa xong" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartPage; 