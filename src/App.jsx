import {useState, useEffect} from 'react'
import {Btn, Field, Modal} from './components/UI'
import {DAYS_FULL, INIT_SCHEDULE, INIT_TASKS, getTodayNum} from './constants'
import {useLocalStorage} from './hooks/useLocalStorage'
import TodayView from './pages/TodayView'
import ScheduleView from './pages/ScheduleView'
import TasksView from './pages/TasksView'
import NotifView from './pages/NotifView'

const NAV_ITEMS = [
    {id: 'today', label: 'Сегодня', icon: '⊞'},
    {id: 'schedule', label: 'Расписание', icon: '▦'},
    {id: 'tasks', label: 'Задачи', icon: '☑'},
    {id: 'notif', label: 'Уведомления', icon: '◉'},
]

const EMPTY_CLASS = {day: 1, s: '09:00', e: '10:30', subj: '', type: 'lecture', teacher: '', room: ''}
const EMPTY_TASK = {title: '', subj: '', deadline: '', pri: 'medium', status: 'not_started'}

export default function App() {
    const [page, setPage] = useState('today')
    const [notifPerm, setNotifPerm] = useState('default')
    const [showAddCl, setShowAddCl] = useState(false)
    const [showAddTk, setShowAddTk] = useState(false)
    const [newCl, setNewCl] = useState(EMPTY_CLASS)
    const [newTk, setNewTk] = useState(EMPTY_TASK)

    const [sched, setSched] = useLocalStorage('studyflow_schedule', INIT_SCHEDULE)
    const [tasks, setTasks] = useLocalStorage('studyflow_tasks', INIT_TASKS)

    const todayNum = getTodayNum()

    useEffect(() => {
        if ('Notification' in window) setNotifPerm(Notification.permission)
    }, [])

    const requestNotif = async () => {
        if (!('Notification' in window)) return
        const p = await Notification.requestPermission()
        setNotifPerm(p)
        if (p === 'granted') new Notification('StudyFlow ✅', {body: 'Уведомления включены!'})
    }

    const scheduleNotif = (task) => {
        if (notifPerm !== 'granted' || !task.deadline) return
        const dl = new Date(task.deadline + 'T09:00:00')
        const now = new Date()
        ;[{ms: 86400000, label: '24 часа'}, {ms: 3600000, label: '1 час'}].forEach(({ms, label}) => {
            const diff = dl - now - ms
            if (diff > 0) setTimeout(() => new Notification(`StudyFlow — дедлайн через ${label}!`, {body: task.title}), diff)
        })
    }

    const handleAddClass = () => {
        if (!newCl.subj.trim()) return
        setSched(prev => [...prev, {...newCl, id: Date.now()}])
        setNewCl(EMPTY_CLASS)
        setShowAddCl(false)
    }

    const handleDeleteClass = (id) => setSched(prev => prev.filter(c => c.id !== id))

    const handleAddTask = () => {
        if (!newTk.title.trim()) return
        const t = {...newTk, id: Date.now()}
        setTasks(prev => [...prev, t])
        scheduleNotif(t)
        setNewTk(EMPTY_TASK)
        setShowAddTk(false)
    }

    const handleStatusChange = (id, status) => setTasks(prev => prev.map(t => t.id === id ? {...t, status} : t))
    const handleDeleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

    return (
        <div style={{display: 'flex', height: '100vh', overflow: 'hidden'}}>
            <Sidebar page={page} onNavigate={setPage}/>

            <main style={{flex: 1, overflow: 'auto', padding: 28, background: '#f8fafc'}}>
                {page === 'today' && <TodayView sched={sched} tasks={tasks} todayNum={todayNum}/>}
                {page === 'schedule' && <ScheduleView sched={sched} todayNum={todayNum} onAdd={() => setShowAddCl(true)}
                                                      onDelete={handleDeleteClass}/>}
                {page === 'tasks' &&
                    <TasksView tasks={tasks} onAdd={() => setShowAddTk(true)} onStatus={handleStatusChange}
                               onDelete={handleDeleteTask}/>}
                {page === 'notif' && <NotifView tasks={tasks} perm={notifPerm} onReq={requestNotif}
                                                onTest={() => notifPerm === 'granted' && new Notification('StudyFlow', {body: 'Тестовое уведомление!'})}/>}
            </main>

            {showAddCl && (
                <Modal title="Добавить занятие" onClose={() => setShowAddCl(false)}>
                    <Field label="Предмет *">
                        <input value={newCl.subj} onChange={e => setNewCl(p => ({...p, subj: e.target.value}))}
                               placeholder="Например: Математика"/>
                    </Field>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                        <Field label="День недели">
                            <select value={newCl.day} onChange={e => setNewCl(p => ({...p, day: +e.target.value}))}>
                                {DAYS_FULL.map((d, i) => <option key={i} value={i + 1}>{d}</option>)}
                            </select>
                        </Field>
                        <Field label="Тип занятия">
                            <select value={newCl.type} onChange={e => setNewCl(p => ({...p, type: e.target.value}))}>
                                <option value="lecture">Лекция</option>
                                <option value="practice">Практика</option>
                                <option value="lab">Лаборатория</option>
                            </select>
                        </Field>
                        <Field label="Начало">
                            <input type="time" value={newCl.s}
                                   onChange={e => setNewCl(p => ({...p, s: e.target.value}))}/>
                        </Field>
                        <Field label="Конец">
                            <input type="time" value={newCl.e}
                                   onChange={e => setNewCl(p => ({...p, e: e.target.value}))}/>
                        </Field>
                        <Field label="Преподаватель">
                            <input value={newCl.teacher}
                                   onChange={e => setNewCl(p => ({...p, teacher: e.target.value}))}
                                   placeholder="Иванов А.А."/>
                        </Field>
                        <Field label="Аудитория">
                            <input value={newCl.room} onChange={e => setNewCl(p => ({...p, room: e.target.value}))}
                                   placeholder="А101"/>
                        </Field>
                    </div>
                    <Btn variant="primary" onClick={handleAddClass}
                         style={{width: '100%', justifyContent: 'center', marginTop: 8, padding: 12}}>
                        + Добавить занятие
                    </Btn>
                </Modal>
            )}

            {showAddTk && (
                <Modal title="Добавить задачу" onClose={() => setShowAddTk(false)}>
                    <Field label="Название задачи *">
                        <input value={newTk.title} onChange={e => setNewTk(p => ({...p, title: e.target.value}))}
                               placeholder="Например: Сдать лабораторную работу"/>
                    </Field>
                    <Field label="Предмет">
                        <input value={newTk.subj} onChange={e => setNewTk(p => ({...p, subj: e.target.value}))}
                               placeholder="Программирование"/>
                    </Field>
                    <Field label="Дедлайн">
                        <input type="date" value={newTk.deadline}
                               onChange={e => setNewTk(p => ({...p, deadline: e.target.value}))}/>
                    </Field>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                        <Field label="Приоритет">
                            <select value={newTk.pri} onChange={e => setNewTk(p => ({...p, pri: e.target.value}))}>
                                <option value="high">🔴 Высокий</option>
                                <option value="medium">🟡 Средний</option>
                                <option value="low">🟢 Низкий</option>
                            </select>
                        </Field>
                        <Field label="Статус">
                            <select value={newTk.status}
                                    onChange={e => setNewTk(p => ({...p, status: e.target.value}))}>
                                <option value="not_started">Не начата</option>
                                <option value="in_progress">В процессе</option>
                                <option value="done">Готово</option>
                            </select>
                        </Field>
                    </div>
                    <Btn variant="primary" onClick={handleAddTask}
                         style={{width: '100%', justifyContent: 'center', marginTop: 8, padding: 12}}>
                        + Добавить задачу
                    </Btn>
                </Modal>
            )}
        </div>
    )
}

