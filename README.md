# Port Plugin Sample

A sample plugin built with React and TypeScript. The plugin receives context from the Port host via `postMessage` (user, page, params, entity, API base URL), requests a JWT for API calls, and fetches blueprints from the Port API. The build produces a single **self-contained HTML file** (`ui.html`) with all JavaScript and CSS inlined, suitable for embedding in Port or similar plugin hosts.

## Tech stack

- **React 19** + **TypeScript** 5.9
- **TanStack React Query** for API data (blueprints; entity search hook is included but not used in the main UI)
- **Webpack 5** with `InlineChunkHtmlPlugin` (from `react-dev-utils`) to inline JS and CSS into the HTML output
- **PostCSS** (with `postcss-preset-env`) for CSS

## Getting started

### Prerequisites

- Node.js **22+** (this repo targets the Node 22 LTS line; use an [LTS](https://nodejs.org/en/about/previous-releases) release in production)
- Yarn or npm

### API base URL

Port API requests use the **`baseUrl` field** the host sends on `PLUGIN_DATA` (the API origin the iframe should call). Ensure your host includes `baseUrl` when it posts `PLUGIN_DATA`. The blueprints query runs when a token is present—without `baseUrl`, the fetch URL is invalid.

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

- **`dist/ui.html`** — single HTML file with inlined JS and CSS, ready to host or embed in Port.

## How it works

1. **Host communication** — When `window.parent !== window`, the plugin posts `REQUEST_PORT_TOKEN` so the host can reply with `PORT_TOKEN` (JWT). The host may also send `PLUGIN_DATA` (params, page, user, entity, **`baseUrl`**).
2. **UI** — The app greets the user with `firstName` / `lastName` from `PLUGIN_DATA.user`, shows sample copy about the inlined bundle, and renders data cards for page, params, entity, and user via `PluginDataCard`.
3. **Blueprints** — `BlueprintDataCard` uses `useBlueprints`: once a token exists, it calls `{baseUrl}/v1/blueprints` with `Authorization: Bearer <token>`. It shows waiting, loading, error, or empty states as appropriate. The query refetches every **5 minutes**.

**Also in the repo (not wired in `App.tsx`):** `useEntities` posts to `/v1/entities/search`, and `mergeWidgetQueryWithPageQuery` merges widget and page filter rules for search bodies—useful patterns you can plug into your own widgets.

## PostMessage events

The plugin runs inside an iframe. It talks to the Port host via `window.postMessage`. All messages use a `type` field to identify the event.

### Plugin → Host (sent by the plugin)

| Event type           | When                         | Payload | Meaning |
|----------------------|------------------------------|---------|---------|
| `REQUEST_PORT_TOKEN` | On mount (when in iframe)    | `{ type: 'REQUEST_PORT_TOKEN' }` | Asks the host for a JWT so the plugin can call Port APIs. Posted so the host can send the token after the iframe is ready (avoids missing it on React Strict Mode double-mount). |

### Host → Plugin (received by the plugin)

| Event type    | Payload | Meaning |
|---------------|---------|---------|
| `PORT_TOKEN`  | `{ type: 'PORT_TOKEN', token: string }` | JWT from the host. Stored and sent as `Authorization: Bearer <token>` on Port API requests. |
| `PLUGIN_DATA` | `{ type: 'PLUGIN_DATA', params?, page?, user?, entity?, baseUrl? }` | Context from the host. **params** — plugin configuration; **page** — page filters / identifier; **user** — current user; **entity** — entity in context; **baseUrl** — Port API base URL (e.g. `https://api.getport.io`) used for `/v1/blueprints` and related hooks. Omitted fields default where noted in code (`params` / `page` / `user` / `entity` to `{}`, `baseUrl` to unset). |

## Project structure

```
├── src/
│   ├── index.html           # HTML template (includes #plugin-root)
│   ├── index.tsx            # React entry, QueryClientProvider, mounts into #plugin-root
│   ├── App.tsx              # Main app: greeting, PluginDataCard rows, BlueprintDataCard
│   ├── App.css
│   ├── types.ts             # DataCard / PluginDataCard prop types
│   ├── components/
│   │   ├── index.ts
│   │   ├── PluginDataCard.tsx
│   │   ├── BlueprintDataCard.tsx
│   │   └── DataCard/
│   │       ├── index.ts
│   │       ├── DataCard.tsx
│   │       ├── EmptySection.tsx
│   │       └── ErrorSection.tsx
│   ├── hooks/
│   │   ├── usePostMessageData.ts  # PORT_TOKEN + PLUGIN_DATA (+ baseUrl)
│   │   ├── useBlueprints.ts       # GET /v1/blueprints
│   │   └── useEntities.ts         # POST /v1/entities/search (sample hook)
│   └── utils/
│       └── mergeWidgetQueryWithPageQuery.ts  # merge widget + page query rules
├── webpack.config.js
├── tsconfig.json
└── package.json
```

The app mounts into `<div id="plugin-root">` in the template. The production build inlines the compiled bundle into `ui.html`.
