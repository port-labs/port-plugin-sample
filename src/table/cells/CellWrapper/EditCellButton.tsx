import { Edit } from '../../shims/anchor-icons';
import { IconButton } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';

type EditCellButtonProps = {
	dataTestId?: string;
	onClick: () => void;
	contentLabel?: string;
};

export default function EditCellButton({ dataTestId, onClick, contentLabel }: EditCellButtonProps) {
	return (
		<IconButton
			aria-label={`Edit ${contentLabel ?? ''}`}
			dataTestId={generateDataTestId(dataTestId, 'EditCellButton')}
			ghost
			size="small"
			data-cell-action-button="true"
			onClick={onClick}
		>
			<Edit style={{ width: 16, height: 16 }} />
		</IconButton>
	);
}
