import {useMemo} from 'react'
import {Tag, Btn, EmptyCard} from '../components/UI'
import {PRI_CFG, STATUS_CFG, daysUntil, fmtDate, urgentColor} from '../constants'

const COLUMNS = ['not_started', 'in_progress', 'done']

export default function TasksView({tasks, onAdd, onStatus, onDelete}) {
    const grouped = useMemo(() => {
        const g = {}
        COLUMNS.forEach(s => {
            g[s] = tasks.filter(t => t.status === s)
        })
        return g
    }, [tasks])

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28}}>
                <div>
                    <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 4}}>Управление задачами</div>
                    <h1 style={{fontSize: 24, fontWeight: 700, color: '#0f172a'}}>Трекер задач</h1>
                </div>
                <Btn variant="primary" onClick={onAdd}>+ Добавить задачу</Btn>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 18}}>
                {COLUMNS.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        tasks={grouped[status] || []}
                        onStatus={onStatus}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}

function KanbanColumn({status, tasks, onStatus, onDelete}) {
    const cfg = STATUS_CFG[status]
    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0}}/>
                <span style={{
                    fontSize: 12, fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
          {cfg.label}
        </span>
                <span style={{
                    marginLeft: 'auto', background: '#f1f5f9', color: '#94a3b8',
                    fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                }}>
          {tasks.length}
        </span>
            </div>
            {tasks.map(t => (
                <TaskCard
                    key={t.id}
                    task={t}
                    status={status}
                    onStatus={onStatus}
                    onDelete={onDelete}
                />
            ))}

            {tasks.length === 0 && <EmptyCard text="Пусто"/>}
        </div>
    )
}

function TaskCard({task, status, onStatus, onDelete}) {
    const d = daysUntil(task.deadline)
    const uc = urgentColor(d, status)
    const pri = PRI_CFG[task.pri]

    const daysLabel =
        d == null ? '' :
            d < 0 ? 'просрочено' :
                d === 0 ? 'сегодня' :
                    `${d}д`

    return (
        <div
            className="card"
            style={{
                marginBottom: 10,
                ...(uc ? {borderLeft: `3px solid ${uc}`} : {}),
            }}
        >
            <div style={{fontWeight: 600, fontSize: 13, marginBottom: 4}}>{task.title}</div>

            {task.subj && (
                <div style={{fontSize: 11, color: '#94a3b8', marginBottom: 8}}>{task.subj}</div>
            )}

            <div style={{display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12}}>
                <Tag color={pri.color} bg={pri.bg}>{pri.label}</Tag>
                {task.deadline && (
                    <Tag color={uc || '#64748b'} bg={uc ? uc + '18' : '#f1f5f9'}>
                        {fmtDate(task.deadline)}{daysLabel ? ` · ${daysLabel}` : ''}
                    </Tag>
                )}
            </div>

            <div style={{display: 'flex', gap: 5}}>
                {status === 'not_started' && (
                    <Btn onClick={() => onStatus(task.id, 'in_progress')}
                         style={{flex: 1, justifyContent: 'center', fontSize: 11, padding: '5px 8px'}}>
                        В работу
                    </Btn>
                )}
                {status !== 'done' && (
                    <Btn variant="success" onClick={() => onStatus(task.id, 'done')}
                         style={{flex: 1, justifyContent: 'center', fontSize: 11, padding: '5px 8px'}}>
                        ✓ Готово
                    </Btn>
                )}
                {status === 'done' && (
                    <Btn onClick={() => onStatus(task.id, 'not_started')}
                         style={{flex: 1, justifyContent: 'center', fontSize: 11, padding: '5px 8px'}}>
                        Вернуть
                    </Btn>
                )}
                <Btn variant="danger" onClick={() => onDelete(task.id)}
                     style={{padding: '5px 10px', fontSize: 11}}>✕</Btn>
            </div>
        </div>
    )
}
