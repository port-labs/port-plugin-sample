import UrlButton from './UrlButton';

type MultiUrlItemRendererProps = {
	url: string;
	onUrlClick?: () => void;
	displayName?: string;
};

const MultiUrlItemRenderer = ({ url, onUrlClick, displayName }: MultiUrlItemRendererProps) => {
	return (
		<div data-testid="UrlCellRenderer">
			<UrlButton displayName={displayName} url={url.toString()} onClick={onUrlClick} />
		</div>
	);
};

export default MultiUrlItemRenderer;
