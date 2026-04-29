import type { Dayjs } from 'dayjs';

import { DATE_FORMATS, type DateFormat } from '../shims/dateFormats';
import { dayjs } from '../shims/dayjsSetup';

const withUtcRelation = (localDate: string): string => `${localDate} (UTC${dayjs().format('Z')})`;

export function formatDate(date: Dayjs, dateFormat?: DateFormat): string {
	switch (dateFormat) {
		case DATE_FORMATS['12_HOUR']:
			return date.format('MMM D, YYYY h:mm A');
		case DATE_FORMATS['24_HOUR']:
			return date.format('D MMM YYYY HH:mm');
		case DATE_FORMATS.ISO:
			return date.format('YYYY-MM-DD HH:mm');
		case DATE_FORMATS.RELATIVE:
		default:
			return date.fromNow();
	}
}

export function formatDateForTooltip(date: Dayjs, dateFormat?: DateFormat): string {
	return !dateFormat || dateFormat === DATE_FORMATS.RELATIVE
		? withUtcRelation(date.format('YYYY-MM-DD HH:mm'))
		: withUtcRelation(formatDate(date, dateFormat));
}
