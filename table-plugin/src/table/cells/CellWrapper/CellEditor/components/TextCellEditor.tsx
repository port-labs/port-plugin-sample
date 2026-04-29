import { useCallback, useState } from 'react';

import { TextInput } from '../../../../shims/anchor-ui';
import { generateDataTestId } from '../../../../shims/dataTestId';
import type { InternalEditorProps, TextCellEditorProps } from '../types';

export default function TextCellEditor({
	value,
	onEdit,
	onExit,
	dataTestId,
}: Omit<TextCellEditorProps, 'editorType'> & InternalEditorProps) {
	const [currentValue, setCurrentValue] = useState(value ?? '');

	const handleOnChange = useCallback(
		(newValue: string): void => {
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
		[handleOnChange, currentValue, onExit],
	);

	return (
		<TextInput
			autoFocus
			aria-label="Text Input"
			dataTestId={generateDataTestId(dataTestId, 'TextCellEditor')}
			value={currentValue}
			onBlur={() => handleOnChange(currentValue)}
			onChange={(e) => setCurrentValue(e.target.value)}
			onKeyDown={onKeyDown}
		/>
	);
}
