import type { LabeledUrlValue } from './cells/editorTypes';
import type { EnumFieldColorMap } from './cells/enumLabel';
import type { DateFormat } from './shims/dateFormats';

export const COLUMN_CELL_TYPES = [
	'text',
	'number',
	'boolean',
	'dateTime',
	'dateTimeArray',
	'url',
	'labeledUrl',
	'multiUrl',
	'multiLabeledUrl',
	'array',
	'jsonArray',
	'json',
	'code',
	'markdown',
	'timer',
	'label',
	'enumArray',
	'invalid',
] as const;

type BaseTypedColumn = {
	key: string;
	name: string;
	width?: number;
	minWidth?: number;
	resizable?: boolean;
	sortable?: boolean;
	fieldTitle?: string;
};

export type TypedColumn =
	| (BaseTypedColumn & { type: 'text'; linkKey?: never })
	| (BaseTypedColumn & { type: 'number' })
	| (BaseTypedColumn & { type: 'boolean' })
	| (BaseTypedColumn & { type: 'dateTime'; dateFormat?: DateFormat })
	| (BaseTypedColumn & { type: 'dateTimeArray'; dateFormat?: DateFormat })
	| (BaseTypedColumn & { type: 'url' })
	| (BaseTypedColumn & { type: 'labeledUrl' })
	| (BaseTypedColumn & { type: 'multiUrl' })
	| (BaseTypedColumn & { type: 'multiLabeledUrl' })
	| (BaseTypedColumn & { type: 'array' })
	| (BaseTypedColumn & { type: 'jsonArray' })
	| (BaseTypedColumn & { type: 'json' })
	| (BaseTypedColumn & { type: 'code'; language?: 'yaml' | 'proto' | 'json' })
	| (BaseTypedColumn & { type: 'markdown' })
	| (BaseTypedColumn & { type: 'timer' })
	| (BaseTypedColumn & {
			type: 'label';
			color?: string;
			tooltip?: string;
	  })
	| (BaseTypedColumn & { type: 'enumArray'; colors?: EnumFieldColorMap; enumOptions?: (string | number)[] })
	| (BaseTypedColumn & { type: 'invalid' });

export type TypedRow = Record<string, unknown> & { id?: string };

export type ColumnCellType = TypedColumn['type'];
