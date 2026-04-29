import { useCallback, useState } from 'react';

import { generateDataTestId } from '../../../../shims/dataTestId';
import type { InternalEditorProps, SelectCellEditorProps } from '../types';

export default function SelectCellEditor({
	value,
	options,
	onEdit,
	onExit,
	dataTestId,
}: Omit<SelectCellEditorProps<unknown>, 'editorType'> & InternalEditorProps) {
	const [currentValue, setCurrentValue] = useState(value);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent): void => {
			e.stopPropagation();

			if (e.key === 'Enter') {
				onEdit(currentValue);
			} else if (e.key === 'Escape') {
				onExit();
			}
		},
		[onExit, onEdit, currentValue],
	);

	return (
		<select
			aria-label="Select editor"
			autoFocus
			data-testid={generateDataTestId(dataTestId, 'SelectCellEditor')}
			style={{ minWidth: 200, padding: 8, borderRadius: 8 }}
			value={currentValue === undefined || currentValue === null ? '' : String(currentValue)}
			onBlur={onExit}
			onChange={(e) => {
				const raw = e.target.value;
				const opt = options.find((o) => String(o.value) === raw);
				setCurrentValue(opt?.value);
				onEdit(opt?.value);
			}}
			onKeyDown={onKeyDown}
		>
			<option value="">Clear</option>
			{options.map((o) => (
				<option key={String(o.value)} value={String(o.value)}>
					{o.label}
				</option>
			))}
		</select>
	);
}
