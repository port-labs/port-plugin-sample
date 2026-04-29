import { useCallback, useState } from 'react';

import { generateDataTestId } from '../../../../shims/dataTestId';
import type { BooleanCellEditorProps, InternalEditorProps } from '../types';

const OPTIONS = [
	{ label: 'True', value: 'true' },
	{ label: 'False', value: 'false' },
];

export default function BooleanCellEditor({
	value,
	onEdit,
	onExit,
	dataTestId,
}: Omit<BooleanCellEditorProps, 'editorType'> & InternalEditorProps) {
	const [currentValue, setCurrentValue] = useState(value);

	const handleOnChange = useCallback(
		(newValue: boolean | undefined): void => {
			if (value === newValue) {
				onExit();
			} else {
				onEdit(newValue);
			}
		},
		[onEdit, onExit, value],
	);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent): void => {
			e.stopPropagation();

			if (e.key === 'Enter') {
				handleOnChange(currentValue);
			} else if (e.key === 'Escape') {
				onExit();
			}
		},
		[currentValue, handleOnChange, onExit],
	);

	return (
		<select
			aria-label="Choose boolean value"
			autoFocus
			data-testid={generateDataTestId(dataTestId, 'BooleanCellEditor')}
			style={{ minWidth: 160, padding: 8, borderRadius: 8 }}
			value={currentValue === undefined ? '' : String(currentValue)}
			onBlur={onExit}
			onChange={(e) => {
				const v = e.target.value;
				if (v === '') {
					handleOnChange(undefined);
				} else {
					const optionValue = v.toLowerCase() === 'true';
					setCurrentValue(optionValue);
					handleOnChange(optionValue);
				}
			}}
			onKeyDown={onKeyDown}
		>
			<option value="">Clear</option>
			{OPTIONS.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
	);
}
