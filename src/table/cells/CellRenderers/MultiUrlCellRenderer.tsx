import React from 'react';

import { Label, OverflowList } from '../../shims/anchor-ui';
import { EXPANDER_TYPE } from '../CellExpander/types';
import CellWrapper from '../CellWrapper';
import MultiUrlItemRenderer from '../MultiUrlItemRenderer';
import { UrlsListDialog } from '../UrlsListDialog';
import { EDITOR_TYPE } from '../editorTypes';
import InvalidCellRenderer from './InvalidCellRenderer';

type MultiUrlCellRendererProps = {
	fieldTitle?: string;
	value?: string[];
	onUrlClick?: () => void;
	isEditable?: boolean;
	isCopyable?: boolean;
	onChange?: (value?: string) => void;
	getDisplayName?: (url: string, index: number) => string | null;
};

const MultiUrlCellRenderer = ({
	fieldTitle,
	value,
	onUrlClick,
	isEditable,
	isCopyable = true,
	onChange,
	getDisplayName,
}: MultiUrlCellRendererProps) => {
	if (value && !Array.isArray(value)) {
		return <InvalidCellRenderer value={value} />;
	}

	return (
		<CellWrapper
			isExpandable
			copyValue={value?.length === 1 ? value[0] : ''}
			dataTestId="MultiUrlCellRenderer"
			editorType={EDITOR_TYPE.CODE}
			expanderProps={{
				expanderType: EXPANDER_TYPE.DIALOG,
				dialog: (onClose) => (
					<UrlsListDialog getDisplayName={getDisplayName} title={fieldTitle} urls={value} onClose={onClose} />
				),
			}}
			fieldTitle={fieldTitle || 'Links'}
			isCopyable={isCopyable && value?.length === 1}
			isEditable={isEditable ?? false}
			language="json"
			value={value ? JSON.stringify(value, null, 2) : '[]'}
			onEdit={(val) => onChange?.(val)}
		>
			{value && (
				<OverflowList
					className="plugin-flex-row-center"
					itemRenderer={(url, _, index) => (
						<MultiUrlItemRenderer
							key={url.concat(index.toString())}
							displayName={getDisplayName?.(url, index) ?? undefined}
							url={url}
							onUrlClick={onUrlClick}
						/>
					)}
					items={value}
					overflowRenderer={(overflownItems) => (
						<Label dataTestId="MultiURlCellRendererPlusSign">{`+${overflownItems.length}`}</Label>
					)}
				/>
			)}
		</CellWrapper>
	);
};

export default React.memo(MultiUrlCellRenderer);
