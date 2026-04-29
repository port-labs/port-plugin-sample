import { Expand } from '../../shims/anchor-icons';
import { IconButton } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';

type ExpandCellButtonProps = {
	dataTestId?: string;
	onClick: () => void;
	contentLabel?: string;
};

export default function ExpandCellButton({ dataTestId, onClick, contentLabel }: ExpandCellButtonProps) {
	return (
		<IconButton
			aria-label={`Expand ${contentLabel ?? ''}`}
			dataTestId={generateDataTestId(dataTestId, 'ExpandCellButton')}
			ghost
			size="small"
			data-cell-action-button="true"
			onClick={onClick}
		>
			<Expand style={{ width: 16, height: 16 }} />
		</IconButton>
	);
}
