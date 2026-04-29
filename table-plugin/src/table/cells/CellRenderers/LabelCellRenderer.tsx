import { memo } from 'react';

import type { LabelColor } from '../../shims/anchor-ui';
import { Label, Tooltip } from '../../shims/anchor-ui';
import { generateDataTestId } from '../../shims/dataTestId';
import CellWrapper from '../CellWrapper';
import { EDITOR_TYPE } from '../editorTypes';
import type { SelectOption } from '../uiComponentsTypes';

type LabelCellRendererProps = {
	color?: LabelColor;
	isCopyable?: boolean;
	dataTestId?: string;
	rightElement?: React.ReactNode;
	tooltip?: React.ReactNode;
	value?: string;
	fieldTitle?: string;
} & (
	| {
			isEditable: true;
			onEdit: (value?: string | null) => void;
			options: SelectOption<string>[];
	  }
	| {
			isEditable?: false;
			onEdit?: never;
			options?: never;
	  }
);

function LabelCellRenderer(props: LabelCellRendererProps) {
	const { color, dataTestId, isCopyable = true, rightElement, tooltip, value, fieldTitle } = props;

	if (props.isEditable) {
		return (
			<CellWrapper
				tagMode
				dataTestId={dataTestId}
				editorType={EDITOR_TYPE.SELECT}
				fieldTitle={fieldTitle}
				isCopyable={isCopyable && !!value}
				isEditable
				options={props.options}
				value={value}
				onEdit={(val) => props.onEdit(val as string | null | undefined)}
			>
				{value && (
					<Tooltip tip={tooltip}>
						<div style={{ display: 'flex', height: '100%', alignItems: 'center' }} className="plugin-truncate">
							<Label
								disabledTooltip
								color={color}
								dataTestId={generateDataTestId(dataTestId, 'LabelCellRenderer', value, color)}
								rightElement={rightElement}
							>
								{value}
							</Label>
						</div>
					</Tooltip>
				)}
			</CellWrapper>
		);
	}

	return (
		<CellWrapper
			dataTestId={dataTestId}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable && !!value}
			isEditable={false}
			value={value}
		>
			{value && (
				<Tooltip tip={tooltip}>
					<div style={{ display: 'flex', height: '100%', alignItems: 'center' }} className="plugin-truncate">
						<Label
							disabledTooltip
							color={color}
							dataTestId={generateDataTestId(dataTestId, 'LabelCellRenderer', value, color)}
							rightElement={rightElement}
						>
							{value}
						</Label>
					</div>
				</Tooltip>
			)}
		</CellWrapper>
	);
}

export default memo(LabelCellRenderer);
