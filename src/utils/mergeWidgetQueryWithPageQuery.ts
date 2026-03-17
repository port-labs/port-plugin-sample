export const DASHBOARD_FILTERS_META_BLUEPRINT = 'dashboard-filters-meta-blueprint';


export function mergeWidgetQueryWithPageQuery(
	widgetQuery: Record<string, unknown>,
	pageQuery?: Record<string, unknown>[],
	blueprint?: Record<string, unknown>,
): Record<string, unknown> {
	if (!pageQuery || pageQuery.length === 0) return widgetQuery;

	const relevantPageQueriesRules = pageQuery
		.filter(
			(query) =>
				query.blueprint === blueprint?.identifier ||
				query.blueprint === DASHBOARD_FILTERS_META_BLUEPRINT ||
				query.blueprint === undefined,
		)
		.flatMap((query) => (Array.isArray(query.rules) ? query.rules : []) as Record<string, unknown>[]);

	if (relevantPageQueriesRules.length === 0) return widgetQuery;

	if (!blueprint || !('ownership' in blueprint)) {
		return {
			combinator: 'and',
			rules: [widgetQuery, ...relevantPageQueriesRules.filter((rule) => !('property' in rule && rule.property === '$team'))],
		};
	}

	return {
		combinator: 'and',
		rules: [widgetQuery, ...relevantPageQueriesRules],
	};
}
