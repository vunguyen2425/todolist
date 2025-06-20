import { useState } from 'react';

function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');

  const clearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ công việc?')) {
      localStorage.removeItem('todos');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = localStorage.getItem('todos') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        localStorage.setItem('todos', JSON.stringify(data));
        window.location.reload();
      } catch {
        alert('File không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const changeTheme = t => {
    setTheme(t);
    localStorage.setItem('theme', t);
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (t === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div style={{padding:'1.5em'}}>
      <h2>Cài đặt</h2>
      <div style={{marginBottom:16}}>
        <button onClick={clearAll} className="delete-btn">Xóa toàn bộ công việc</button>
      </div>
      <div style={{marginBottom:16}}>
        <button onClick={exportData}>Xuất dữ liệu</button>
        <label style={{marginLeft:12}}>
          <input type="file" accept="application/json" style={{display:'none'}} onChange={importData} />
          <span className="add-btn" style={{cursor:'pointer'}}>Nhập dữ liệu</span>
        </label>
      </div>
      <div style={{marginBottom:16}}>
        <span>Chủ đề: </span>
        <button onClick={() => changeTheme('auto')} className={theme==='auto'?'active':''}>Tự động</button>
        <button onClick={() => changeTheme('light')} className={theme==='light'?'active':''}>Sáng</button>
        <button onClick={() => changeTheme('dark')} className={theme==='dark'?'active':''}>Tối</button>
      </div>
    </div>
  );
}

export default SettingsPage; 