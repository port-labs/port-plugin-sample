import TypedDataTable from '../table/TypedDataTable';
import type { TypedColumn, TypedRow } from '../table/columnTypes';

const demoColumns: TypedColumn[] = [
	{ key: 'c_text', name: 'Text', type: 'text', width: 160 },
	{ key: 'c_number', name: 'Number', type: 'number', width: 100 },
	{ key: 'c_bool', name: 'Boolean', type: 'boolean', width: 90 },
	{ key: 'c_date', name: 'DateTime', type: 'dateTime', width: 160 },
	{ key: 'c_dates', name: 'DateTime[]', type: 'dateTimeArray', width: 180 },
	{ key: 'c_url', name: 'URL', type: 'url', width: 140 },
	{ key: 'c_labeledUrl', name: 'Labeled URL', type: 'labeledUrl', width: 160 },
	{ key: 'c_multiUrl', name: 'Multi URL', type: 'multiUrl', width: 160 },
	{ key: 'c_multiLabeled', name: 'Multi Labeled', type: 'multiLabeledUrl', width: 180 },
	{ key: 'c_array', name: 'Array', type: 'array', width: 140 },
	{ key: 'c_jsonArray', name: 'JSON[]', type: 'jsonArray', width: 160 },
	{ key: 'c_json', name: 'JSON', type: 'json', width: 200 },
	{ key: 'c_code', name: 'Code', type: 'code', language: 'yaml', width: 120 },
	{ key: 'c_md', name: 'Markdown', type: 'markdown', width: 140 },
	{ key: 'c_timer', name: 'Timer', type: 'timer', width: 120 },
	{ key: 'c_label', name: 'Label', type: 'label', color: 'blue', width: 100 },
	{ key: 'c_enum', name: 'Enum[]', type: 'enumArray', width: 160, enumOptions: ['alpha', 'beta', 'gamma'] },
];

const futureIso = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
const pastIso = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

const demoRows: TypedRow[] = [
	{
		id: 'row-1',
		c_text: 'Long text '.repeat(8).trim(),
		c_number: 12345.678,
		c_bool: true,
		c_date: '2024-06-15T14:30:00.000Z',
		c_dates: ['2024-01-01T10:00:00.000Z', '2024-06-01T12:00:00.000Z'],
		c_url: 'https://example.com/path',
		c_labeledUrl: { url: 'https://example.com', displayText: 'Example' },
		c_multiUrl: ['https://a.example', 'https://b.example'],
		c_multiLabeled: [
			{ url: 'https://docs.example.com', displayText: 'Docs' },
			{ url: 'https://api.example.com', displayText: 'API' },
		],
		c_array: ['one', 'two', 'three', 'four'],
		c_jsonArray: [{ a: 1 }, { b: 2 }],
		c_json: { service: 'demo', version: 1 },
		c_code: 'key: value\nlist:\n  - a\n  - b',
		c_md: '# Title\nSome **markdown** here.',
		c_timer: futureIso,
		c_label: 'Production',
		c_enum: ['alpha', 'beta'],
	},
	{
		id: 'row-2',
		c_text: 'Second row',
		c_number: -42,
		c_bool: false,
		c_date: null,
		c_dates: [],
		c_url: 'https://port.io',
		c_labeledUrl: { url: 'https://getport.io', displayText: 'Port' },
		c_multiUrl: ['https://single.example'],
		c_multiLabeled: [{ url: 'https://x.example', displayText: 'X' }],
		c_array: ['only'],
		c_jsonArray: [{ x: true }],
		c_json: { empty: null },
		c_code: '{}',
		c_md: 'Plain line',
		c_timer: pastIso,
		c_label: 'Staging',
		c_enum: ['gamma'],
	},
];

export default function TypedTableDemo() {
	return (
		<section className="typed-table-demo">
			<h2 style={{ marginBottom: 12, textAlign: 'left', color: 'var(--text-high, #0f172a)' }}>
				Typed data table (column types)
			</h2>
			<p style={{ marginBottom: 16, textAlign: 'left', color: 'var(--text-medium, #64748b)', fontSize: 14 }}>
				Rows and columns are plain data; each column <code>type</code> selects a cell renderer from the ported frontend
				stack.
			</p>
			<TypedDataTable columns={demoColumns} height={520} rows={demoRows} />
		</section>
	);
}
