import type { ReactNode } from 'react';

import type { ValueOf } from '../../shims/commonTypes';

export type InternalExpanderProps<T> = {
	onClose: (reason?: string) => void;
	value: T | string;
};

interface ExpanderProps {
	dataTestId?: string;
}

export const EXPANDER_TYPE = {
	JSON: 'json',
	DIALOG: 'dialog',
} as const;

export type JSONCellExpanderProps = ExpanderProps & {
	expanderType: typeof EXPANDER_TYPE.JSON;
	title: string;
};

type DialogCellExpanderProps = ExpanderProps & {
	expanderType: typeof EXPANDER_TYPE.DIALOG;
	dialog: (onClose: (reason?: string) => void) => ReactNode;
};

type BaseCellExpanderProps = JSONCellExpanderProps | DialogCellExpanderProps;

export type CellWrapperExpanderProps =
	| { expanderType: Exclude<ValueOf<typeof EXPANDER_TYPE>, BaseCellExpanderProps['expanderType']> }
	| BaseCellExpanderProps;
