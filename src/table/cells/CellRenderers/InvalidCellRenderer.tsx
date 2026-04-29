import { Warning } from '../../shims/anchor-icons';
import { Typography } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';

const defaultMessage = 'Invalid value';

type InvalidCellRendererProps = {
	value: unknown;
};

function InvalidCellRenderer({ value }: InvalidCellRendererProps) {
	return (
		<CellWrapper
			isExpandable
			dataTestId="InvalidCellRenderer"
			expanderProps={{ expanderType: EXPANDER_TYPE.JSON, title: 'Invalid content' }}
			value={value}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="plugin-truncate">
				<Warning style={{ width: 18, height: 18, flexShrink: 0 }} />
				<Typography truncate>{defaultMessage}</Typography>
			</div>
		</CellWrapper>
	);
}

export default InvalidCellRenderer;
