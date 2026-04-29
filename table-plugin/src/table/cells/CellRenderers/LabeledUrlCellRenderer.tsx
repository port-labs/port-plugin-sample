import { memo, useMemo } from 'react';

import { Typography } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import SimpleReadOnlyCodeDialog from '../SimpleReadOnlyCodeDialog';
import UrlButton from '../UrlButton';
import type { LabeledUrlValue } from '../editorTypes';
import { EDITOR_TYPE } from '../editorTypes';

const ENTITY_URL_REGEX = /(\w+)Entity\?identifier=([^&]+)/;

const PORT_HOSTNAME_REGEX = /^(app\.)?(us\.)?(get)?port\.io$/;

const isEntityUrl = (url: string): boolean => {
	if (!ENTITY_URL_REGEX.test(url)) {
		return false;
	}

	try {
		const parsedUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
		return PORT_HOSTNAME_REGEX.test(parsedUrl.hostname);
	} catch {
		return false;
	}
};

type LabeledUrlCellRendererProps = {
	value?: LabeledUrlValue;
	isCopyable?: boolean;
	isEditable: boolean;
	onChange?: (value?: LabeledUrlValue) => void;
	fieldTitle?: string;
};

const LABELED_URL_SCHEMA = {
	type: 'object',
	properties: {
		url: { type: 'string', format: 'uri' },
		displayText: { type: 'string' },
	},
	required: ['url'],
	additionalProperties: false,
};

function LabeledUrlCellRenderer({
	value,
	isEditable,
	isCopyable = true,
	onChange,
	fieldTitle,
}: LabeledUrlCellRendererProps) {
	const displayValue = useMemo(() => {
		if (!value) return '';
		return JSON.stringify(value, null, 2);
	}, [value]);

	return (
		<CellWrapper
			dataTestId="LabeledUrlCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<SimpleReadOnlyCodeDialog
						dataTestId="LabeledUrlCellRenderer"
						language="json"
						title={fieldTitle || 'Labeled URL'}
						value={displayValue}
						onClose={onClose}
					/>
				),
			}}
			fieldTitle={fieldTitle || 'Labeled URL'}
			isCopyable={isCopyable}
			isEditable={isEditable}
			isExpandable={!!value}
			language="json"
			schema={LABELED_URL_SCHEMA}
			value={displayValue}
			copyValue={() => value?.url ?? ''}
			onEdit={(val) => {
				try {
					onChange?.(JSON.parse(val) as LabeledUrlValue);
				} catch {
					onChange?.(undefined);
				}
			}}
		>
			{value?.url &&
				(isEntityUrl(value.url) && value.displayText ? (
					<a className="plugin-truncate plugin-link" href={value.url}>
						<Typography truncate className="plugin-link-text">
							{value.displayText || value.url}
						</Typography>
					</a>
				) : (
					<UrlButton displayName={value.displayText} url={value.url} />
				))}
		</CellWrapper>
	);
}

export default memo(LabeledUrlCellRenderer);
