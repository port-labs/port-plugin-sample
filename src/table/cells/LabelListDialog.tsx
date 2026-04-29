import { EmptyBox } from '../shims/anchor-icons';
import { Counter, Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '../shims/anchor-ui';
import { generateDataTestId } from '../shims/dataTestId';
import NoResults from './NoResults';

interface LabelListDialogProps {
	values?: string[];
	onClose?: () => void;
	title?: string;
}

export function LabelListDialog({ values, onClose, title }: LabelListDialogProps) {
	return (
		<Dialog dataTestId="LabelListDialog" size="small" onClose={onClose}>
			<DialogHeader>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<DialogTitle>{title || 'Labels'}</DialogTitle>
					<Counter dataTestId="LabelListDialog" value={values?.length ?? 0} />
				</div>
			</DialogHeader>
			<DialogContent>
				{!values || values.length === 0 ? (
					<NoResults>
						<EmptyBox style={{ width: 48, height: 48, opacity: 0.5 }} />
						<div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
							<NoResults.Title>No items found</NoResults.Title>
							<NoResults.Text>There are no items to display</NoResults.Text>
						</div>
					</NoResults>
				) : (
					<div
						style={{
							display: 'flex',
							maxHeight: 200,
							width: '100%',
							flexWrap: 'wrap',
							gap: 8,
							overflowY: 'auto',
							padding: 8,
						}}
					>
						{values.map((value) => (
							<Label key={value} dataTestId={generateDataTestId('LabelListDialog', `LabelItem-${value}`)}>
								{value}
							</Label>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
