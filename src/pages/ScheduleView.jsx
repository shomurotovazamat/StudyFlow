import {Tag, Btn, EmptyCard} from '../components/UI'
import {DAYS_SHORT, DAYS_FULL, TYPE_CFG} from '../constants'

export default function ScheduleView({sched, todayNum, onAdd, onDelete}) {
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28}}>
                <div>
                    <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 4}}>Управление занятиями</div>
                    <h1 style={{fontSize: 24, fontWeight: 700, color: '#0f172a'}}>Недельное расписание</h1>
                </div>
                <Btn variant="primary" onClick={onAdd}>+ Добавить занятие</Btn>
            </div>

            {DAYS_FULL.map((day, i) => {
                const dayNum = i + 1
                const isToday = dayNum === todayNum
                const classes = sched
                    .filter(c => c.day === dayNum)
                    .sort((a, b) => a.s.localeCompare(b.s))

                return (
                    <DayRow
                        key={day}
                        day={day}
                        dayShort={DAYS_SHORT[i]}
                        isToday={isToday}
                        classes={classes}
                        onDelete={onDelete}
                    />
                )
            })}
        </div>
    )
}

function DayRow({day, dayShort, isToday, classes, onDelete}) {
    return (
        <div
            className="card"
            style={{borderColor: isToday ? '#a5b4fc' : '#e2e8f0'}}
        >
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: classes.length ? 14 : 0}}>
                <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: isToday ? '#6366f1' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13,
                    color: isToday ? '#fff' : '#64748b',
                    flexShrink: 0,
                }}>
                    {dayShort}
                </div>
                <div style={{
                    fontWeight: isToday ? 700 : 500,
                    fontSize: 14,
                    color: isToday ? '#6366f1' : '#475569',
                }}>
                    {day}{isToday ? ' — Сегодня' : ''}
                </div>
                {classes.length === 0 && (
                    <span style={{fontSize: 12, color: '#cbd5e1', marginLeft: 'auto'}}>нет занятий</span>
                )}
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
                {classes.map(cl => (
                    <ClassCard key={cl.id} cl={cl} onDelete={onDelete}/>
                ))}
            </div>
        </div>
    )
}

function ClassCard({cl, onDelete}) {
    const cfg = TYPE_CFG[cl.type]
    return (
        <div style={{
            flex: '1 1 260px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderLeft: `3px solid ${cfg.color}`,
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        }}>
            <div style={{flex: 1, paddingRight: 8}}>
                <div style={{fontWeight: 600, fontSize: 13, marginBottom: 3}}>{cl.subj}</div>
                <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 8}}>
                    {cl.teacher}{cl.room ? ` · ${cl.room}` : ''}
                </div>
                <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
            </div>
            <div style={{textAlign: 'right', flexShrink: 0}}>
                <div style={{fontWeight: 700, fontSize: 14, color: '#6366f1'}}>{cl.s}</div>
                <div style={{fontSize: 11, color: '#94a3b8', marginBottom: 8}}>{cl.e}</div>
                <Btn variant="danger" onClick={() => onDelete(cl.id)}
                     style={{padding: '3px 10px', fontSize: 11}}>✕</Btn>
            </div>
        </div>
    )
}
