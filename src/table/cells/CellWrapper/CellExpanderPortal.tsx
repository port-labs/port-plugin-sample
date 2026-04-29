import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useTableFocusScope } from '../TableFocusProvider';

type CellExpanderPortalProps = {
	children: ReactNode;
};

/**
 * Renders expand dialogs on document.body so `position: fixed` is viewport-relative.
 * Without this, grid transforms create a containing block and the modal pins to the table top.
 */
const CellExpanderPortal = ({ children }: CellExpanderPortalProps) => {
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
		<div ref={portalRef} data-plugin-cell-expander-portal="true">
			{children}
		</div>,
		document.body,
	);
};

export default CellExpanderPortal;
