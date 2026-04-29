import { memo } from 'react';

import CellWrapper from '../CellWrapper';
import UrlButton from '../UrlButton';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

const API_PROPERTY_SPECS = {
	'open-api': 'open-api',
	'embedded-url': 'embedded-url',
	'async-api': 'async-api',
} as const;

type UrlCellRendererProps = {
	spec?: keyof typeof API_PROPERTY_SPECS;
	value?: string;
	isCopyable?: boolean;
	isEditable: boolean;
	onChange?: (value?: string) => void;
	onUrlClick?: () => void;
	fieldTitle?: string;
	displayName?: string;
};

const UrlCellRenderer = ({
	spec,
	value,
	isEditable,
	isCopyable = true,
	onChange,
	onUrlClick,
	fieldTitle,
	displayName,
}: UrlCellRendererProps) => {
	if (value && typeof value !== 'string') {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			dataTestId="UrlCellRenderer"
			editorType={EDITOR_TYPE.TEXT}
			fieldTitle={fieldTitle}
			isCopyable={isCopyable}
			isEditable={isEditable}
			value={value}
			onEdit={(val) => onChange?.(val)}
		>
			{value && <UrlButton displayName={displayName} spec={spec} url={value} onClick={onUrlClick} />}
		</CellWrapper>
	);
};

export default memo(UrlCellRenderer);
