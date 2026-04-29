import clsx from 'clsx';
import React, { type ForwardedRef, useEffect, useState } from 'react';

import { Check, Copy } from '../shims/anchor-icons';
import { IconButton, type IconButtonSize } from '../shims/anchor-ui';
import { generateDataTestId } from '../shims/dataTestId';
import useAccessibilityAnnouncer from './useAccessibilityAnnouncer';

const COPY_TIMEOUT_MS = 2000;
const COPIED_MESSAGE = 'Copied to clipboard';

interface CopyButtonProps {
	value: string;
	dataTestId?: string;
	onClick?: () => void;
	size?: IconButtonSize;
	className?: string;
	delayHover?: boolean;
	icon?: React.ElementType;
	onVisibilityChanged?: (isVisible: boolean) => void;
	contentLabel?: string;
	disabled?: boolean;
	ariaLabel?: string;
}

function CopyButton(
	{
		value,
		onClick,
		size,
		dataTestId,
		className,
		delayHover = true,
		icon: Icon = Copy,
		onVisibilityChanged,
		contentLabel,
		disabled,
		ariaLabel,
		...rest
	}: CopyButtonProps,
	ref: ForwardedRef<HTMLButtonElement>,
) {
	const [isCopied, setIsCopied] = useState(false);
	const { announce } = useAccessibilityAnnouncer();

	useEffect(() => {
		if (isCopied) {
			announce(COPIED_MESSAGE);
			const timeout = setTimeout(() => {
				setIsCopied(false);
			}, COPY_TIMEOUT_MS);

			return () => clearTimeout(timeout);
		}
		return undefined;
	}, [isCopied, announce]);

	useEffect(() => {
		onVisibilityChanged?.(isCopied);
	}, [isCopied, onVisibilityChanged]);

	return (
		<IconButton
			ref={ref}
			aria-label={ariaLabel || `Copy ${contentLabel ?? ''} value`}
			ghost
			className={clsx(className, isCopied && 'plugin-copy-btn--copied')}
			data-cell-action-button="true"
			dataTestId={generateDataTestId(dataTestId, 'CopyButton', isCopied ? 'CheckIcon' : 'CopyIcon')}
			disabled={disabled}
			size={size}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				if (navigator?.clipboard) {
					void navigator.clipboard.writeText(value);
					setIsCopied(true);
				}
				onClick?.();
			}}
			{...rest}
		>
			<div className="plugin-copy-btn-icon-stack">
				<Icon
					aria-hidden={isCopied}
					aria-label="Copy icon"
					className={clsx(
						'plugin-copy-btn-icon-stack__icon',
						delayHover && 'plugin-copy-btn-icon-stack__icon--animated',
						isCopied ? 'plugin-copy-btn-icon-stack__icon--hide' : 'plugin-copy-btn-icon-stack__icon--show',
					)}
					focusable="false"
				/>
				<Check
					aria-hidden={!isCopied}
					aria-label="Check icon"
					className={clsx(
						'plugin-copy-btn-icon-stack__icon',
						'plugin-copy-btn-icon-stack__icon--check',
						delayHover && 'plugin-copy-btn-icon-stack__icon--animated',
						isCopied ? 'plugin-copy-btn-icon-stack__icon--show' : 'plugin-copy-btn-icon-stack__icon--hide',
					)}
					focusable="false"
				/>
			</div>
		</IconButton>
	);
}

export default React.forwardRef(CopyButton);
