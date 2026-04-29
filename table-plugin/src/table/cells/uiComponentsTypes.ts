import type { LabelColor } from '../shims/anchor-ui';

export type SelectOption<T = string> = {
	label: string;
	value: T;
	labelColor?: LabelColor;
	description?: string;
	group?: string;
	isDefaultOption?: boolean;
};
