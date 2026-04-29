import type { ValueOf, Writeable } from '../../../shims/commonTypes';
import { EDITOR_TYPE, type EditorType } from '../../editorTypes';
import type { EnumFieldColorMap } from '../../enumLabel';
import type { SelectOption } from '../../uiComponentsTypes';

export type ArrayItems = {
	enum?: (string | number)[];
	enumColors?: EnumFieldColorMap;
	type: string;
};

export type InternalEditorProps = {
	onExit: () => void;
};

interface EditorProps<T> {
	value: T;
	onEdit: (newValue: T) => void;
	dataTestId?: string;
}

export type BooleanCellEditorProps = EditorProps<boolean | undefined> & {
	editorType: typeof EDITOR_TYPE.BOOLEAN;
};

export type CodeCellEditorProps = EditorProps<string> & {
	editorType: typeof EDITOR_TYPE.CODE;
	language: 'yaml' | 'proto' | 'json';
	fieldTitle: string;
	schema?: object;
};

export type MarkdownCellEditorProps = EditorProps<string | null> & {
	editorType: typeof EDITOR_TYPE.MARKDOWN;
	hasUpdatePermissions: boolean;
	fieldTitle: string;
};

export type SelectCellEditorProps<T> = EditorProps<T | undefined | null> & {
	editorType: typeof EDITOR_TYPE.SELECT;
	options: SelectOption<T>[];
	optionsVariant?: 'team';
	isLoadingOptions?: boolean;
	tagMode?: boolean;
	onSearchOptionChange?: (searchValue: string) => void;
};

export type MultiSelectCellEditorProps<T extends SelectOption<unknown>[]> = EditorProps<T> & {
	editorType: typeof EDITOR_TYPE.MULTI_SELECT;
	options: T;
	tagMode?: boolean;
	items?: ArrayItems;
	onSearchOptionChange?: (searchValue: string) => void;
};

export type DateTimeCellEditorProps = EditorProps<string | null> & {
	editorType: typeof EDITOR_TYPE.DATE_TIME;
};

export type TextCellEditorProps = EditorProps<string | undefined> & {
	editorType: typeof EDITOR_TYPE.TEXT;
};

type BaseCellEditorProps =
	| BooleanCellEditorProps
	| CodeCellEditorProps
	| MarkdownCellEditorProps
	| SelectCellEditorProps<unknown>
	| MultiSelectCellEditorProps<SelectOption<unknown>[]>
	| TextCellEditorProps
	| DateTimeCellEditorProps;

export type CellWrapperEditorProps =
	| { editorType: Exclude<ValueOf<typeof EDITOR_TYPE>, BaseCellEditorProps['editorType']> }
	| BaseCellEditorProps;

/** Optional editor fields for CellWrapper callers (avoids Partial<union> losing branch-specific keys). */
export type CellWrapperEditorPassthrough = Partial<{
	editorType: EditorType;
	language: CodeCellEditorProps['language'];
	fieldTitle: string;
	schema: object;
	hasUpdatePermissions: boolean;
	options: SelectOption<unknown>[];
	optionsVariant: 'team';
	isLoadingOptions: boolean;
	tagMode: boolean;
	items: ArrayItems;
	onSearchOptionChange: (searchValue: string) => void;
}>;

export type { Writeable };
