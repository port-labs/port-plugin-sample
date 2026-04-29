import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../shims/anchor-ui';
import { generateDataTestId } from '../../../../shims/dataTestId';
import type { InternalEditorProps, MarkdownCellEditorProps } from '../types';

export default function MarkdownCellEditorModal({
	value,
	hasUpdatePermissions,
	fieldTitle,
	onEdit,
	onExit,
	dataTestId,
}: Omit<MarkdownCellEditorProps, 'editorType'> & InternalEditorProps) {
	const [draft, setDraft] = useState(value ?? '');

	const onSave = () => {
		if (draft === value) {
			onExit();
		} else if (!draft) {
			onEdit(null);
		} else {
			onEdit(draft);
		}
	};

	return (
		<Dialog dataTestId={generateDataTestId(dataTestId, 'MarkdownCellEditor')} onClose={onExit}>
			<DialogHeader>
				<DialogTitle>{fieldTitle}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				{hasUpdatePermissions ? (
					<textarea
						aria-label="Markdown editor"
						data-testid={generateDataTestId(dataTestId, 'MarkdownCellEditor', 'textarea')}
						style={{ width: '100%', minHeight: 200, fontFamily: 'inherit', fontSize: 14 }}
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
					/>
				) : (
					<pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{value}</pre>
				)}
				<div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
					<button type="button" onClick={onExit}>
						Close
					</button>
					{hasUpdatePermissions && (
						<button type="button" onClick={onSave}>
							Save
						</button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
