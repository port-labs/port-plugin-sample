import { generateDataTestId } from '../../../shims/dataTestId';
import { EXPANDER_TYPE } from '../../CellExpander/types';
import CellWrapper from '../../CellWrapper';
import { EDITOR_TYPE } from '../../editorTypes';
import TextCellContent from './TextCellContent';
import TextDialog from './TextDialog';

type TextCellRendererProps = {
	value?: string;
	icon?: React.ElementType | null;
	link?: string;
	isEditable?: boolean;
	isCopyable?: boolean;
	onChange?: (value?: string) => void;
	onUrlClick?: () => void;
	fieldTitle?: string;
};

function TextCellRenderer({
	isEditable = false,
	icon,
	link,
	onChange,
	onUrlClick,
	value,
	isCopyable = true,
	fieldTitle,
}: TextCellRendererProps) {
	return (
		<CellWrapper
			dataTestId={generateDataTestId('TextCellRenderer', value)}
			editorType={EDITOR_TYPE.TEXT}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => <TextDialog title={fieldTitle} value={value} onClose={onClose} />,
			}}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			isExpandable={(value?.length ?? 0) > 50}
			value={value}
			onEdit={(val) => onChange?.(val)}
		>
			<TextCellContent icon={icon} link={link} value={value} onUrlClick={onUrlClick} />
		</CellWrapper>
	);
}

export default TextCellRenderer;
