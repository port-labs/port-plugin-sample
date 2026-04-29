import { Fragment, type ReactNode, type SVGProps } from 'react';

function iconSvg(props: SVGProps<SVGSVGElement>, children: ReactNode) {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
			{children}
		</svg>
	);
}

export function Copy(props: SVGProps<SVGSVGElement>) {
	return iconSvg(
		props,
		<Fragment>
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
		</Fragment>,
	);
}

export function Check(props: SVGProps<SVGSVGElement>) {
	return iconSvg(props, <path d="M20 6L9 17l-5-5" />);
}

export function Edit(props: SVGProps<SVGSVGElement>) {
	return iconSvg(
		props,
		<Fragment>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</Fragment>,
	);
}

export function Expand(props: SVGProps<SVGSVGElement>) {
	return iconSvg(
		props,
		<Fragment>
			<path d="M15 3h6v6" />
			<path d="M9 21H3v-6" />
			<path d="M21 3l-7 7" />
			<path d="M3 21l7-7" />
		</Fragment>,
	);
}

export function Warning(props: SVGProps<SVGSVGElement>) {
	return iconSvg(
		props,
		<Fragment>
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</Fragment>,
	);
}

export function HourGlass(props: SVGProps<SVGSVGElement>) {
	return iconSvg(
		props,
		<Fragment>
			<path d="M5 22h14" />
			<path d="M5 2h14" />
			<path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
			<path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
		</Fragment>,
	);
}

export function HourGlassExpired(props: SVGProps<SVGSVGElement>) {
	return HourGlass(props);
}

export function EmptyBox(props: SVGProps<SVGSVGElement>) {
	return iconSvg(props, <rect x="3" y="3" width="18" height="18" rx="2" />);
}

export function Swagger(props: SVGProps<SVGSVGElement>) {
	return iconSvg(props, <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />);
}

export type IconTypes = 'Link';
