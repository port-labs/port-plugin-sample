import { memo } from 'react';

import { Typography } from '../../shims/anchor-ui';
import { formatNumberValue } from '../../shims/formatNumber';
import CellWrapper from '../CellWrapper';
import { EDITOR_TYPE } from '../editorTypes';

type NumberCellRendererProps = {
	value?: string | number;
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value?: string) => void;
	fieldTitle?: string;
};

function NumberCellRenderer({ value, isEditable, isCopyable = true, onChange, fieldTitle }: NumberCellRendererProps) {
	return (
		<CellWrapper
			dataTestId="NumberCellRenderer"
			editorType={EDITOR_TYPE.TEXT}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			value={value?.toString()}
			onEdit={(val) => onChange?.(val)}
		>
			<Typography truncate dataTestId="NumberCellRenderer__Typography" variant="body2">
				{formatNumberValue(value)}
			</Typography>
		</CellWrapper>
	);
}

export default memo(NumberCellRenderer);
