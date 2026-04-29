import { Dialog, DialogContent, DialogHeader, DialogTitle, Typography } from '../../../shims/anchor-ui';
import { generateDataTestId } from '../../../shims/dataTestId';

type TextDialogProps = {
	title?: string;
	value?: string;
	onClose: () => void;
};

export default function TextDialog({ title, value, onClose }: TextDialogProps) {
	return (
		<Dialog dataTestId={generateDataTestId('TextCellRenderer', 'TextDialog')} onClose={onClose}>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				<Typography as="div" variant="body2">
					{value}
				</Typography>
			</DialogContent>
		</Dialog>
	);
}
