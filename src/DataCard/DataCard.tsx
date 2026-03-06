const formatValue = (value: unknown): React.ReactNode => {
    if (value === null) return <span className="data-value-null" > null </span>;
    if (value === undefined) return <span className="data-value-undefined" >—</span>;
    if (typeof value === 'boolean') return <span className="data-value-bool" > {String(value)} </span>;
    if (typeof value === 'number') return <span className="data-value-num" > {value} </span>;
    if (typeof value === 'string') return <span className="data-value-str" > "{value}" </span>;
    if (Array.isArray(value)) return <pre className="data-value-json" > {JSON.stringify(value, null, 2)} </pre>;
    if (typeof value === 'object') return <pre className="data-value-json" > {JSON.stringify(value, null, 2)} </pre>;
    return String(value);
};


export default function DataCard({ title, data, icon }: { title: string; data: Record<string, unknown>; icon?: string }) {
    const entries = Object.entries(data);
    if (entries.length === 0) {
        return (
            <section className="data-card">
                <h2 className="data-card__title">{icon && <span className="data-card__icon">{icon}</span>}{title}</h2>
                <p className="data-card__empty">No data received yet</p>
            </section>
        );
    }
    return (
        <section className="data-card">
            <h2 className="data-card__title">{icon && <span className="data-card__icon">{icon}</span>}{title}</h2>
            <dl className="data-list">
                {entries.map(([key, value]) => (
                    <div key={key} className="data-row">
                        <dt className="data-key">{key}</dt>
                        <dd className="data-value">{formatValue(value)}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}