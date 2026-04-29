import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';

import { generateDataTestId } from '../../../../shims/dataTestId';
import { dayjs } from '../../../../shims/dayjsSetup';
import type { DateTimeCellEditorProps, InternalEditorProps } from '../types';

const MIN_TIME_TO_PICK = '2000-01-01T00:00';

export default function DateTimeCellEditor({
	value,
	onEdit,
	onExit,
	dataTestId,
}: Omit<DateTimeCellEditorProps, 'editorType'> & InternalEditorProps) {
	const [currentValue, setCurrentValue] = useState(value);
	const isValueValid = useRef(true);

	const handleOnChange = useCallback((): void => {
		if (!isValueValid.current) {
			onExit();
		} else if (value === currentValue) {
			onExit();
		} else {
			onEdit(currentValue);
		}
	}, [currentValue, onEdit, onExit, value]);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>): void => {
			e.stopPropagation();
			isValueValid.current = e.currentTarget.validity.valid;

			if (e.key === 'Enter') {
				handleOnChange();
			} else if (e.key === 'Escape') {
				onExit();
			}
		},
		[handleOnChange, onExit],
	);

	return (
		<input
			autoFocus
			aria-label="Date picker"
			className={clsx('plugin-datetime-input')}
			data-testid={generateDataTestId(dataTestId, 'DateTimeCellEditor')}
			min={MIN_TIME_TO_PICK}
			type="datetime-local"
			value={currentValue && typeof currentValue === 'string' ? dayjs(currentValue).format('YYYY-MM-DDTHH:mm') : ''}
			onBlur={() => handleOnChange()}
			onChange={(e) => {
				const newValue = e.target.value === '' ? null : dayjs(e.target.value).toISOString();
				isValueValid.current = e.target.validity.valid;
				setCurrentValue(newValue);
			}}
			onKeyDown={onKeyDown}
		/>
	);
}
