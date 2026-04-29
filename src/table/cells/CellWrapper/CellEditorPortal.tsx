import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useTableFocusScope } from '../TableFocusProvider';

type CellEditorPortalProps = {
	children: ReactNode;
	containerRef: React.RefObject<HTMLDivElement | null>;
};

const CellEditorPortal = ({ children, containerRef }: CellEditorPortalProps) => {
	const cellRect = containerRef.current?.getBoundingClientRect();
	const portalRef = useRef<HTMLDivElement>(null);
	const tableFocusScope = useTableFocusScope();

	useEffect(() => {
		if (!tableFocusScope) return;

		if (portalRef.current) {
			const element = portalRef.current;
			tableFocusScope.add(element);

			return () => {
				tableFocusScope.remove(element);
			};
		}
		return undefined;
	}, [tableFocusScope]);

	return createPortal(
		<div
			ref={portalRef}
			className="plugin-flex-row-center"
			style={{
				position: 'absolute',
				width: cellRect?.width,
				height: cellRect?.height,
				top: (cellRect?.top ?? 0) + window.scrollY,
				left: (cellRect?.left ?? 0) + window.scrollX,
				zIndex: 2,
			}}
		>
			{children}
		</div>,
		document.body,
	);
};

export default CellEditorPortal;