function Sidebar({page, onNavigate}) {
    return (
        <aside style={{
            width: 220,
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: '100vh'
        }}>
            <div style={{padding: '22px 18px 16px', borderBottom: '1px solid #f1f5f9'}}>
                <div style={{fontSize: 18, fontWeight: 700, color: '#6366f1', letterSpacing: '-0.5px'}}>◈ StudyFlow
                </div>
                <div style={{fontSize: 11, color: '#94a3b8', marginTop: 3}}>Умный помощник студента</div>
            </div>
            <nav style={{padding: '12px 10px', flex: 1}}>
                {NAV_ITEMS.map(n => (
                    <div key={n.id} onClick={() => onNavigate(n.id)} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        marginBottom: 2,
                        background: page === n.id ? '#eef2ff' : 'transparent',
                        color: page === n.id ? '#6366f1' : '#64748b',
                        fontWeight: page === n.id ? 600 : 400,
                        fontSize: 14,
                        transition: 'all 0.15s'
                    }}>
                        <span style={{fontSize: 16, lineHeight: 1}}>{n.icon}</span>
                        {n.label}
                    </div>
                ))}
            </nav>
            <div style={{padding: '14px 18px', borderTop: '1px solid #f1f5f9'}}>
                <div style={{fontSize: 11, color: '#94a3b8'}}>StudyFlow v1.0</div>
                <div style={{fontSize: 11, color: '#cbd5e1', marginTop: 2}}>Шомуротов А. · Хтет А.К.</div>
            </div>
        </aside>
    )
}
