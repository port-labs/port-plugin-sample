import { useMemo } from 'react';
import { useEntities, type EntitySearchBody, type EntitySearchRule } from '../hooks/useEntities';
import { usePostMessageData } from '../hooks/usePostMessageData';

type PortEntity = {
	identifier: string;
	title: string;
	icon?: string;
	team?: string;
	properties?: Record<string, unknown>;
	relations?: Record<string, unknown>;
};

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

	const blueprint1 = typeof params.blueprint1 === 'string' ? params.blueprint1.trim() : '';
	const blueprint2 = typeof params.blueprint2 === 'string' ? params.blueprint2.trim() : '';

	const entitiesSearchBody = useMemo(
		() => buildDualBlueprintSearchBody(blueprint1, blueprint2),
		[blueprint1, blueprint2]
	);

	const entitiesQuery = useEntities(entitiesSearchBody);
	const entities: PortEntity[] = Array.isArray(entitiesQuery.data?.entities)
		? entitiesQuery.data.entities
		: [];

	return (
		<section className="entities-table-section data-card" aria-labelledby="entities-table-heading">
			<h2 id="entities-table-heading" className="data-card__title">
				<span className="data-card__icon" aria-hidden>
					📊
				</span>
				Entities
				{(blueprint1 || blueprint2) && (
					<span className="entities-table__subtitle">
						({[blueprint1, blueprint2].filter(Boolean).join(' · ')})
					</span>
				)}
			</h2>
			{!blueprint1 && !blueprint2 ? (
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
								const bp =
									typeof row.properties?.$blueprint === 'string'
										? row.properties.$blueprint
										: '—';
								return (
									<tr key={row.identifier}>
										<td className="entities-table__title-cell">
											{row.icon ? <span className="entities-table__icon">{row.icon}</span> : null}
											{row.title ?? '—'}
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
