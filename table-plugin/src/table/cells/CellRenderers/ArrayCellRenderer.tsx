import { Label, OverflowList } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import { LabelListDialog } from '../LabelListDialog';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type ArrayCellRendererProps = {
	value: unknown[];
	fieldTitle: string;
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value: unknown[]) => void;
};

const ArrayCellRenderer = ({ value, isEditable, isCopyable = true, onChange, fieldTitle }: ArrayCellRendererProps) => {
	if (value !== undefined && value !== null && !Array.isArray(value)) {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			isExpandable
			dataTestId="ArrayCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => {
					const dialogValues = (value ?? []).map((item) =>
						typeof item === 'string' ? item : (JSON.stringify(item) ?? String(item)),
					);
					return <LabelListDialog title={fieldTitle} values={dialogValues} onClose={onClose} />;
				},
			}}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			language="json"
			value={JSON.stringify(value ?? [])}
			onEdit={(val) => {
				try {
					onChange?.(JSON.parse(val) as unknown[]);
				} catch {
					onChange?.([]);
				}
			}}
		>
			{value && (
				<OverflowList
					itemRenderer={(item, _, index) => (
						<Label key={`${String(item)}-${index}`}>{typeof item === 'string' ? item : JSON.stringify(item)}</Label>
					)}
					items={value}
					overflowRenderer={(overflownItems) => <Label>{`+${overflownItems.length}`}</Label>}
				/>
			)}
		</CellWrapper>
	);
};

export default ArrayCellRenderer;
