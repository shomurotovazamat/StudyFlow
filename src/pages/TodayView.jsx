import {Tag, EmptyCard} from '../components/UI'
import {TYPE_CFG, PRI_CFG, daysUntil, fmtDate, urgentColor} from '../constants'

export default function TodayView({sched, tasks, todayNum}) {
    const today = new Date()
    const dayLabel = today.toLocaleDateString('ru-RU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const todayClasses = sched
        .filter(c => c.day === todayNum)
        .sort((a, b) => a.s.localeCompare(b.s))

    const pendingTasks = tasks
        .filter(t => t.status !== 'done')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

    return (
        <div>
            <div style={{marginBottom: 28}}>
                <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 4, textTransform: 'capitalize'}}>
                    {dayLabel}
                </div>
                <h1 style={{fontSize: 24, fontWeight: 700, color: '#0f172a'}}>Панель «Сегодня»</h1>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28}}>
                {[
                    {label: 'Занятий сегодня', val: todayClasses.length, icon: '📅'},
                    {label: 'Активных задач', val: tasks.filter(t => t.status !== 'done').length, icon: '📝'},
                    {label: 'Выполнено задач', val: tasks.filter(t => t.status === 'done').length, icon: '✅'},
                ].map(s => (
                    <div
                        key={s.label}
                        style={{
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 12,
                            padding: '18px 20px'
                        }}
                    >
                        <div style={{fontSize: 20, marginBottom: 8}}>{s.icon}</div>
                        <div style={{fontSize: 30, fontWeight: 700, color: '#6366f1', lineHeight: 1}}>{s.val}</div>
                        <div style={{fontSize: 12, color: '#94a3b8', marginTop: 4}}>{s.label}</div>
                    </div>
                ))}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
                <div>
                    <SectionTitle>Занятия сегодня</SectionTitle>
                    {todayClasses.length === 0
                        ? <EmptyCard text="Занятий нет — отличный день! 🎉"/>
                        : todayClasses.map(cl => <ClassCard key={cl.id} cl={cl}/>)
                    }
                </div>

                <div>
                    <SectionTitle>Ближайшие дедлайны</SectionTitle>
                    {pendingTasks.length === 0
                        ? <EmptyCard text="Все задачи выполнены! 🎉"/>
                        : pendingTasks.slice(0, 6).map(t => <DeadlineCard key={t.id} t={t}/>)
                    }
                </div>
            </div>
        </div>
    )
}

function SectionTitle({children}) {
    return (
        <div style={{
            fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 14,
            textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
            {children}
        </div>
    )
}

function ClassCard({cl}) {
    const cfg = TYPE_CFG[cl.type]
    return (
        <div className="card" style={{borderLeft: `3px solid ${cfg.color}`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1, paddingRight: 12}}>
                    <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{cl.subj}</div>
                    <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 10}}>
                        {cl.teacher} · {cl.room}
                    </div>
                    <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                </div>
                <div style={{textAlign: 'right', flexShrink: 0}}>
                    <div style={{fontWeight: 700, fontSize: 15, color: '#6366f1'}}>{cl.s}</div>
                    <div style={{fontSize: 12, color: '#94a3b8'}}>{cl.e}</div>
                </div>
            </div>
        </div>
    )
}

function DeadlineCard({t}) {
    const d = daysUntil(t.deadline)
    const uc = urgentColor(d, t.status)
    const priCfg = PRI_CFG[t.pri]

    const daysLabel =
        d == null ? '' :
            d < 0 ? 'Просрочено!' :
                d === 0 ? 'Сегодня!' :
                    `${d} дн.`

    return (
        <div className="card" style={{borderLeft: `3px solid ${uc || '#e2e8f0'}`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1, paddingRight: 12}}>
                    <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{t.title}</div>
                    <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 10}}>{t.subj}</div>
                    <Tag color={priCfg.color} bg={priCfg.bg}>{priCfg.label}</Tag>
                </div>
                <div style={{textAlign: 'right', flexShrink: 0}}>
                    <div style={{fontWeight: 700, fontSize: 13, color: uc || '#64748b'}}>{daysLabel}</div>
                    <div style={{fontSize: 11, color: '#94a3b8'}}>{fmtDate(t.deadline)}</div>
                </div>
            </div>
        </div>
    )
}
