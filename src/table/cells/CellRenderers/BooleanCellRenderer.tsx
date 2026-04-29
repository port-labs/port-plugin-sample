import { memo } from 'react';

import { Label } from '../../shims/anchor-ui';
import CellWrapper from '../CellWrapper';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type BooleanCellRendererProps = {
	value: boolean | undefined;
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value: boolean | undefined) => void;
	fieldTitle?: string;
};

function BooleanCellRenderer({ value, isEditable, isCopyable = true, onChange, fieldTitle }: BooleanCellRendererProps) {
	if (value !== undefined && typeof value !== 'boolean') {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			dataTestId="BooleanCellRenderer"
			editorType={EDITOR_TYPE.BOOLEAN}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable && value !== undefined}
			isEditable={!!isEditable}
			value={value}
			onEdit={(val) => onChange?.(val)}
		>
			{value !== undefined && value !== null && (
				<Label className="plugin-capitalize" color={value ? 'turquoise' : 'grey'}>
					{value.toString()}
				</Label>
			)}
		</CellWrapper>
	);
}

export default memo(BooleanCellRenderer);
