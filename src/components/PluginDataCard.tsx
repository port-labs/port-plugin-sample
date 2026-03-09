import { EmptySection } from "./DataCard";
import { DataCard } from "./DataCard/DataCard";

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

export const PluginDataCard = ({ title, data, icon }: { title: string; data: Record<string, unknown>; icon?: string }) => {
    const entries = Object.entries(data);

    if (entries.length === 0) {
        return <EmptySection title={title} icon={icon} emptyMessage="No data received" />
    }

    return <DataCard title={title} icon={icon}>
        {entries.map(([key, value]) => (
            <div key={key} className="data-row">
                <dt className="data-key">{key}</dt>
                <dd className="data-value">
                    {formatValue(value)}
                </dd>
            </div>
        ))}
    </DataCard>
}