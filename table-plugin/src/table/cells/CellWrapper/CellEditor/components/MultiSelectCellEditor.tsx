import { useState } from 'react';

import type { Writeable } from '../../../../shims/commonTypes';
import { generateDataTestId } from '../../../../shims/dataTestId';
import type { SelectOption } from '../../../uiComponentsTypes';
import type { InternalEditorProps, MultiSelectCellEditorProps } from '../types';

function sameSelection(a: SelectOption<unknown>[], b: SelectOption<unknown>[]): boolean {
	if (a.length !== b.length) return false;
	const av = [...a]
		.map((x) => String(x.value))
		.sort()
		.join('|');
	const bv = [...b]
		.map((x) => String(x.value))
		.sort()
		.join('|');
	return av === bv;
}

type MultiSelectValue = SelectOption<unknown>[];

export default function MultiSelectCellEditor({
	value,
	options,
	onEdit,
	dataTestId,
	onExit,
}: Omit<MultiSelectCellEditorProps<MultiSelectValue>, 'editorType'> & InternalEditorProps) {
	const [currentValue, setCurrentValue] = useState<MultiSelectValue>(value);

	const toggle = (opt: SelectOption<unknown>) => {
		const exists = currentValue.some((v) => String(v.value) === String(opt.value));
		let next: SelectOption<unknown>[];
		if (exists) {
			next = currentValue.filter((v) => String(v.value) !== String(opt.value));
		} else {
			next = [...currentValue, opt];
		}
		setCurrentValue(next as Writeable<MultiSelectValue>);
	};

	return (
		<div
			aria-label="Choose editor"
			data-testid={generateDataTestId(dataTestId, 'MultiSelectCellEditor')}
			style={{ padding: 8, background: 'var(--background-primary, #fff)', borderRadius: 8, minWidth: 220 }}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node)) {
					if (!sameSelection(value, currentValue)) {
						onEdit(currentValue);
					}
					onExit();
				}
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflow: 'auto' }}>
				{options.map((opt) => (
					<label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<input
							checked={currentValue.some((v) => String(v.value) === String(opt.value))}
							type="checkbox"
							onChange={() => toggle(opt)}
						/>
						<span>{opt.label}</span>
					</label>
				))}
			</div>
			<button style={{ marginTop: 8 }} type="button" onClick={() => onExit()}>
				Done
			</button>
		</div>
	);
}
