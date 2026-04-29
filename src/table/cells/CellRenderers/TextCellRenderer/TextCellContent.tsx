import { forwardRef } from 'react';

import { Link, Typography } from '../../../shims/anchor-ui';
import { generateDataTestId } from '../../../shims/dataTestId';

interface TextCellContentProps {
	value?: string;
	icon?: React.ElementType | null;
	link?: string;
	onUrlClick?: () => void;
}

const TextCellContent = forwardRef<HTMLDivElement | HTMLAnchorElement, TextCellContentProps>(
	({ value, icon: Icon, link, onUrlClick }, ref) => {
		return link ? (
			<Link
				ref={ref as React.Ref<HTMLAnchorElement>}
				className="plugin-text-cell-link"
				data-testid={generateDataTestId('TextCellRenderer', value, 'Link')}
				href={link}
				onClick={onUrlClick}
			>
				{Icon && <Icon className="plugin-cell-icon" />}

				<Typography truncate dataTestId={generateDataTestId('TextCellRenderer', value, 'Typography')} variant="h5">
					{value}
				</Typography>
			</Link>
		) : (
			<div
				ref={ref as React.Ref<HTMLDivElement>}
				style={{ display: 'flex', alignItems: 'center', gap: 8 }}
				className="plugin-truncate"
			>
				{Icon && <Icon className="plugin-cell-icon" />}
				<Typography truncate dataTestId={generateDataTestId('TextCellRenderer', value, 'Typography')} variant="h5">
					{value}
				</Typography>
			</div>
		);
	},
);

TextCellContent.displayName = 'TextCellContent';

export default TextCellContent;
