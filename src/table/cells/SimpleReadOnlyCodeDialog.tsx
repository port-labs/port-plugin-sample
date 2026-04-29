import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../shims/anchor-ui';
import { generateDataTestId } from '../shims/dataTestId';

type SimpleReadOnlyCodeDialogProps = {
	dataTestId?: string;
	onClose: (reason?: string) => void;
	title: string;
	value: string;
	language?: 'json' | 'yaml' | 'proto';
	isLoading?: boolean;
};

export default function SimpleReadOnlyCodeDialog({
	onClose,
	dataTestId,
	title,
	value,
	isLoading = false,
}: SimpleReadOnlyCodeDialogProps) {
	return (
		<Dialog fullHeight dataTestId={generateDataTestId(dataTestId, 'ReadOnlyCodeDialog')} onClose={onClose}>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				{isLoading ? (
					<p>Loading…</p>
				) : (
					<pre
						data-testid={generateDataTestId(dataTestId, 'ReadOnlyCodeDialog', 'MonacoEditor')}
						style={{
							margin: 0,
							padding: 12,
							maxHeight: '60vh',
							overflow: 'auto',
							fontSize: 12,
							fontFamily: 'ui-monospace, monospace',
							background: 'var(--background-dim, #f1f5f9)',
							borderRadius: 8,
						}}
					>
						{value}
					</pre>
				)}
			</DialogContent>
		</Dialog>
	);
}
