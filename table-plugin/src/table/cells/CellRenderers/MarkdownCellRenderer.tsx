import { memo } from 'react';

import { Label } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';
import CellWrapper from '../CellWrapper';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type MarkdownCellRendererProps = {
	value?: string;
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value?: string) => void;
	fieldTitle?: string;
};

const MarkdownCellRenderer = ({ value, isEditable, isCopyable = true, onChange, fieldTitle }: MarkdownCellRendererProps) => {
	if (value && typeof value !== 'string') {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			dataTestId="MarkdownCellRenderer"
			editorType={EDITOR_TYPE.MARKDOWN}
			fieldTitle={fieldTitle || 'Markdown'}
			hasUpdatePermissions={isEditable}
			isCopyable={isCopyable}
			isEditable={isEditable}
			value={value || ''}
			onEdit={(val) => onChange?.(val || undefined)}
		>
			{value && (
				<Label className="plugin-truncate" dataTestId={generateDataTestId('MarkdownCellRenderer', 'Label')}>
					{value}
				</Label>
			)}
		</CellWrapper>
	);
};

export default memo(MarkdownCellRenderer);
