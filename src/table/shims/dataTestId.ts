export function generateDataTestId(...args: (string | number | undefined)[]): string {
	return args.filter((arg) => arg !== undefined && arg !== '' && arg !== null).join('__');
}
