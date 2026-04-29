import type { RenderCellProps } from '@port-labs/port-react-data-grid';
import type { ReactNode } from 'react';

import ArrayCellRenderer from './cells/CellRenderers/ArrayCellRenderer';
import BooleanCellRenderer from './cells/CellRenderers/BooleanCellRenderer';
import CodeCellRenderer from './cells/CellRenderers/CodeCellRenderer';
import DateTimeArrayCellRenderer from './cells/CellRenderers/DateTimeArrayCellRenderer';
import DateTimeCellRenderer from './cells/CellRenderers/DateTimeCellRenderer';
import EnumArrayCellRenderer from './cells/CellRenderers/EnumArrayCellRenderer';
import InvalidCellRenderer from './cells/CellRenderers/InvalidCellRenderer';
import JSONCellRenderer from './cells/CellRenderers/JSONCellRenderer';
import JSONArrayCellRenderer from './cells/CellRenderers/JsonArrayCellRenderer';
import LabelCellRenderer from './cells/CellRenderers/LabelCellRenderer';
import LabeledUrlCellRenderer from './cells/CellRenderers/LabeledUrlCellRenderer';
import MarkdownCellRenderer from './cells/CellRenderers/MarkdownCellRenderer';
import MultiLabeledUrlCellRenderer from './cells/CellRenderers/MultiLabeledUrlCellRenderer';
import MultiUrlCellRenderer from './cells/CellRenderers/MultiUrlCellRenderer';
import NumberCellRenderer from './cells/CellRenderers/NumberCellRenderer';
import TextCellRenderer from './cells/CellRenderers/TextCellRenderer';
import TimerCellRenderer from './cells/CellRenderers/TimerCellRenderer';
import UrlCellRenderer from './cells/CellRenderers/UrlCellRenderer';
import type { LabeledUrlValue } from './cells/editorTypes';
import type { TypedColumn, TypedRow } from './columnTypes';

/**
 * Domain-specific renderers from apps/frontend (UserCellRenderer, TeamsCellRenderer, etc.)
 * can be registered here once copied into table-plugin: extend `TypedColumn` with new
 * `type` variants and add a `case` below.
 */
export function renderTypedCell(column: TypedColumn, props: RenderCellProps<TypedRow>): ReactNode {
	const raw = props.row[column.key];
	const fieldTitle = column.fieldTitle ?? column.name;
	const isEditable = false;

	switch (column.type) {
		case 'text':
			return (
				<TextCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw === undefined || raw === null ? '' : String(raw)}
				/>
			);
		case 'number':
			return (
				<NumberCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw === undefined || raw === null ? undefined : (raw as string | number)}
				/>
			);
		case 'boolean':
			return (
				<BooleanCellRenderer fieldTitle={fieldTitle} isCopyable isEditable={isEditable} value={raw as boolean | undefined} />
			);
		case 'dateTime':
			return (
				<DateTimeCellRenderer
					dateFormat={column.dateFormat}
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw === undefined || raw === null ? null : String(raw)}
				/>
			);
		case 'dateTimeArray':
			return (
				<DateTimeArrayCellRenderer
					dateFormat={column.dateFormat}
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={Array.isArray(raw) ? (raw as string[]) : []}
				/>
			);
		case 'url':
			return (
				<UrlCellRenderer
					displayName={undefined}
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw === undefined || raw === null ? undefined : String(raw)}
				/>
			);
		case 'labeledUrl':
			return (
				<LabeledUrlCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw as LabeledUrlValue | undefined}
				/>
			);
		case 'multiUrl':
			return (
				<MultiUrlCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={Array.isArray(raw) ? (raw as string[]) : undefined}
				/>
			);
		case 'multiLabeledUrl':
			return (
				<MultiLabeledUrlCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={Array.isArray(raw) ? (raw as LabeledUrlValue[]) : undefined}
				/>
			);
		case 'array':
			return (
				<ArrayCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={Array.isArray(raw) ? raw : []}
				/>
			);
		case 'jsonArray':
			return (
				<JSONArrayCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={Array.isArray(raw) ? raw : []}
				/>
			);
		case 'json':
			return <JSONCellRenderer fieldTitle={fieldTitle} isCopyable isEditable={isEditable} value={raw} />;
		case 'code':
			return (
				<CodeCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					language={column.language}
					value={raw === undefined || raw === null ? undefined : String(raw)}
				/>
			);
		case 'markdown':
			return (
				<MarkdownCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw === undefined || raw === null ? undefined : String(raw)}
				/>
			);
		case 'timer':
			return (
				<TimerCellRenderer
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					value={raw === undefined || raw === null ? undefined : String(raw)}
				/>
			);
		case 'label':
			return (
				<LabelCellRenderer
					color={column.color}
					dataTestId="TypedTableLabel"
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={false}
					tooltip={column.tooltip}
					value={raw === undefined || raw === null ? undefined : String(raw)}
				/>
			);
		case 'enumArray':
			return (
				<EnumArrayCellRenderer
					colors={column.colors}
					fieldTitle={fieldTitle}
					isCopyable
					isEditable={isEditable}
					options={column.enumOptions}
					value={Array.isArray(raw) ? (raw as (string | number)[]) : undefined}
				/>
			);
		case 'invalid':
			return <InvalidCellRenderer value={raw} />;
		default:
			return <InvalidCellRenderer value={raw} />;
	}
}
