import { EDITOR_TYPE } from '../../editorTypes';
import BooleanCellEditor from './components/BooleanCellEditor';
import CodeCellEditor from './components/CodeCellEditor';
import DateTimeCellEditor from './components/DateTimeCellEditor';
import MarkdownCellEditorModal from './components/MarkdownCellEditorModal';
import MultiSelectCellEditor from './components/MultiSelectCellEditor';
import SelectCellEditor from './components/SelectCellEditor';
import TextCellEditor from './components/TextCellEditor';
import type { CellWrapperEditorProps, InternalEditorProps } from './types';

function handleUnexpectedEditorType(editorProps: never): never {
	const editorData = (editorProps as { editorType: string })?.editorType || editorProps;

	throw new Error(`Unexpected editor type: ${String(editorData)}`);
}

type CellEditorProps = CellWrapperEditorProps & InternalEditorProps;

function CellEditor(props: CellEditorProps) {
	switch (props.editorType) {
		case EDITOR_TYPE.BOOLEAN: {
			return (
				<BooleanCellEditor
					dataTestId={props.dataTestId}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
				/>
			);
		}
		case EDITOR_TYPE.CODE:
			return (
				<CodeCellEditor
					dataTestId={props.dataTestId}
					fieldTitle={props.fieldTitle}
					language={props.language}
					schema={props.schema}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
				/>
			);
		case EDITOR_TYPE.MARKDOWN:
			return (
				<MarkdownCellEditorModal
					dataTestId={props.dataTestId}
					fieldTitle={props.fieldTitle}
					hasUpdatePermissions={props.hasUpdatePermissions}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
				/>
			);
		case EDITOR_TYPE.SELECT:
			return (
				<SelectCellEditor
					dataTestId={props.dataTestId}
					options={props.options}
					optionsVariant={props.optionsVariant}
					tagMode={props.tagMode}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
					onSearchOptionChange={props.onSearchOptionChange}
				/>
			);
		case EDITOR_TYPE.MULTI_SELECT:
			return (
				<MultiSelectCellEditor
					dataTestId={props.dataTestId}
					items={props.items}
					options={props.options}
					tagMode={props.tagMode}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
					onSearchOptionChange={props.onSearchOptionChange}
				/>
			);
		case EDITOR_TYPE.TEXT:
			return (
				<TextCellEditor
					dataTestId={props.dataTestId}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
				/>
			);
		case EDITOR_TYPE.DATE_TIME:
			return (
				<DateTimeCellEditor
					dataTestId={props.dataTestId}
					value={props.value}
					onEdit={(v) => {
						props.onEdit(v);
						props.onExit();
					}}
					onExit={props.onExit}
				/>
			);
		default:
			return handleUnexpectedEditorType(props);
	}
}

export default CellEditor;
