import { useCallback, useMemo } from 'react';

import { Label, OverflowList } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import { EnumsListDialog } from '../EnumsListDialog';
import { EDITOR_TYPE } from '../editorTypes';
import type { EnumFieldColorMap } from '../enumLabel';
import { getLabelColor } from '../enumLabel';
import type { SelectOption } from '../uiComponentsTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type EnumArrayCellRendererProps = {
	value?: (string | number)[];
	colors?: EnumFieldColorMap;
	options?: (string | number)[];
	isEditable: boolean;
	isCopyable?: boolean;
	onChange?: (value: (string | number)[]) => void;
	fieldTitle?: string;
};

const EnumArrayCellRenderer = ({
	value,
	colors,
	options,
	isEditable,
	isCopyable = true,
	onChange,
	fieldTitle,
}: EnumArrayCellRendererProps) => {
	const hasInvalidOptions = Array.isArray(options) && options.some((option) => option == null);
	const hasInvalidValues = Array.isArray(value) && value.some((item) => item == null);

	if (hasInvalidOptions) {
		console.warn('Enum options contain null/undefined', { fieldTitle, options });
	}

	if (hasInvalidValues) {
		console.warn('Enum value contains null/undefined', { fieldTitle, value });
	}

	const sanitizedOptions = useMemo(
		() => (Array.isArray(options) ? options.filter((option): option is string | number => option != null) : options),
		[options],
	);

	const sanitizedValue = useMemo(
		() => (Array.isArray(value) ? value.filter((item): item is string | number => item != null) : value),
		[value],
	);

	const availableOptions = useMemo<SelectOption<string>[]>(
		() =>
			Array.isArray(sanitizedOptions)
				? sanitizedOptions.map((option) => ({
						label: option.toString(),
						value: option.toString(),
						labelColor: getLabelColor(option, colors),
					}))
				: [],
		[colors, sanitizedOptions],
	);

	const selectedValues = useMemo<SelectOption<string>[]>(
		() =>
			Array.isArray(sanitizedValue)
				? sanitizedValue.map((val) => ({
						label: val.toString(),
						value: val.toString(),
						labelColor: getLabelColor(val, colors),
					}))
				: [],
		[colors, sanitizedValue],
	);

	const arrayItems = useMemo(
		() => ({
			enum: sanitizedOptions,
			enumColors: colors,
			type: 'string',
		}),
		[colors, sanitizedOptions],
	);

	const onEdit = useCallback(
		(editValue: SelectOption<string>[]) => {
			const newValues = editValue.map((item) => item.value).filter(Boolean);
			onChange?.(newValues);
		},
		[onChange],
	);

	if (value !== undefined && value !== null && !Array.isArray(value)) {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			isExpandable
			dataTestId="EnumArrayCellRenderer"
			editorType={EDITOR_TYPE.MULTI_SELECT}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<EnumsListDialog colors={colors} title={fieldTitle} values={sanitizedValue} onClose={onClose} />
				),
			}}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			items={arrayItems}
			options={availableOptions}
			value={selectedValues}
			onEdit={onEdit}
		>
			{sanitizedValue && (
				<OverflowList
					itemRenderer={(item, _, index) => (
						<Label key={`${String(item)}-${index}`} color={getLabelColor(item, colors)}>
							{item}
						</Label>
					)}
					items={sanitizedValue}
					overflowRenderer={(overflownItems) => <Label>{`+${overflownItems.length}`}</Label>}
				/>
			)}
		</CellWrapper>
	);
};

export default EnumArrayCellRenderer;
