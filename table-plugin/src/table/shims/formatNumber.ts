export function formatNumberValue(value?: number | string | null): string {
	if (value === null || value === undefined) {
		return '';
	}
	const numValue = Number(value);
	if (!Number.isNaN(numValue)) {
		return numValue.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 3,
			useGrouping: false,
		});
	}
	return value?.toString() ?? '';
}
