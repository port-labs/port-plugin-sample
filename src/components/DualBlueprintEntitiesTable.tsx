import { useMemo } from 'react';
import { useEntities, type EntitySearchBody, type EntitySearchRule } from '../hooks/useEntities';
import { usePostMessageData } from '../hooks/usePostMessageData';
import type { PluginParam } from '../types';

function pluginParamValue(record: Record<string, unknown>, key: string): unknown {
	const entry = record[key];
	if (entry && typeof entry === 'object' && 'value' in entry) {
		return (entry as PluginParam).value;
	}
	return undefined;
}

type PortEntity = {
	identifier: string;
	title: string;
	icon?: string;
	team?: string;
	/** Present on many Port API entity payloads (not under `properties`). */
	blueprint?: unknown;
	properties?: Record<string, unknown>;
	relations?: Record<string, unknown>;
};

function coerceBlueprintLabel(raw: unknown): string {
	if (raw == null) return '';
	if (typeof raw === 'string') return raw.trim();
	if (typeof raw === 'object') {
		const o = raw as { identifier?: unknown; title?: unknown };
		const id = typeof o.identifier === 'string' ? o.identifier.trim() : '';
		const title = typeof o.title === 'string' ? o.title.trim() : '';
		if (title && id) return `${title} (${id})`;
		if (id) return id;
		if (title) return title;
	}
	return '';
}

/** Port may expose blueprint on the entity root, in properties, or omit it (use fallback when only one blueprint is queried). */
function blueprintFromEntity(
	row: PortEntity,
	fallbackWhenSingleBlueprint: string
): string {
	for (const raw of [row.blueprint, row.properties?.$blueprint, row.properties?.blueprint]) {
		const label = coerceBlueprintLabel(raw);
		if (label) return label;
	}
	if (fallbackWhenSingleBlueprint) return fallbackWhenSingleBlueprint;
	return '—';
}

/** Params may pass a blueprint id string or a Port blueprint object (uses `identifier` for search). */
function blueprintParamToIdentifier(value: unknown): string {
	if (typeof value === 'string') return value.trim();
	if (value && typeof value === 'object') {
		const id = (value as { identifier?: unknown }).identifier;
		if (typeof id === 'string') return id.trim();
	}
	return '';
}

function blueprintParamToLabel(value: unknown): string {
	if (typeof value === 'string') return value.trim();
	if (value && typeof value === 'object') {
		const o = value as { identifier?: unknown; title?: unknown };
		const id = typeof o.identifier === 'string' ? o.identifier.trim() : '';
		const title = typeof o.title === 'string' ? o.title.trim() : '';
		if (title && id) return `${title} (${id})`;
		if (title) return title;
		if (id) return id;
	}
	return '';
}

function buildDualBlueprintSearchBody(blueprint1: string, blueprint2: string): EntitySearchBody | null {
	const rules: EntitySearchRule[] = [];
	if (blueprint1) rules.push({ operator: '=', property: '$blueprint', value: blueprint1 });
	if (blueprint2) rules.push({ operator: '=', property: '$blueprint', value: blueprint2 });
	if (rules.length === 0) return null;
	if (rules.length === 1) return { combinator: 'and', rules };
	return { combinator: 'or', rules };
}

export function DualBlueprintEntitiesTable() {
	const { params, portToken } = usePostMessageData();

	const blueprint1Raw = pluginParamValue(params, 'blueprint1');
	const blueprint2Raw = pluginParamValue(params, 'blueprint2');
	const blueprint1Id = blueprintParamToIdentifier(blueprint1Raw);
	const blueprint2Id = blueprintParamToIdentifier(blueprint2Raw);
	const blueprintLabels = [blueprintParamToLabel(blueprint1Raw), blueprintParamToLabel(blueprint2Raw)].filter(Boolean);

	const entitiesSearchBody = useMemo(
		() => buildDualBlueprintSearchBody(blueprint1Id, blueprint2Id),
		[blueprint1Id, blueprint2Id]
	);

	const entitiesQuery = useEntities(entitiesSearchBody);
	const entities: PortEntity[] = Array.isArray(entitiesQuery.data?.entities)
		? entitiesQuery.data.entities
		: [];

	const fallbackBlueprintCell =
		blueprint1Id && blueprint2Id ? '' : blueprint1Id || blueprint2Id;

	return (
		<section className="entities-table-section data-card" aria-labelledby="entities-table-heading">
			<h2 id="entities-table-heading" className="data-card__title">
				<span className="data-card__icon" aria-hidden>
					📊
				</span>
				Entities
				{blueprintLabels.length > 0 && (
					<span className="entities-table__subtitle">({blueprintLabels.join(' · ')})</span>
				)}
			</h2>
			{!blueprint1Id && !blueprint2Id ? (
				<p className="data-card__empty">
					Set params <code>blueprint1</code> and/or <code>blueprint2</code> to load entities.
				</p>
			) : !portToken ? (
				<p className="data-card__empty">Waiting for Port token…</p>
			) : entitiesQuery.isPending ? (
				<p className="data-card__empty">Loading entities…</p>
			) : entitiesQuery.isError ? (
				<p className="data-card__error">
					{entitiesQuery.error instanceof Error ? entitiesQuery.error.message : 'Failed to load entities'}
				</p>
			) : entities.length === 0 ? (
				<p className="data-card__empty">No entities found for these blueprints.</p>
			) : (
				<div className="entities-table-wrap">
					<table className="entities-table">
						<thead>
							<tr>
								<th scope="col">Title</th>
								<th scope="col">Blueprint</th>
								<th scope="col">Team</th>
								<th scope="col">Identifier</th>
							</tr>
						</thead>
						<tbody>
							{entities.map((row) => {
								const bp = blueprintFromEntity(row, fallbackBlueprintCell);
								return (
									<tr key={row.identifier}>
										<td className="entities-table__title-cell">
											{row.icon ? <span className="entities-table__icon">{row.icon}</span> : null}
											{row.title ? (
												<a className="entities-table__title-link" href="#">
													{row.title}
												</a>
											) : (
												'—'
											)}
										</td>
										<td>{bp}</td>
										<td>{row.team ?? '—'}</td>
										<td className="entities-table__id-cell" title={row.identifier}>
											{row.identifier}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
