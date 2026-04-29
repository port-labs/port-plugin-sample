import { Typography } from '../shims/anchor-ui';
import { generateDataTestId } from '../shims/dataTestId';

type NoResultsProps = {
	children: React.ReactNode;
};

function NoResultsTitle(props: { children: React.ReactNode }) {
	return (
		<Typography as="p" dataTestId={generateDataTestId('NoResults', 'Title')} variant="h2">
			{props.children}
		</Typography>
	);
}

function NoResultsText(props: { children: React.ReactNode }) {
	return (
		<Typography as="p" dataTestId={generateDataTestId('NoResults', 'Text')} variant="body2">
			{props.children}
		</Typography>
	);
}

function NoResults(props: NoResultsProps) {
	return (
		<div className="plugin-no-results" data-testid="NoResults">
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
				{props.children}
			</div>
		</div>
	);
}

NoResults.Title = NoResultsTitle;
NoResults.Text = NoResultsText;

export default NoResults;
