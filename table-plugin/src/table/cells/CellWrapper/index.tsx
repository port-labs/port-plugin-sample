import clsx from 'clsx';
import { type ReactNode, useMemo, useRef, useState } from 'react';

import { generateDataTestId } from '../../shims/dataTestId';
import CellExpander from '../CellExpander';
import type { CellWrapperExpanderProps } from '../CellExpander/types';
import CopyButton from '../CopyButton';
import useHandleCellKeyDown from '../useHandleCellKeyDown';
import CellEditor from './CellEditor';
import type { CellWrapperEditorPassthrough, CellWrapperEditorProps, InternalEditorProps } from './CellEditor/types';
import CellEditorPortal from './CellEditorPortal';
import CellExpanderPortal from './CellExpanderPortal';
import EditCellButton from './EditCellButton';
import ExpandCellButton from './ExpandCellButton';

type BaseCellWrapperProps<T> = {
	children: ReactNode;
	className?: string;
	dataTestId?: string;
	isCopyable?: boolean;
	isExpandable?: boolean;
	value?: T;
	copyValue?: string | ((value: T) => string);
	fieldTitle?: string;
	tagMode?: boolean;
};

type EditableCellWrapperProps<T> = {
	isEditable?: boolean;
	onEdit?: (value: T) => void;
} & CellWrapperEditorPassthrough;

type ExpandableCellWrapperProps =
	| {
			isExpandable: boolean;
			expanderProps: CellWrapperExpanderProps;
	  }
	| {
			isExpandable?: never;
			expanderProps?: never;
	  };

/** Plugin: props are relaxed so renderers may pass onChange handlers while isEditable is false (read-only grid). */
type CellWrapperProps<T> = BaseCellWrapperProps<T> & EditableCellWrapperProps<T> & ExpandableCellWrapperProps;

function CellWrapper<T extends unknown>(props: CellWrapperProps<T>) {
	const { children, className, dataTestId, isCopyable, expanderProps, isExpandable, isEditable, copyValue, fieldTitle } =
		props;
	const [isEditing, setIsEditing] = useState(false);
	const [copyButtonVisbility, setCopyButtonVisbility] = useState(false);
	const [showExpandView, setShowExpandView] = useState(false);

	const shouldDisplayCellButtons = useMemo(
		() => !isEditing && !showExpandView && (isEditable || isCopyable || isExpandable),
		[isEditing, showExpandView, isEditable, isCopyable, isExpandable],
	);

	const stringifiedValue = useMemo<string>(() => {
		if (!props.value) return '';

		if (copyValue) {
			if (typeof copyValue === 'string') {
				return copyValue;
			}

			return copyValue(props.value);
		}

		if (typeof props.value === 'object') {
			try {
				return JSON.stringify(props.value);
			} catch (error) {
				console.error('Error stringifying value', error);
				return '';
			}
		}

		return String(props.value);
	}, [copyValue, props.value]);

	const containerRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = useHandleCellKeyDown({
		canEdit: isEditable ?? false,
		canCopy: isCopyable ?? false,
		onEdit: () => setIsEditing(true),
		onCopy: () => navigator?.clipboard?.writeText(stringifiedValue),
	});

	return (
		<>
			<div
				ref={containerRef}
				className={clsx('plugin-cell-wrapper', className)}
				data-cell-wrapper="true"
				data-has-actions={shouldDisplayCellButtons ? 'true' : undefined}
				data-skip-focus="true"
				data-testid={generateDataTestId(dataTestId, 'CellWrapper')}
				tabIndex={0}
				onKeyDown={handleKeyDown}
			>
				<div className="plugin-cell-wrapper__content">
					{isEditing && props.onEdit && props.isEditable ? (
						<CellEditorPortal containerRef={containerRef}>
							<CellEditor
								dataTestId={dataTestId}
								{...(props as unknown as CellWrapperEditorProps & InternalEditorProps)}
								onExit={() => {
									setIsEditing(false);

									setTimeout(() => {
										containerRef.current?.focus();
									});
								}}
							/>
						</CellEditorPortal>
					) : (
						children
					)}
				</div>
				{shouldDisplayCellButtons && (
					<div
						className={clsx('plugin-cell-wrapper__actions', copyButtonVisbility && 'plugin-cell-wrapper__actions--pinned')}
					>
						{isEditable && (
							<EditCellButton
								contentLabel={fieldTitle}
								dataTestId={dataTestId}
								onClick={() => requestAnimationFrame(() => setIsEditing(true))}
							/>
						)}
						{isCopyable && (
							<CopyButton
								contentLabel={fieldTitle}
								dataTestId={dataTestId}
								size="small"
								value={stringifiedValue}
								onVisibilityChanged={setCopyButtonVisbility}
							/>
						)}
						{isExpandable && (
							<ExpandCellButton contentLabel={fieldTitle} dataTestId={dataTestId} onClick={() => setShowExpandView(true)} />
						)}
					</div>
				)}
			</div>
			{isExpandable && showExpandView && (
				<CellExpanderPortal>
					<CellExpander value={props.value} {...expanderProps} onClose={() => setShowExpandView(false)} />
				</CellExpanderPortal>
			)}
		</>
	);
}

export default CellWrapper;
