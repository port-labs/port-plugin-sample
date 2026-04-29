import { useCallback } from 'react';

type UseHandleCellKeyDownProps = {
	onEdit: () => void;
	onCopy: () => void;
	canEdit: boolean;
	canCopy: boolean;
};

export default function useHandleCellKeyDown({ onEdit, onCopy, canCopy, canEdit }: UseHandleCellKeyDownProps) {
	return useCallback(
		(event: React.KeyboardEvent) => {
			const { key, altKey, ctrlKey, shiftKey, metaKey } = event;
			const isSelectedText = !!window.getSelection()?.toString();

			const pressedKey = key.toLowerCase();

			if ((ctrlKey || metaKey) && !altKey && !shiftKey) {
				if (pressedKey === 'e' && canEdit) {
					event.preventDefault();
					onEdit();
				} else if (pressedKey === 'c' && canCopy && !isSelectedText) {
					event.preventDefault();
					onCopy();
				}
			}
		},
		[canCopy, canEdit, onCopy, onEdit],
	);
}
