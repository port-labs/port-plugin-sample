import { type ReactNode, createContext, useContext } from 'react';

export interface TableFocusScopeContextType {
	nodes: Set<HTMLElement>;
	add: (el: HTMLElement) => void;
	remove: (el: HTMLElement) => void;
}

type TableFocusScopeProviderProps = {
	scope: TableFocusScopeContextType;
	children: ReactNode;
};

const TableFocusContext = createContext<TableFocusScopeContextType | null>(null);

export function TableFocusProvider({ scope, children }: TableFocusScopeProviderProps) {
	return <TableFocusContext.Provider value={scope}>{children}</TableFocusContext.Provider>;
}

export function useTableFocusScope(): TableFocusScopeContextType | null {
	return useContext(TableFocusContext);
}
