import { memo } from 'react';

import { HourGlass, HourGlassExpired } from '../../shims/anchor-icons';
import { Label, Tooltip } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';
import { dayjs } from '../../shims/dayjsSetup';
import CellWrapper from '../CellWrapper';
import { EDITOR_TYPE } from '../editorTypes';

type TimerCellRendererProps = {
	value?: string;
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value?: string) => void;
	fieldTitle?: string;
};

const getHoursDiffFromNow = (date: string | number | Date) => {
	const now = dayjs();
	return dayjs(date).diff(now, 'hours');
};

const getMinutesDiffFromNow = (date: string | number | Date) => {
	const now = dayjs();
	return dayjs(date).diff(now, 'minutes') % 60;
};

function isExpired(value: string) {
	const diff = (dayjs(value).valueOf() - Date.now()) / 60000;
	return diff <= 0;
}

function getTimeDifferent(value: string, backward = false) {
	let hours = getHoursDiffFromNow(value);
	const days = Math.floor(hours / 24);
	hours -= days * 24;
	const minutes = getMinutesDiffFromNow(value);
	if (backward) {
		return { days: days * -1, hours: hours * -1, minutes: minutes * -1 };
	}

	return { days, hours, minutes };
}

function showTimerMessage(value: string, backward = false) {
	const { days, hours, minutes } = getTimeDifferent(value, backward);

	if (days >= 1) {
		return hours > 0 ? `${days}d:${hours}h` : `${days}d`;
	}

	if (hours >= 1) {
		return minutes > 0 ? `${hours}h:${minutes}m` : `${hours}h`;
	}
	if (minutes === 0) {
		return '1m';
	}
	return `${minutes}m`;
}

function expiredTooltip(value: string) {
	const timerMessage = showTimerMessage(value, true);
	return `Expired ${timerMessage} ago`;
}

const TimerCellRenderer = ({ value, isEditable, isCopyable = true, onChange, fieldTitle }: TimerCellRendererProps) => {
	const isValidDate = value && dayjs(value).isValid();
	const expired = value && isExpired(value);

	return (
		<CellWrapper
			dataTestId="TimerCellRenderer"
			editorType={EDITOR_TYPE.DATE_TIME}
			fieldTitle={fieldTitle}
			isCopyable={!!value && isCopyable}
			isEditable={isEditable}
			value={value || ''}
			onEdit={(val) => onChange?.(val || undefined)}
		>
			<div className="plugin-truncate">
				{!expired ? (
					value ? (
						<Label
							className="plugin-capitalize"
							dataTestId={generateDataTestId('TimerCellRenderer', 'Label')}
							leftElement={<HourGlass style={{ width: 16, height: 16, color: 'var(--success, #16a34a)' }} />}
						>
							{isValidDate ? `${showTimerMessage(value)}` : ''}
						</Label>
					) : null
				) : (
					<Tooltip dataTestId={generateDataTestId('TimerCellRenderer', 'Tooltip')} tip={expiredTooltip(value)}>
						<Label
							dataTestId={generateDataTestId('TimerCellRenderer', 'Label')}
							leftElement={<HourGlassExpired style={{ width: 16, height: 16, color: 'var(--alert, #dc2626)' }} />}
						>
							Expired
						</Label>
					</Tooltip>
				)}
			</div>
		</CellWrapper>
	);
};

export default memo(TimerCellRenderer);
