import { usePortPluginData } from "@port-labs/plugins-sdk/react";
import { entitiesSearch, type EntitySearchBody } from "../hooks/entitiesSearch";
import { useBlueprints } from "../hooks/useBlueprints";
import { DataCard } from "./DataCard/DataCard";
import { EmptySection } from "./DataCard/EmptySection";
import { ErrorSection } from "./DataCard/ErrorSection";

export const EntitiesSearchExample = () => {
	const { portToken } = usePortPluginData();
	const blueprints = useBlueprints();

	const firstBlueprint = blueprints.data?.blueprints?.[0] as Record<string, unknown> | undefined;
	const blueprintId = typeof firstBlueprint?.identifier === "string" ? firstBlueprint.identifier : undefined;

	const searchBody: EntitySearchBody = {
		combinator: "and",
		rules: blueprintId ? [{ property: "$blueprint", operator: "=", value: blueprintId }] : [],
	};

	const search = entitiesSearch(firstBlueprint ?? {}, searchBody, {
		enabled: !!blueprintId,
	});

	if (!portToken) {
		return <EmptySection title="Entities search" icon="🔎" emptyMessage="Waiting for token…" />;
	}
	if (blueprints.isLoading) {
		return <EmptySection title="Entities search" icon="🔎" emptyMessage="Loading blueprints…" />;
	}
	if (blueprints.isError) {
		return (
			<ErrorSection
				title="Entities search"
				icon="🔎"
				errorMessage={blueprints.error instanceof Error ? blueprints.error.message : "Failed to load blueprints"}
			/>
		);
	}
	if (!firstBlueprint || !blueprintId) {
		return <EmptySection title="Entities search" icon="🔎" emptyMessage="No blueprint available for sample search" />;
	}
	if (search.isLoading) {
		return <EmptySection title="Entities search" icon="🔎" emptyMessage="Searching entities…" />;
	}
	if (search.isError) {
		return (
			<ErrorSection
				title="Entities search"
				icon="🔎"
				errorMessage={search.error instanceof Error ? search.error.message : "Search failed"}
			/>
		);
	}

	return (
		<DataCard title="Entities search (example)" icon="🔎">
			<div className="data-row_blueprint">
				<div className="data-value">
					<pre className="data-value-json">{JSON.stringify(search.data, null, 2)}</pre>
				</div>
			</div>
		</DataCard>
	);
};
