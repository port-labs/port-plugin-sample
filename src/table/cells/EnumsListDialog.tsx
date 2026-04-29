import { EmptyBox } from '../shims/anchor-icons';
import { Counter, Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '../shims/anchor-ui';
import { generateDataTestId } from '../shims/dataTestId';
import NoResults from './NoResults';
import type { EnumFieldColorMap } from './enumLabel';
import { getLabelColor } from './enumLabel';

interface EnumsListDialogProps {
	values?: (string | number)[];
	colors?: EnumFieldColorMap;
	onClose?: () => void;
	title?: string;
}

export function EnumsListDialog({ values, colors, onClose, title }: EnumsListDialogProps) {
	return (
		<Dialog dataTestId="EnumsListDialog" size="small" onClose={onClose}>
			<DialogHeader>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<DialogTitle>{title || 'Enums'}</DialogTitle>
					<Counter dataTestId="EnumsListDialog" value={values?.length ?? 0} />
				</div>
			</DialogHeader>
			<DialogContent>
				{!values || values.length === 0 ? (
					<NoResults>
						<EmptyBox style={{ width: 48, height: 48, opacity: 0.5 }} />
						<div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
							<NoResults.Title>No enums found</NoResults.Title>
							<NoResults.Text>There are no enum values to display</NoResults.Text>
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
							<Label
								key={value}
								color={getLabelColor(value, colors)}
								dataTestId={generateDataTestId('EnumsListDialog', `EnumItem-${value}`)}
							>
								{value}
							</Label>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
