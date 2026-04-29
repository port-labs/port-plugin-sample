import { memo, useMemo } from 'react';

import { Tooltip, Typography } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';
import type { DateFormat } from '../../shims/dateFormats';
import { dayjs } from '../../shims/dayjsSetup';
import CellWrapper from '../CellWrapper';
import { EDITOR_TYPE } from '../editorTypes';
import { formatDate, formatDateForTooltip } from '../formatDateTimeForCell';

type DateCellRendererProps = {
	dataTestId?: string;
	isCopyable?: boolean;
	value: string | null;
	isEditable?: boolean;
	onChange?: (value: string | null) => void;
	fieldTitle?: string;
	dateFormat?: DateFormat;
};

function DateTimeCellRenderer({
	value,
	dataTestId,
	isEditable,
	isCopyable = true,
	onChange,
	fieldTitle,
	dateFormat,
}: DateCellRendererProps) {
	const date = useMemo(() => {
		if (value) {
			const parsedDate = dayjs(value);

			if (parsedDate.isValid()) {
				return parsedDate;
			}
		}
		return undefined;
	}, [value]);

	return (
		<CellWrapper
			dataTestId={generateDataTestId(dataTestId, 'DateTimeCellRenderer')}
			editorType={EDITOR_TYPE.DATE_TIME}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={!!isEditable}
			value={value}
			onEdit={(val) => onChange?.(val)}
		>
			<Tooltip
				dataTestId={generateDataTestId(dataTestId, 'DateTimeCellRenderer', 'Tooltip')}
				tip={date ? formatDateForTooltip(date, dateFormat) : ''}
			>
				<time className="plugin-truncate" dateTime={date?.toISOString()}>
					<Typography disabledTooltip truncate>
						{date ? formatDate(date, dateFormat) : ''}
					</Typography>
				</time>
			</Tooltip>
		</CellWrapper>
	);
}

export default memo(DateTimeCellRenderer);
