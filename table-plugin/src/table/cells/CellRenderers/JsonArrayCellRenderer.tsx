import { Label, OverflowList } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import SimpleReadOnlyCodeDialog from '../SimpleReadOnlyCodeDialog';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type JSONArrayCellRendererProps = {
	value: unknown[];
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value: unknown[]) => void;
	fieldTitle: string;
};

const JSONArrayCellRenderer = ({
	value,
	isEditable,
	isCopyable = true,
	onChange,
	fieldTitle,
}: JSONArrayCellRendererProps) => {
	if (value !== undefined && value !== null && !Array.isArray(value)) {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			isExpandable
			dataTestId="JSONArrayCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<SimpleReadOnlyCodeDialog
						language="json"
						title={fieldTitle}
						value={JSON.stringify(value ?? [], null, 2)}
						onClose={onClose}
					/>
				),
			}}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			language="json"
			value={JSON.stringify(value ?? [])}
			onEdit={(val) => onChange?.(JSON.parse(val) as unknown[])}
		>
			{value && (
				<OverflowList
					itemRenderer={(item, _, index) => <Label key={`${String(item)}-${index}`}>{JSON.stringify(item)}</Label>}
					items={value}
					overflowRenderer={(overflownItems) => <Label>{`+${overflownItems.length}`}</Label>}
				/>
			)}
		</CellWrapper>
	);
};

export default JSONArrayCellRenderer;
