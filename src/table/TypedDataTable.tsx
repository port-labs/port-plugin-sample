import { usePortPluginData } from '@port-labs/plugins-sdk/react';
import { type Column, DataGrid, type RenderHeaderCellProps } from '@port-labs/port-react-data-grid';
import '@port-labs/port-react-data-grid/lib/styles.css';
import { useMemo } from 'react';

import { hostThemeModeToColorScheme, hostThemeModeToRdgClass } from '../portHostTheme';
import { renderTypedCell } from './cellTypeRegistry';
import { TableFocusProvider } from './cells/TableFocusProvider';
import type { TypedColumn, TypedRow } from './columnTypes';
import './table.css';
import { useTableFocusScopeValue } from './useTableFocusScopeValue';

/** Same as apps/frontend/src/modules/core/ui-components/components/Table/consts.ts */
const RESULTS_COUNTER_HEIGHT_IN_PX = 50;
const DEFAULT_HEADER_HEIGHT_IN_PX = 56;
const DEFAULT_ROW_HEIGHT_IN_PX = 50;

export type TypedDataTableProps = {
	columns: readonly TypedColumn[];
	rows: readonly TypedRow[];
	height?: number;
	rowKeyField?: string;
};

const DEFAULT_ROW_KEY = 'id';

export default function TypedDataTable({ columns, rows, height = 480, rowKeyField = DEFAULT_ROW_KEY }: TypedDataTableProps) {
	const { theme } = usePortPluginData();
	const focusScope = useTableFocusScopeValue();

	const rdgThemeClass = useMemo(() => hostThemeModeToRdgClass(theme?.mode), [theme?.mode]);
	const hostColorScheme = useMemo(() => hostThemeModeToColorScheme(theme?.mode), [theme?.mode]);

	const gridBodyHeight = Math.max(120, height - RESULTS_COUNTER_HEIGHT_IN_PX);
	const rowCount = rows.length;

	const gridColumns: Column<TypedRow>[] = useMemo(
		() =>
			columns.map((col) => ({
				key: col.key,
				name: col.name,
				width: col.width,
				minWidth: col.minWidth ?? 100,
				resizable: col.resizable ?? true,
				sortable: col.sortable ?? true,
				renderHeaderCell: (props: RenderHeaderCellProps<TypedRow>) => (
					<div className="typed-data-table__header-inner">{props.column.name}</div>
				),
				renderCell: (props) => renderTypedCell(col, props),
			})),
		[columns],
	);

	const rowKeyGetter = useMemo(() => {
		return (row: TypedRow) => {
			const key = row[rowKeyField];
			if (typeof key === 'string' || typeof key === 'number') {
				return String(key);
			}
			return JSON.stringify(row);
		};
	}, [rowKeyField]);

	return (
		<TableFocusProvider scope={focusScope}>
			<div className="typed-data-table-wrap" style={{ height, colorScheme: hostColorScheme }}>
				<div className="typed-data-table">
					<DataGrid
						className={rdgThemeClass}
						columns={gridColumns}
						defaultColumnOptions={{ minWidth: 80, resizable: true, sortable: true }}
						headerRowHeight={DEFAULT_HEADER_HEIGHT_IN_PX}
						rows={rows as TypedRow[]}
						rowHeight={DEFAULT_ROW_HEIGHT_IN_PX}
						rowKeyGetter={rowKeyGetter}
						style={{ height: gridBodyHeight, blockSize: gridBodyHeight }}
					/>
				</div>
				<div className="typed-data-table__footer" style={{ height: RESULTS_COUNTER_HEIGHT_IN_PX }}>
					<span>{rowCount} results</span>
				</div>
			</div>
		</TableFocusProvider>
	);
}
