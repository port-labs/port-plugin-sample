import { useMemo } from 'react';

import type { TableFocusScopeContextType } from './cells/TableFocusProvider';

export function useTableFocusScopeValue(): TableFocusScopeContextType {
	return useMemo(() => {
		const nodes = new Set<HTMLElement>();
		return {
			nodes,
			add: (el: HTMLElement) => {
				nodes.add(el);
			},
			remove: (el: HTMLElement) => {
				nodes.delete(el);
			},
		};
	}, []);
}
