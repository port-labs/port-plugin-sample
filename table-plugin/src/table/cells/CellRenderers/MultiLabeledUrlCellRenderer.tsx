import React, { useMemo } from 'react';

import { Label, OverflowList } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import UrlButton from '../UrlButton';
import { UrlsListDialog } from '../UrlsListDialog';
import type { LabeledUrlValue } from '../editorTypes';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type MultiLabeledUrlCellRendererProps = {
	fieldTitle?: string;
	value?: LabeledUrlValue[];
	onUrlClick?: () => void;
	isEditable?: boolean;
	isCopyable?: boolean;
	onChange?: (value?: LabeledUrlValue[]) => void;
};

const LABELED_URL_ARRAY_SCHEMA = {
	type: 'array',
	items: {
		type: 'object',
		properties: {
			url: { type: 'string', format: 'uri' },
			displayText: { type: 'string' },
		},
		required: ['url'],
		additionalProperties: false,
	},
};

function LabeledUrlItemRenderer({ item, onUrlClick }: { item: LabeledUrlValue; onUrlClick?: () => void }) {
	return <UrlButton displayName={item.displayText} url={item.url} onClick={onUrlClick} />;
}

function MultiLabeledUrlCellRenderer({
	fieldTitle,
	value,
	onUrlClick,
	isEditable,
	isCopyable = true,
	onChange,
}: MultiLabeledUrlCellRendererProps) {
	const items = useMemo(() => {
		if (!value || !Array.isArray(value)) return [];
		return value.filter((item): item is LabeledUrlValue => item !== null && typeof item.url === 'string');
	}, [value]);

	if (value && !Array.isArray(value)) {
		return <InvalidCellRenderer value={value} />;
	}

	const editorValue = items.length > 0 ? JSON.stringify(items, null, 2) : '[]';
	const urls = items.map((item) => item.url);

	return (
		<CellWrapper
			isExpandable
			copyValue={items.length === 1 ? items[0].url : ''}
			dataTestId="MultiLabeledUrlCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<UrlsListDialog
						getDisplayName={(_u, index) => items[index]?.displayText ?? null}
						title={fieldTitle}
						urls={urls}
						onClose={onClose}
					/>
				),
			}}
			fieldTitle={fieldTitle || 'Labeled URLs'}
			isCopyable={isCopyable && items.length === 1}
			isEditable={isEditable ?? false}
			language="json"
			schema={LABELED_URL_ARRAY_SCHEMA}
			value={editorValue}
			onEdit={(val) => {
				try {
					const parsed: LabeledUrlValue[] = JSON.parse(val) as LabeledUrlValue[];
					onChange?.(parsed);
				} catch {
					onChange?.(undefined);
				}
			}}
		>
			{items.length > 0 && (
				<OverflowList
					className="plugin-flex-row-center"
					itemRenderer={(item, _, index) => (
						<div key={`${item.url}-${index}`} data-testid="LabeledUrlCellRenderer">
							<LabeledUrlItemRenderer item={item} onUrlClick={onUrlClick} />
						</div>
					)}
					items={items}
					overflowRenderer={(overflownItems) => (
						<Label dataTestId="MultiLabeledUrlCellRendererPlusSign">{`+${overflownItems.length}`}</Label>
					)}
				/>
			)}
		</CellWrapper>
	);
}

export default React.memo(MultiLabeledUrlCellRenderer);
