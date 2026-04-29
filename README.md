# Table plugin sample

A minimal Port-style plugin built with **React** and **TypeScript**. The UI is a **typed data table**: each column declares a `type`, and `cellTypeRegistry` maps that type to a cell renderer. The production build emits a single self-contained **`dist/index.html`** (JS and CSS inlined via Webpack), suitable for embedding in Port or similar hosts.

Host **theme** and **`applyThemeCss`** come from **`@port-labs/plugins-sdk`**; the grid applies light/dark classes from `theme.mode`.

## Tech stack

- **React 19** + **TypeScript** 5.9
- **`@port-labs/port-react-data-grid`** — `DataGrid`, frozen columns, virtualization-friendly layout
- **`@port-labs/plugins-sdk`** — `usePortPluginData`, `applyThemeCss` (theme when embedded)
- **TanStack React Query** — `QueryClientProvider` at the app root (ready if you add API hooks)
- **Webpack 5** + `InlineChunkHtmlPlugin` — inlined bundle in `index.html`
- **PostCSS** (`postcss-preset-env`)

**Note:** `@port-labs/port-react-data-grid` expects the **`ecij`** package at runtime; it is listed in this project’s `dependencies` so installs resolve correctly.

## Getting started

### Prerequisites

- Node.js **22+**
- npm or Yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:9000](http://localhost:9000). Without a Port host, `PLUGIN_DATA` / token may be absent; the table demo still runs for local styling checks.

### Build

```bash
npm run build
```

- **`dist/index.html`** — single file with inlined JS/CSS.

## Table module

### Public API (`src/table/index.ts`)

| Export | Role |
| --- | --- |
| **`TypedDataTable`** | Grid component: `columns`, `rows`, optional `height`, `rowKeyField`. |
| **`TypedDataTableProps`** | Props type for `TypedDataTable`. |
| **`TypedColumn`**, **`TypedRow`**, **`ColumnCellType`** | Column/row typing; each column has `key`, `name`, `type`, and type-specific options. |
| **`COLUMN_CELL_TYPES`** | Const array of supported `type` string literals. |
| **`renderTypedCell`** | `switch` on `column.type` → renderer; extend here for new column types. |

`TypedDataTable` wires **`TableFocusProvider`**, host **`theme.mode`** → `rdg-dark` / `rdg-light`, and imports **`table/table.css`** plus the grid package stylesheet.

### Column types → cell renderers

Mapping is implemented in **`src/table/cellTypeRegistry.tsx`**. Each renderer lives under **`src/table/cells/CellRenderers/`**:

| Column `type` | Component | Notes |
| --- | --- | --- |
| `text` | `TextCellRenderer` | Truncation, optional edit/copy/expand. |
| `number` | `NumberCellRenderer` | |
| `boolean` | `BooleanCellRenderer` | |
| `dateTime` | `DateTimeCellRenderer` | Optional `dateFormat` on column. |
| `dateTimeArray` | `DateTimeArrayCellRenderer` | |
| `url` | `UrlCellRenderer` | |
| `labeledUrl` | `LabeledUrlCellRenderer` | `{ url, displayText }`. |
| `multiUrl` | `MultiUrlCellRenderer` | |
| `multiLabeledUrl` | `MultiLabeledUrlCellRenderer` | |
| `array` | `ArrayCellRenderer` | |
| `jsonArray` | `JsonArrayCellRenderer` | |
| `json` | `JSONCellRenderer` | |
| `code` | `CodeCellRenderer` | Column `language`: `yaml` \| `proto` \| `json`. |
| `markdown` | `MarkdownCellRenderer` | |
| `timer` | `TimerCellRenderer` | ISO deadline strings. |
| `label` | `LabelCellRenderer` | Optional `color`, `tooltip`. |
| `enumArray` | `EnumArrayCellRenderer` | Optional `enumOptions`, `colors`. |
| `invalid` | `InvalidCellRenderer` | Fallback for bad values. |

Re-exports for convenience: **`src/table/cells/CellRenderers/index.ts`**.

### Cell shell: wrapper, editor, expand

Most renderers use **`CellWrapper`** (`src/table/cells/CellWrapper/`):

- **Copy** / **edit** / **expand** affordances (when enabled).
- **`CellEditorPortal`** — in-cell editor positioned via portal.
- **`CellExpanderPortal`** — expand dialogs portaled to `document.body` so `position: fixed` overlays are not clipped by the grid.
- **`CellExpander`** — `EXPANDER_TYPE.JSON` (`JSONCellExpander` → `SimpleReadOnlyCodeDialog`) or `EXPANDER_TYPE.DIALOG` (custom `dialog(onClose)` from the renderer).

Editors under **`CellWrapper/CellEditor/components/`**: boolean, code, date/time, markdown modal, multi-select, select, text.

Shared UI in **`src/table/cells/`**: `CopyButton`, `EnumsListDialog`, `LabelListDialog`, `UrlsListDialog`, `NoResults`, `SimpleReadOnlyCodeDialog`, focus/key helpers, etc.

### Shims (`src/table/shims/`)

Lightweight stand-ins for Port UI primitives (`anchor-ui`, `anchor-icons`), **dataTestId**, dates/numbers, **dayjs** setup—so the table bundle stays self-contained.

### Demo app

- **`src/App.tsx`** — `applyThemeCss`, host color scheme, renders **`TypedTableDemo`**.
- **`src/components/TypedTableDemo.tsx`** — example `TypedColumn[]` / `TypedRow[]` wired to **`TypedDataTable`**.

### Optional hooks (not used by the demo UI)

- **`src/hooks/useBlueprints.ts`** — example GET blueprints when a Port token exists.
- **`src/hooks/entitiesSearch.ts`** — example entity search with **`mergePageFilters`** from the SDK.

## Project layout

```
src/
  index.html
  index.tsx                 # QueryClientProvider, mount #plugin-root
  App.tsx
  App.css
  portHostTheme.ts          # theme.mode → color-scheme / rdg class
  types.ts                  # Misc TS interfaces (legacy / shared)
  components/
    TypedTableDemo.tsx      # Sample columns & rows
  hooks/
    useBlueprints.ts
    entitiesSearch.ts
  table/
    index.ts                # Public exports
    TypedDataTable.tsx
    columnTypes.ts
    cellTypeRegistry.tsx
    table.css
    useTableFocusScopeValue.ts
    cells/
      CellRenderers/        # Per-type renderers (see table above)
      CellWrapper/
      CellExpander/
      …                     # dialogs, copy, editors, hooks
    shims/
webpack.config.js
tsconfig.json
package.json
```

## Theming

When embedded, the host sends **`theme`** on **`PLUGIN_DATA`**; call **`applyThemeCss()`** (as in `App.tsx`) so CSS variables apply. `TypedDataTable` uses **`theme.mode`** for **`rdg-dark` / `rdg-light`** on the grid. Without host data, local dev defaults to a light-friendly scheme.

Useful CSS variables (with fallbacks in `table.css` / `App.css`) include `--background-primary`, `--text-high`, `--text-medium`, `--border-low`, and grid-specific classes under `.typed-data-table`.

For **`postMessage`** shapes (`PORT_TOKEN`, `PLUGIN_DATA`, `REQUEST_PORT_TOKEN`), see the **`@port-labs/plugins-sdk`** documentation.
