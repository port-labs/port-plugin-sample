import { useCallback, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../shims/anchor-ui';
import { generateDataTestId } from '../../../../shims/dataTestId';
import type { CodeCellEditorProps, InternalEditorProps } from '../types';

export default function CodeCellEditor({
	dataTestId,
	value,
	language: _language,
	onExit,
	onEdit,
	fieldTitle,
	schema: _schema,
}: Omit<CodeCellEditorProps, 'editorType'> & InternalEditorProps) {
	const [draft, setDraft] = useState(value === 'null' ? '{}' : value);

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

	return (
		<Dialog dataTestId={generateDataTestId(dataTestId, 'CodeCellEditor')} onClose={onExit}>
			<DialogHeader>
				<DialogTitle>{fieldTitle}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				<textarea
					aria-label="Code editor"
					data-testid={generateDataTestId(dataTestId, 'CodeCellEditor', 'textarea')}
					style={{ width: '100%', minHeight: 240, fontFamily: 'monospace', fontSize: 12 }}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
				/>
				<div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
					<button type="button" onClick={onExit}>
						Cancel
					</button>
					<button type="button" onClick={() => handleOnChange(draft)}>
						Save
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
