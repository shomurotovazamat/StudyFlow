export function Tag({color, bg, children}) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 9px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                color,
                background: bg,
            }}
        >
      {children}
    </span>
    )
}

export function Btn({children, onClick, style = {}, variant = 'default'}) {
    const base = {
        padding: '8px 16px',
        fontWeight: 600,
        fontSize: 13,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...style,
    }

    const variants = {
        default: {background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569'},
        primary: {background: '#6366f1', color: '#fff', border: 'none'},
        success: {background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d'},
        danger: {background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c'},
        ghost: {background: 'transparent', border: 'none', color: '#94a3b8', padding: '4px 8px'},
    }

    return (
        <button style={{...base, ...variants[variant]}} onClick={onClick}>
            {children}
        </button>
    )
}

export function EmptyCard({text}) {
    return (
        <div
            style={{
                background: '#f8fafc',
                border: '1px dashed #e2e8f0',
                borderRadius: 12,
                padding: 32,
                textAlign: 'center',
                fontSize: 13,
                color: '#94a3b8',
            }}
        >
            {text}
        </div>
    )
}

export function Field({label, children}) {
    return (
        <div style={{marginBottom: 12}}>
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                }}
            >
                {label}
            </div>
            {children}
        </div>
    )
}

export function Modal({title, onClose, children}) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,42,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 20,
            }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 28,
                    width: '100%',
                    maxWidth: 480,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
            >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                    <span style={{fontSize: 17, fontWeight: 700}}>{title}</span>
                    <Btn variant="ghost" onClick={onClose} style={{fontSize: 20, lineHeight: 1}}>×</Btn>
                </div>
                {children}
            </div>
        </div>
    )
}
