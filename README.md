# Port Plugin Sample (Beta)

A sample plugin built with React and TypeScript. Host context (user, page, params, entity, API base URL, theme) and the Port API JWT come from **`@port-labs/plugins-sdk`**, which bridges `postMessage` with the Port web app. The app fetches blueprints from the Port API and includes an example entity search that uses **`mergePageFilters`**. The build produces a single **self-contained HTML file** (`dist/index.html`) with all JavaScript and CSS inlined, suitable for embedding in Port or similar plugin hosts.

## Tech stack

- **React 19** + **TypeScript** 5.9
- **`@port-labs/plugins-sdk`** — host messaging, `usePortPluginData`, `mergePageFilters`, `applyThemeCss`
- **TanStack React Query** for API data (blueprints; `entitiesSearch` example)
- **Webpack 5** with `InlineChunkHtmlPlugin` (from `react-dev-utils`) to inline JS and CSS into the HTML output
- **PostCSS** (with `postcss-preset-env`) for CSS

## Getting started

### Prerequisites

- Node.js **22+** (this repo targets the Node 22 LTS line; use an [LTS](https://nodejs.org/en/about/previous-releases) release in production)
- Yarn or npm
- **`@port-labs/plugins-sdk`** — install from the registry when published, or point `package.json` at a local build (e.g. `file:../path/to/plugins-sdk`) and run `yarn install`.

### API base URL

Port API requests use **`portApiBaseUrl`** from the SDK (the **`baseUrl`** field the host sends on `PLUGIN_DATA`). Ensure your host includes `baseUrl` when it posts `PLUGIN_DATA`. The blueprints query runs when a token is present—without `baseUrl`, the fetch URL is invalid.

### Install

```bash
yarn install
```

### Development

Run the dev server with hot reload on port 9000:

```bash
yarn dev
```

Open [http://localhost:9000](http://localhost:9000) to preview the plugin UI. The app expects `postMessage` from a Port host (`PLUGIN_DATA`, `PORT_TOKEN`). Standalone, the token and host context are missing until you embed the page or simulate messages from the parent window.

### Build

```bash
yarn build
```

Output is written to `dist/`:

- **`dist/index.html`** — single HTML file with inlined JS and CSS, ready to host or embed in Port.

## How it works

1. **Host communication** — The SDK registers listeners for `PORT_TOKEN` and `PLUGIN_DATA`, and posts `REQUEST_PORT_TOKEN` when embedded in an iframe so the host can deliver a JWT after the iframe is ready.
2. **UI** — `App` uses **`usePortPluginData()`** from `@port-labs/plugins-sdk/react` for `params`, `page`, `user`, `entity`, and calls **`applyThemeCss()`** in a `useEffect` so the host theme applies when `theme.css` updates.
3. **Blueprints** — `BlueprintDataCard` uses `useBlueprints`: once `portToken` exists, it calls `{portApiBaseUrl}/v1/blueprints` with `Authorization: Bearer <token>`. The query refetches every **5 minutes**.
4. **Entity search example** — `entitiesSearch` (in `entitiesSearch.ts`) posts to `/v1/entities/search` and merges the widget query with dashboard page filters via **`mergePageFilters`** from `@port-labs/plugins-sdk`.

See the SDK’s own README for **`subscribe` / `getSnapshot`**, **`initPortPluginMessaging`**, and non-React usage.

## PostMessage events

The plugin runs inside an iframe. The SDK aligns with this protocol:

### Plugin → Host (sent by the SDK)

| Event type           | When                         | Payload | Meaning |
|----------------------|------------------------------|---------|---------|
| `REQUEST_PORT_TOKEN` | When messaging is initialized (iframe) | `{ type: 'REQUEST_PORT_TOKEN' }` | Asks the host for a JWT for Port API calls. |

### Host → Plugin (handled by the SDK)

| Event type    | Payload | Meaning |
|---------------|---------|---------|
| `PORT_TOKEN`  | `{ type: 'PORT_TOKEN', token: string }` | JWT from the host. |
| `PLUGIN_DATA` | `{ type: 'PLUGIN_DATA', params?, page?, user?, entity?, baseUrl?, theme? }` | Context from the host. **`baseUrl`** becomes **`portApiBaseUrl`** in the React hook. |

## Project structure

```
├── src/
│   ├── index.html           # HTML template (includes #plugin-root)
│   ├── index.tsx            # React entry, QueryClientProvider, mounts into #plugin-root
│   ├── App.tsx              # Main app: usePortPluginData, PluginDataCard rows, examples
│   ├── App.css
│   ├── types.ts             # DataCard / PluginDataCard prop types
│   ├── components/
│   │   ├── index.ts
│   │   ├── PluginDataCard.tsx
│   │   ├── BlueprintDataCard.tsx
│   │   ├── EntitiesSearchExample.tsx
│   │   └── DataCard/
│   │       ├── index.ts
│   │       ├── DataCard.tsx
│   │       ├── EmptySection.tsx
│   │       └── ErrorSection.tsx
│   └── hooks/
│       ├── useBlueprints.ts   # GET /v1/blueprints
│       └── entitiesSearch.ts  # POST /v1/entities/search + mergePageFilters
├── webpack.config.js
├── tsconfig.json
└── package.json
```

The app mounts into `<div id="plugin-root">` in the template. The production build inlines the compiled bundle into `dist/index.html`.

## Theming and CSS variables

The host can send a **`theme`** object on **`PLUGIN_DATA`**. The SDK exposes it from **`usePortPluginData()`** along with **`applyThemeCss`**, which injects or clears the theme stylesheet in `document.head` (see the SDK docs for the exact element id).

```tsx
import { useEffect } from 'react';
import { usePortPluginData } from '@port-labs/plugins-sdk/react';

function App() {
  const { applyThemeCss } = usePortPluginData();

  useEffect(() => {
    applyThemeCss();
  }, [applyThemeCss]);
}
```

`App.css` uses theme variables with fallbacks, for example:

```css
body {
  background: rgb(var(--primary, 245, 247, 250));
  color: var(--text-high, #1a1a2e);
}

.plugin-container {
  background: var(--background-primary, #fff);
}

.data-row {
  /* Prefer inset surfaces (e.g. --background-dim-transparent) over --background-contrast so rows stay on the same tonal mode as the card in both light and dark host themes */
  background: var(--background-dim-transparent, rgba(0, 0, 0, 0.04));
  border-color: var(--border-medium, #e2e8f0);
}
```

Common variables you can reuse include (non‑exhaustive):

- `--background-primary`: main surface/background color
- `--background-dim` / `--background-dim-transparent`: softer backgrounds and cards (good for inset rows on a card)
- `--background-contrast`: high‑contrast surface (can invert between light/dark host themes—inset rows in this sample use `--background-dim-transparent` instead)
- `--text-high` / `--text-medium` / `--text-low`: primary, secondary, and subtle text
- `--border-medium` / `--border-contrast-medium`: border colors
- `--primary`: RGB triple for primary color, used via `rgb(var(--primary))`

The full set is defined in the CSS string the host sends in **`theme.css`**.
