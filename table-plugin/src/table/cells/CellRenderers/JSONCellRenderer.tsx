import { memo, useMemo } from 'react';

import { Label } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import SimpleReadOnlyCodeDialog from '../SimpleReadOnlyCodeDialog';
import { EDITOR_TYPE } from '../editorTypes';

type JSONCellRendererProps<T = unknown> = {
	dataTestId?: string;
	value: T;
	fieldTitle: string;
	isCopyable?: boolean;
} & (
	| {
			isEditable: boolean;
			onChange?: (value: T) => void;
	  }
	| {
			isEditable?: never;
			onChange?: never;
	  }
);

function JSONCellRenderer<T>({
	value,
	dataTestId,
	fieldTitle,
	isEditable,
	isCopyable = true,
	onChange,
}: JSONCellRendererProps<T>) {
	const stringifiedValue = useMemo(() => JSON.stringify(value, null, 2), [value]);

	const editProps =
		isEditable && onChange
			? {
					isEditable: true as const,
					onEdit: (newValue: string) => {
						try {
							onChange(JSON.parse(newValue ?? '') as T);
						} catch {
							console.error('Could not update JSON value');
						}
					},
				}
			: { isEditable: false as const };

	return (
		<CellWrapper
			dataTestId={generateDataTestId(dataTestId, 'JSONCellRenderer')}
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<SimpleReadOnlyCodeDialog
						language="json"
						title={fieldTitle}
						value={JSON.stringify(value ?? {}, null, 2)}
						onClose={onClose}
					/>
				),
			}}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable && !!value}
			isExpandable={!!value}
			language="json"
			value={stringifiedValue}
			{...editProps}
		>
			<div className="plugin-truncate">{value && <Label>{stringifiedValue}</Label>}</div>
		</CellWrapper>
	);
}

export default memo(JSONCellRenderer);
