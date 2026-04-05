import { usePortPluginData } from "@port-labs/plugins-sdk/react";
import { useBlueprints } from "../hooks/useBlueprints";
import { DataCard } from "./DataCard/DataCard";
import { EmptySection } from "./DataCard/EmptySection";
import { ErrorSection } from "./DataCard/ErrorSection";

export const BlueprintDataCard = () => {
    const { portToken } = usePortPluginData();
    const blueprints = useBlueprints()

    if (!portToken) {
        return <EmptySection title="Blueprints" icon="📋" emptyMessage="Waiting for token…" />
    }
    if (blueprints.isLoading) {
        return <EmptySection title="Blueprints" icon="📋" emptyMessage="Loading blueprints…" />
    }
    if (blueprints.isError) {
        return <ErrorSection title="Blueprints" icon="📋" errorMessage={blueprints.error instanceof Error ? blueprints.error.message : 'Failed to load'} />
    }

    if (blueprints.data.blueprints.length === 0) {
        return <EmptySection title="Blueprints" icon="📋" emptyMessage="No blueprints found" />
    }

    return <DataCard title="Blueprints" icon="📋">
        {blueprints.data.blueprints.map((blueprint: unknown, index: number) => (
            <div key={index} className="data-row_blueprint">
                <div className="data-value">
                    <pre className="data-value-json"> {JSON.stringify(blueprint, null, 2)} </pre>
                </div>
            </div>
        ))}
    </DataCard>
};