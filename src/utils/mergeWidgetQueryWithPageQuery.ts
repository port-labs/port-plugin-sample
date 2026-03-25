import { EntitySearchBody, EntitySearchRuleOrGroup } from "../hooks/entitiesSearch";

export const DASHBOARD_FILTERS_META_BLUEPRINT = 'dashboard-filters-meta-blueprint';


export function mergeWidgetQueryWithPageQuery(
	widgetQuery: EntitySearchBody,
	pageQuery?: Record<string, unknown>[],
	blueprint?: Record<string, unknown>,
): EntitySearchBody {
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
			rules: [widgetQuery, ...relevantPageQueriesRules.filter((rule) => !('property' in rule && rule.property === '$team'))] as EntitySearchRuleOrGroup[],
		} satisfies EntitySearchBody;
	}

	return {
		combinator: 'and',
		rules: [widgetQuery, ...relevantPageQueriesRules] as EntitySearchRuleOrGroup[],
	} satisfies EntitySearchBody;
}
