import JSONCellExpander from './JSONCellExpander';
import { type CellWrapperExpanderProps, EXPANDER_TYPE, type InternalExpanderProps } from './types';

function handleUnexpectedExpanderType(expanderProps: never): never {
	const expanderData = (expanderProps as { expanderType: string })?.expanderType || expanderProps;

	throw new Error(`Unexpected expander type: ${String(expanderData)}`);
}

type CellExpanderProps<T> = CellWrapperExpanderProps & InternalExpanderProps<T>;

function CellExpander<T>(props: CellExpanderProps<T>) {
	switch (props.expanderType) {
		case EXPANDER_TYPE.JSON: {
			return (
				<JSONCellExpander dataTestId={props.dataTestId} title={props.title} value={props.value} onClose={props.onClose} />
			);
		}
		case EXPANDER_TYPE.DIALOG: {
			return props.dialog(props.onClose);
		}
		default:
			return handleUnexpectedExpanderType(props);
	}
}

export default CellExpander;
