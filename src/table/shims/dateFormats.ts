export const DATE_FORMATS = {
	RELATIVE: 'relative',
	'12_HOUR': '12-hour',
	'24_HOUR': '24-hour',
	ISO: 'iso',
} as const;

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];
