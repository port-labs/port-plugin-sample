import clsx from 'clsx';
import { forwardRef, memo } from 'react';

import { Swagger } from '../shims/anchor-icons';
import { Tooltip, Typography } from '../shims/anchor-ui';
import { getLinkAttributes } from './linkUtils';

const API_PROPERTY_SPECS = {
	'open-api': 'open-api',
	'embedded-url': 'embedded-url',
	'async-api': 'async-api',
} as const;

type UrlButtonProps = {
	url: string;
	spec?: keyof typeof API_PROPERTY_SPECS;
	onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
	displayName?: string;
};

const UrlButton = forwardRef<HTMLAnchorElement, UrlButtonProps>(({ url, spec, onClick, displayName }, ref) => {
	const Icon = spec === API_PROPERTY_SPECS['open-api'] ? Swagger : null;
	const linkAttributes = getLinkAttributes(url);
	const tooltipText = url;
	const buttonLabel = displayName ?? null;

	return (
		<Tooltip tip={tooltipText}>
			<a
				ref={ref}
				aria-label={tooltipText}
				className={clsx('plugin-url-button')}
				data-testid="UrlButton"
				href={url}
				rel={linkAttributes.rel}
				target={linkAttributes.target}
				onClick={(e) => {
					onClick?.(e);
				}}
			>
				{Icon && <Icon className="plugin-cell-icon" />}
				{buttonLabel && (
					<Typography disabledTooltip truncate className="plugin-url-button-label" variant="body2">
						{buttonLabel}
					</Typography>
				)}
			</a>
		</Tooltip>
	);
});

UrlButton.displayName = 'UrlButton';
export default memo(UrlButton);
