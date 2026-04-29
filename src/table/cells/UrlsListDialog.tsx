import { EmptyBox } from '../shims/anchor-icons';
import { Counter, Dialog, DialogContent, DialogHeader, DialogTitle, Tooltip, Typography } from '../shims/anchor-ui';
import { generateDataTestId } from '../shims/dataTestId';
import NoResults from './NoResults';
import { getLinkAttributes } from './linkUtils';

interface UrlsListDialogProps {
	urls?: string[];
	onClose?: () => void;
	title?: string;
	getDisplayName?: (url: string, index: number) => string | null;
}

const UrlListItem = ({ url, displayName }: { url: string; displayName?: string }) => {
	const linkAttributes = getLinkAttributes(url);
	const displayText = displayName ?? url;

	return (
		<Tooltip tip={url}>
			<li>
				<a
					data-testid={generateDataTestId('UrlsListDialog', `UrlItem-${url}`)}
					href={url}
					rel={linkAttributes.rel}
					style={{ textDecoration: 'none', color: 'inherit' }}
					target={linkAttributes.target}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div
							style={{
								display: 'flex',
								width: 40,
								height: 40,
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 12,
								border: '1px solid var(--border-low, #e2e8f0)',
							}}
						>
							<span aria-hidden style={{ fontSize: 18 }}>
								🔗
							</span>
						</div>
						<Typography className="plugin-truncate" variant="h4">
							{displayText}
						</Typography>
					</div>
				</a>
			</li>
		</Tooltip>
	);
};

export function UrlsListDialog({ urls, onClose, title, getDisplayName }: UrlsListDialogProps) {
	return (
		<Dialog fullHeight dataTestId="UrlsListDialog" size="small" onClose={onClose}>
			<DialogHeader>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<DialogTitle>{title || 'URLs'}</DialogTitle>
					<Counter dataTestId="UrlsListDialog" value={urls?.length ?? 0} />
				</div>
			</DialogHeader>
			<DialogContent>
				{!urls || urls.length === 0 ? (
					<NoResults>
						<EmptyBox style={{ width: 48, height: 48, opacity: 0.5 }} />
						<div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
							<NoResults.Title>No URLs found</NoResults.Title>
							<NoResults.Text>There are no URLs to display</NoResults.Text>
						</div>
					</NoResults>
				) : (
					<ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
						{urls.map((url, index) => (
							<UrlListItem key={`${url}-${index}`} displayName={getDisplayName?.(url, index) ?? undefined} url={url} />
						))}
					</ul>
				)}
			</DialogContent>
		</Dialog>
	);
}
