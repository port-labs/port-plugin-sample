import clsx from 'clsx';
import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	type CSSProperties,
	type ForwardedRef,
	Fragment,
	type HTMLAttributes,
	type ReactNode,
	createElement,
	forwardRef,
	useId,
	useState,
} from 'react';

export type LabelColor = string;

const labelStyle = (color?: LabelColor): CSSProperties => {
	const map: Record<string, string> = {
		grey: 'var(--text-medium, #64748b)',
		blue: '#1d4ed8',
		turquoise: '#0d9488',
		orange: '#ea580c',
		purple: '#7c3aed',
		pink: '#db2777',
		yellow: '#ca8a04',
		green: '#16a34a',
		red: '#dc2626',
		gold: '#b45309',
		silver: '#64748b',
		bronze: '#92400e',
		oceanBlue: '#0369a1',
		lime: '#65a30d',
		olive: '#57534e',
		brown: '#78350f',
	};
	const c = color && map[color] ? map[color] : map.grey;
	return {
		display: 'inline-block',
		padding: '2px 8px',
		borderRadius: 6,
		fontSize: 12,
		fontWeight: 500,
		background: `color-mix(in srgb, ${c} 18%, transparent)`,
		color: c,
	};
};

export function Label({
	children,
	className,
	color,
	dataTestId,
	leftElement,
	rightElement,
	disabledTooltip: _disabledTooltip,
	...rest
}: HTMLAttributes<HTMLSpanElement> & {
	color?: LabelColor;
	dataTestId?: string;
	leftElement?: ReactNode;
	rightElement?: ReactNode;
	disabledTooltip?: boolean;
}) {
	return (
		<span
			className={clsx('plugin-label', className)}
			data-testid={dataTestId}
			style={{ ...labelStyle(color), display: 'inline-flex', alignItems: 'center', gap: 6 }}
			{...rest}
		>
			{leftElement}
			{children}
			{rightElement}
		</span>
	);
}

export function Tooltip({ children, tip, dataTestId }: { children: ReactNode; tip?: ReactNode; dataTestId?: string }) {
	const [open, setOpen] = useState(false);
	if (!tip) return <Fragment>{children}</Fragment>;
	return (
		<span
			className="plugin-tooltip-wrap"
			data-testid={dataTestId}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			{children}
			{open && (
				<span className="plugin-tooltip-tip" role="tooltip">
					{tip}
				</span>
			)}
		</span>
	);
}

export function Typography({
	children,
	className,
	variant: _variant,
	truncate,
	as: Component = 'span',
	disabledTooltip: _disabledTooltip,
	dataTestId,
	...rest
}: HTMLAttributes<HTMLElement> & {
	variant?: string;
	truncate?: boolean;
	as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
	disabledTooltip?: boolean;
	dataTestId?: string;
}) {
	return createElement(
		Component,
		{
			className: clsx(className, truncate && 'plugin-truncate'),
			'data-testid': dataTestId,
			...rest,
		},
		children,
	);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	to?: string;
};

export const Link = forwardRef(function Link(
	{ to, href, className, children, ...rest }: LinkProps,
	ref: ForwardedRef<HTMLAnchorElement>,
) {
	const dest = href ?? to ?? '#';
	return (
		<a ref={ref} className={clsx('plugin-link', className)} href={dest} {...rest}>
			{children}
		</a>
	);
});

export type IconButtonSize = 'small' | 'medium';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	dataTestId?: string;
	size?: IconButtonSize;
	/** Table cell actions: no chrome; hover uses dim background (matches Port grid). */
	ghost?: boolean;
};

export const IconButton = forwardRef(function IconButton(
	{ children, className, dataTestId, size = 'medium', type = 'button', ghost = false, ...rest }: IconButtonProps,
	ref: ForwardedRef<HTMLButtonElement>,
) {
	const pad = size === 'small' ? 4 : 8;
	return (
		<button
			ref={ref}
			type={type}
			className={clsx('plugin-icon-button', ghost && 'plugin-icon-button--ghost', className)}
			data-testid={dataTestId}
			style={{
				padding: pad,
				borderRadius: 8,
				...(ghost
					? { border: 'none', background: 'transparent', boxShadow: 'none' }
					: { border: '1px solid var(--border-low, #e2e8f0)', background: 'var(--background-primary, #fff)' }),
			}}
			{...rest}
		>
			{children}
		</button>
	);
});

type DialogProps = {
	children: ReactNode;
	onClose?: (reason?: string) => void;
	dataTestId?: string;
	size?: 'small';
	fullHeight?: boolean;
};

export function Dialog({ children, onClose, dataTestId, fullHeight }: DialogProps) {
	return (
		<div
			className="plugin-dialog-backdrop"
			role="presentation"
			onClick={() => onClose?.('backdrop')}
			onKeyDown={(e) => {
				if (e.key === 'Escape') onClose?.('escape');
			}}
		>
			<div
				className={clsx('plugin-dialog', fullHeight && 'plugin-dialog--tall')}
				data-testid={dataTestId}
				role="dialog"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}

export function DialogHeader({ children }: { children: ReactNode }) {
	return <div className="plugin-dialog-header">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
	return <h2 className="plugin-dialog-title">{children}</h2>;
}

export function DialogContent({
	children,
	className,
	noPadding: _noPadding,
	variant: _variant,
}: {
	children: ReactNode;
	className?: string;
	noPadding?: boolean;
	variant?: string;
}) {
	return <div className={clsx('plugin-dialog-content', className)}>{children}</div>;
}

export function TextInput({
	value,
	onChange,
	onBlur,
	onKeyDown,
	autoFocus,
	fullWidth: _fullWidth,
	className,
	dataTestId,
	'aria-label': ariaLabel,
}: {
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: () => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	autoFocus?: boolean;
	fullWidth?: boolean;
	className?: string;
	dataTestId?: string;
	'aria-label'?: string;
}) {
	const id = useId();
	return (
		<input
			id={id}
			autoFocus={autoFocus}
			aria-label={ariaLabel}
			className={clsx('plugin-text-input', className)}
			data-testid={dataTestId}
			type="text"
			value={value}
			onBlur={onBlur}
			onChange={onChange}
			onKeyDown={onKeyDown}
		/>
	);
}

export function Counter({ value, dataTestId }: { value: number; dataTestId?: string }) {
	return (
		<span className="plugin-counter" data-testid={dataTestId ? `${dataTestId}__Counter` : undefined}>
			{value}
		</span>
	);
}

type OverflowListProps<T> = {
	items: readonly T[];
	itemRenderer: (item: T, _unused: unknown, index: number) => ReactNode;
	overflowRenderer: (overflown: readonly T[]) => ReactNode;
	className?: string;
	maxVisible?: number;
};

export function OverflowList<T extends unknown>({
	items,
	itemRenderer,
	overflowRenderer,
	className,
	maxVisible = 3,
}: OverflowListProps<T>) {
	if (!items.length) return null;
	const visible = items.slice(0, maxVisible);
	const overflown = items.slice(maxVisible);
	return (
		<div
			className={clsx('plugin-overflow-list', className)}
			style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}
		>
			{visible.map((item, index) => (
				<span key={index}>{itemRenderer(item, undefined, index)}</span>
			))}
			{overflown.length > 0 ? overflowRenderer(overflown) : null}
		</div>
	);
}
