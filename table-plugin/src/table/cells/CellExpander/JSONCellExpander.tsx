import { useMemo } from 'react';

import { generateDataTestId } from '../../shims/dataTestId';
import SimpleReadOnlyCodeDialog from '../SimpleReadOnlyCodeDialog';
import type { InternalExpanderProps, JSONCellExpanderProps } from './types';

function JSONCellExpander<T>({
	value,
	onClose,
	title,
	dataTestId,
}: Omit<JSONCellExpanderProps, 'expanderType'> & InternalExpanderProps<T>) {
	const stringifiedJSON = useMemo(() => {
		if (typeof value === 'string') {
			return value;
		}

		return JSON.stringify(value, null, 2);
	}, [value]);

	return (
		<SimpleReadOnlyCodeDialog
			dataTestId={generateDataTestId(dataTestId, 'JSONCellExpander')}
			language="json"
			title={title}
			value={stringifiedJSON}
			onClose={onClose}
		/>
	);
}

export default JSONCellExpander;
