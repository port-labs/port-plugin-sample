import { memo } from 'react';

import { Label } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import SimpleReadOnlyCodeDialog from '../SimpleReadOnlyCodeDialog';
import { EDITOR_TYPE } from '../editorTypes';

type CodeCellRendererProps = {
	value?: string;
	language?: 'yaml' | 'proto' | 'json';
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value?: string) => void;
	fieldTitle?: string;
	schema?: object;
};

function CodeCellRenderer({
	value,
	language,
	isEditable,
	isCopyable = true,
	onChange,
	fieldTitle,
	schema,
}: CodeCellRendererProps) {
	return (
		<CellWrapper
			dataTestId="CodeCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<SimpleReadOnlyCodeDialog
						language={language ?? 'yaml'}
						title={fieldTitle || 'Code'}
						value={value ?? ''}
						onClose={onClose}
					/>
				),
			}}
			fieldTitle={fieldTitle || 'Code'}
			isCopyable={isCopyable && value !== undefined}
			isEditable={isEditable}
			isExpandable={!!value}
			language={language ?? 'yaml'}
			schema={schema}
			value={value ?? ''}
			onEdit={(val) => onChange?.(val)}
		>
			{!!value?.length && (
				<Label disabledTooltip className="plugin-capitalize">
					{value}
				</Label>
			)}
		</CellWrapper>
	);
}

export default memo(CodeCellRenderer);
