import {Btn} from '../components/UI'
import {daysUntil, fmtDate, urgentColor} from '../constants'

export default function NotifView({tasks, perm, onReq, onTest}) {
    const active = tasks.filter(t => t.status !== 'done' && t.deadline)

    const permInfo = {
        granted: {color: '#15803d', bg: '#dcfce7', text: '✅ Разрешено'},
        denied: {color: '#b91c1c', bg: '#fee2e2', text: '❌ Заблокировано'},
        default: {color: '#b45309', bg: '#fef3c7', text: '⏳ Не настроено'},
    }[perm] || {}

    return (
        <div>
            <div style={{marginBottom: 28}}>
                <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 4}}>Система напоминаний</div>
                <h1 style={{fontSize: 24, fontWeight: 700, color: '#0f172a'}}>Уведомления</h1>
            </div>

            <div
                className="card"
                style={{maxWidth: 520, marginBottom: 20}}
            >
                <div style={{fontWeight: 700, fontSize: 16, marginBottom: 10}}>🔔 Браузерные уведомления</div>
                <div style={{fontSize: 13, color: '#64748b', marginBottom: 16}}>
                    Разрешите уведомления, чтобы StudyFlow автоматически напоминал о дедлайнах
                    за <strong>24 часа</strong> и за <strong>1 час</strong> до сдачи.
                </div>

                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '5px 14px', borderRadius: 20,
                    background: permInfo.bg, color: permInfo.color,
                    fontSize: 13, fontWeight: 600, marginBottom: 16,
                }}>
                    {permInfo.text}
                </div>

                <div style={{display: 'flex', gap: 10}}>
                    {perm === 'default' && (
                        <Btn variant="primary" onClick={onReq}>Разрешить уведомления</Btn>
                    )}
                    {perm === 'granted' && (
                        <Btn onClick={onTest}>Отправить тест</Btn>
                    )}
                    {perm === 'denied' && (
                        <div style={{fontSize: 12, color: '#b91c1c'}}>
                            Разрешите уведомления вручную в настройках браузера (значок 🔒 в адресной строке).
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{maxWidth: 520}}>
                <div style={{fontWeight: 700, fontSize: 16, marginBottom: 4}}>📋 Активные дедлайны</div>
                <div style={{fontSize: 12, color: '#94a3b8', marginBottom: 16}}>
                    Уведомления отправляются автоматически при создании задачи с дедлайном
                </div>

                {active.length === 0
                    ? <div style={{fontSize: 13, color: '#94a3b8'}}>Нет активных задач с дедлайном</div>
                    : active.map((t, i) => <DeadlineRow key={t.id} t={t} last={i === active.length - 1}/>)
                }
            </div>
        </div>
    )
}

function DeadlineRow({t, last}) {
    const d = daysUntil(t.deadline)
    const uc = urgentColor(d, t.status)

    const daysLabel =
        d == null ? '' :
            d < 0 ? 'Просрочено' :
                d === 0 ? 'Сегодня' :
                    `${d} дн.`

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: last ? 'none' : '1px solid #f1f5f9',
        }}>
            <div>
                <div style={{fontWeight: 600, fontSize: 14}}>{t.title}</div>
                <div style={{fontSize: 11, color: '#94a3b8', marginTop: 2}}>
                    {t.subj} · {fmtDate(t.deadline)}
                </div>
            </div>
            <div style={{
                fontWeight: 700, fontSize: 13,
                color: uc || '#94a3b8',
                flexShrink: 0, marginLeft: 16,
            }}>
                {daysLabel}
            </div>
        </div>
    )
}
