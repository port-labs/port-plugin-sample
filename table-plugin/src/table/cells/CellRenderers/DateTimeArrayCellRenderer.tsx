import { useMemo } from 'react';

import { Label, OverflowList, Tooltip } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';
import type { DateFormat } from '../../shims/dateFormats';
import { dayjs } from '../../shims/dayjsSetup';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import { LabelListDialog } from '../LabelListDialog';
import { EDITOR_TYPE } from '../editorTypes';
import { formatDate, formatDateForTooltip } from '../formatDateTimeForCell';
import InvalidCellRenderer from './InvalidCellRenderer';

type DateTimeArrayCellRendererProps = {
	value?: string[];
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value: string[]) => void;
	fieldTitle: string;
	dateFormat?: DateFormat;
};

const DateTimeArrayCellRenderer = ({
	value,
	isEditable,
	isCopyable = true,
	onChange,
	fieldTitle,
	dateFormat,
}: DateTimeArrayCellRendererProps) => {
	if (value !== undefined && value !== null && !Array.isArray(value)) {
		return <InvalidCellRenderer value={value} />;
	}

	const dates = useMemo(() => {
		if (!value) return [];
		return value.map((v) => dayjs(v)).filter((d) => d.isValid());
	}, [value]);

	return (
		<CellWrapper
			isExpandable
			dataTestId="DateTimeArrayCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<LabelListDialog
						title={fieldTitle}
						values={dates.map((d) => formatDateForTooltip(d, dateFormat))}
						onClose={onClose}
					/>
				),
			}}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			language="json"
			value={JSON.stringify(value ?? [])}
			onEdit={(val) => {
				try {
					onChange?.(JSON.parse(val) as string[]);
				} catch {
					onChange?.([]);
				}
			}}
		>
			{dates.length > 0 && (
				<OverflowList
					itemRenderer={(item, _, index) => {
						const d = dates[index];
						return (
							<Tooltip key={`${item}-${index}`} tip={d ? formatDateForTooltip(d, dateFormat) : ''}>
								<Label dataTestId={generateDataTestId('DateTimeArrayCellRenderer', 'Label', index)}>
									{d ? formatDate(d, dateFormat) : ''}
								</Label>
							</Tooltip>
						);
					}}
					items={value ?? []}
					overflowRenderer={(overflownItems) => <Label>{`+${overflownItems.length}`}</Label>}
				/>
			)}
		</CellWrapper>
	);
};

export default DateTimeArrayCellRenderer;
