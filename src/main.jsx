import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Check, Circle, ClipboardList, Plus, Sparkles, Trash2 } from 'lucide-react';
import './styles.css';

const starterTasks = [
  { id: 1, text: 'Plan the week ahead', done: true },
  { id: 2, text: 'Reply to the important emails', done: false },
  { id: 3, text: 'Take a proper lunch break', done: false },
];

function readTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem('daymark-tasks'));
    return Array.isArray(saved) ? saved : starterTasks;
  } catch {
    return starterTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState('');

  useEffect(() => localStorage.setItem('daymark-tasks', JSON.stringify(tasks)), [tasks]);

  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  }), [tasks, filter]);
  const remaining = tasks.filter(task => !task.done).length;

  function addTask(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks(current => [{ id: Date.now(), text, done: false }, ...current]);
    setDraft('');
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  }

  function removeTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
  }

  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Daymark home"><span className="brand-mark"><Check size={15} strokeWidth={3} /></span>daymark</a>
        <span className="topbar-note"><span className="status-dot" /> a little more intentional</span>
      </header>

      <section className="workspace" aria-label="Todo list">
        <div className="intro">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL SPACE</div>
          <h1>Make room for<br /><em>what matters.</em></h1>
          <p className="date-line">{date}<span className="date-separator">/</span><span>{remaining === 1 ? '1 thing' : `${remaining} things`} left to do</span></p>
        </div>

        <section className="list-card">
          <div className="card-heading">
            <div><span className="section-kicker">THE LIST</span><h2>Today’s focus</h2></div>
            <span className="task-count">{String(tasks.length).padStart(2, '0')} <span>items</span></span>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <label className="sr-only" htmlFor="new-task">Add a task</label>
            <Plus className="input-plus" size={19} />
            <input id="new-task" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Add something to your day..." maxLength={120} />
            <button className="add-button" type="submit" aria-label="Add task"><ArrowUpRight size={18} /></button>
          </form>

          <div className="list-toolbar">
            <span className="list-label">YOUR TASKS</span>
            <div className="filters" role="group" aria-label="Filter tasks">
              {[['all', 'All'], ['active', 'To do'], ['completed', 'Done']].map(([key, label]) => <button key={key} className={filter === key ? 'filter active' : 'filter'} onClick={() => setFilter(key)} type="button">{label}</button>)}
            </div>
          </div>

          {visibleTasks.length ? <ul className="task-list">
            {visibleTasks.map((task, index) => <li className={task.done ? 'task done' : 'task'} key={task.id} style={{ '--row': index }}>
              <button className="check-button" type="button" onClick={() => toggleTask(task.id)} aria-label={task.done ? `Mark ${task.text} incomplete` : `Complete ${task.text}`}>{task.done ? <Check size={14} strokeWidth={2.5} /> : <Circle size={19} strokeWidth={1.5} />}</button>
              <span className="task-text">{task.text}</span>
              <button className="delete-button" type="button" onClick={() => removeTask(task.id)} aria-label={`Delete ${task.text}`}><Trash2 size={16} /></button>
            </li>)}
          </ul> : <div className="empty-state"><span className="empty-icon"><ClipboardList size={20} /></span><p>{filter === 'all' ? 'Your list is clear.' : filter === 'active' ? 'Nothing left to do.' : 'No completed tasks yet.'}</p><span>{filter === 'all' ? 'Add a task above to get started.' : 'Try another filter or add a new task.'}</span></div>}

          <footer className="card-footer"><span><Sparkles size={14} /> Small steps count.</span><button type="button" className="clear-button" onClick={() => setTasks(current => current.filter(task => !task.done))} disabled={!tasks.some(task => task.done)}>Clear completed</button></footer>
        </section>
        <p className="page-footnote">ONE THING AT A TIME <span>✳</span> YOU’VE GOT THIS</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
