export const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
export const DAYS_FULL = [
    'Понедельник', 'Вторник', 'Среда', 'Четверг',
    'Пятница', 'Суббота', 'Воскресенье',
]

export const TYPE_CFG = {
    lecture: {label: 'Лекция', color: '#7c3aed', bg: '#ede9fe'},
    practice: {label: 'Практика', color: '#0369a1', bg: '#e0f2fe'},
    lab: {label: 'Лаборатория', color: '#047857', bg: '#d1fae5'},
}

export const PRI_CFG = {
    high: {label: 'Высокий', color: '#b91c1c', bg: '#fee2e2'},
    medium: {label: 'Средний', color: '#b45309', bg: '#fef3c7'},
    low: {label: 'Низкий', color: '#15803d', bg: '#dcfce7'},
}

export const STATUS_CFG = {
    not_started: {label: 'Не начата', dot: '#94a3b8'},
    in_progress: {label: 'В процессе', dot: '#3b82f6'},
    done: {label: 'Готово', dot: '#22c55e'},
}

export const INIT_SCHEDULE = [
    {
        id: 1,
        day: 1,
        s: '09:00',
        e: '10:30',
        subj: 'Управление инновационным проектом',
        type: 'lecture',
        teacher: 'Войнов Н.В.',
        room: 'А101'
    },
    {
        id: 2,
        day: 1,
        s: '12:00',
        e: '13:30',
        subj: 'Математический анализ',
        type: 'practice',
        teacher: 'Иванов А.А.',
        room: 'Б205'
    },
    {
        id: 3,
        day: 2,
        s: '10:00',
        e: '11:30',
        subj: 'Программирование',
        type: 'lab',
        teacher: 'Петров С.С.',
        room: 'К301'
    },
    {
        id: 4,
        day: 3,
        s: '09:00',
        e: '10:30',
        subj: 'Базы данных',
        type: 'lecture',
        teacher: 'Сидоров В.В.',
        room: 'А201'
    },
    {id: 5, day: 4, s: '14:00', e: '15:30', subj: 'Веб-разработка', type: 'lab', teacher: 'Козлов М.М.', room: 'К402'},
    {
        id: 6,
        day: 5,
        s: '11:00',
        e: '12:30',
        subj: 'Управление инновационным проектом',
        type: 'practice',
        teacher: 'Войнов Н.В.',
        room: 'Б101'
    },
]

export const INIT_TASKS = [
    {
        id: 1,
        title: 'Сдать паспорт проекта StudyFlow',
        subj: 'Управление инновационным проектом',
        deadline: '2026-05-01',
        pri: 'high',
        status: 'in_progress'
    },
    {
        id: 2,
        title: 'Лабораторная работа №3',
        subj: 'Программирование',
        deadline: '2026-04-22',
        pri: 'high',
        status: 'not_started'
    },
    {
        id: 3,
        title: 'Реферат по базам данных',
        subj: 'Базы данных',
        deadline: '2026-04-28',
        pri: 'medium',
        status: 'not_started'
    },
    {
        id: 4,
        title: 'Тест по математическому анализу',
        subj: 'Математический анализ',
        deadline: '2026-04-19',
        pri: 'medium',
        status: 'done'
    },
]

export function daysUntil(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0)
    const n = new Date();
    n.setHours(0, 0, 0, 0)
    return Math.round((d - n) / 86400000)
}

export function fmtDate(s) {
    if (!s) return ''
    return new Date(s).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'})
}

export function urgentColor(days, status) {
    if (status === 'done' || days == null) return null
    if (days <= 0) return '#b91c1c'
    if (days <= 3) return '#b45309'
    return null
}

export function getTodayNum() {
    const d = new Date().getDay()
    return d === 0 ? 7 : d
}
