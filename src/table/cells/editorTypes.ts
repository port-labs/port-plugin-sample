import type { ValueOf } from '../shims/commonTypes';

export const EDITOR_TYPE = {
	BOOLEAN: 'boolean',
	CODE: 'code',
	DATE_TIME: 'dateTime',
	MARKDOWN: 'markdown',
	MULTI_SELECT: 'multiSelect',
	SELECT: 'select',
	TEXT: 'text',
} as const;

export type EditorType = ValueOf<typeof EDITOR_TYPE>;

export type LabeledUrlValue = {
	url: string;
	displayText?: string;
};
