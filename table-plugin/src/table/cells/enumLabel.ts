import type { LabelColor } from '../shims/anchor-ui';

export const ENUM_COLORS = {
	blue: 'blue',
	turquoise: 'turquoise',
	orange: 'orange',
	purple: 'purple',
	pink: 'pink',
	yellow: 'yellow',
	green: 'green',
	red: 'red',
	gold: 'gold',
	silver: 'silver',
	paleBlue: 'paleBlue',
	darkGray: 'darkGray',
	lightGray: 'lightGray',
	bronze: 'bronze',
	lime: 'lime',
	olive: 'olive',
	brown: 'brown',
} as const;

export type EnumColor = keyof typeof ENUM_COLORS;

type EnumColorConfig = {
	labelColor: LabelColor;
};

const EnumColorConfigs: Record<EnumColor, EnumColorConfig> = {
	[ENUM_COLORS.lightGray]: { labelColor: 'grey' },
	[ENUM_COLORS.blue]: { labelColor: 'blue' },
	[ENUM_COLORS.turquoise]: { labelColor: 'turquoise' },
	[ENUM_COLORS.orange]: { labelColor: 'orange' },
	[ENUM_COLORS.purple]: { labelColor: 'purple' },
	[ENUM_COLORS.pink]: { labelColor: 'pink' },
	[ENUM_COLORS.yellow]: { labelColor: 'yellow' },
	[ENUM_COLORS.green]: { labelColor: 'green' },
	[ENUM_COLORS.red]: { labelColor: 'red' },
	[ENUM_COLORS.gold]: { labelColor: 'gold' },
	[ENUM_COLORS.silver]: { labelColor: 'silver' },
	[ENUM_COLORS.paleBlue]: { labelColor: 'oceanBlue' },
	[ENUM_COLORS.darkGray]: { labelColor: 'silver' },
	[ENUM_COLORS.bronze]: { labelColor: 'bronze' },
	[ENUM_COLORS.lime]: { labelColor: 'lime' },
	[ENUM_COLORS.olive]: { labelColor: 'olive' },
	[ENUM_COLORS.brown]: { labelColor: 'brown' },
};

export const ENUM_COLORS_TO_LABELS_COLOR: Record<EnumColor, LabelColor> = Object.fromEntries(
	Object.entries(EnumColorConfigs).map(([k, v]) => [k, v.labelColor]),
) as Record<EnumColor, LabelColor>;

export type EnumFieldColor = EnumColor;
export type EnumFieldColorMap = Record<string | number, EnumFieldColor>;

export const DEFAULT_TAG_LABEL_COLOR: LabelColor = 'grey';

export function getLabelColor(value?: string | number, enumColorField?: EnumFieldColorMap): LabelColor {
	if (value === undefined || enumColorField === undefined || Object.keys(enumColorField).length === 0) {
		return DEFAULT_TAG_LABEL_COLOR;
	}

	const enumColor = enumColorField[value];
	if (!enumColor) {
		return DEFAULT_TAG_LABEL_COLOR;
	}

	return ENUM_COLORS_TO_LABELS_COLOR[enumColor] ?? DEFAULT_TAG_LABEL_COLOR;
}
