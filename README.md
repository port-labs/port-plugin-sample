# Port Plugin Sample

A sample plugin built with React and TypeScript. The plugin receives context from the Port host via `postMessage` (user, page, params, entity), requests a JWT token for API calls, and fetches blueprints from the Port API. The build produces a single **self-contained HTML file** (`ui.html`) with all JavaScript and CSS inlined, suitable for embedding in Port or similar plugin hosts.

## Tech stack

- **React 18** + **TypeScript**
- **TanStack React Query** for API data (e.g. blueprints)
- **Webpack 5** with `InlineChunkHtmlPlugin` (from `react-dev-utils`) to inline JS and CSS into the HTML output
- **PostCSS** (with `postcss-preset-env`) for CSS
- **dotenv** for `BASE_URL` (Port API base URL)

## Getting started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn (or npm)

### Environment

Create a `.env` file with your Port API base URL (used for the blueprints API):

```bash
BASE_URL= #port api url
```

### Install

```bash
yarn install
```

### Development

Run the dev server with hot reload on port 9000:

```bash
yarn dev
```

Open [http://localhost:9000](http://localhost:9000) to preview the plugin UI. The app expects to receive `postMessage` events from a Port host (e.g. `PLUGIN_DATA`, `PORT_TOKEN`); when run standalone, those will be empty until embedded.

### Build

Produce a production build:

```bash
yarn build
```

Output is written to `dist/`:

- **`dist/ui.html`** — single HTML file with inlined JS and CSS, ready to host or embed in Port.

## How it works

1. **Host communication** — On load, the plugin posts `REQUEST_PORT_TOKEN` to its parent window. The host responds with `PORT_TOKEN` (JWT) and may send `PLUGIN_DATA` (params, page, user, entity).
2. **UI** — The app greets the user and shows data cards for page, params, entity, and user from `PLUGIN_DATA`.
3. **Port API** — Using the token, it calls the Port API (e.g. `BASE_URL/v1/blueprints`) via `useBlueprints` and displays the result in a Blueprints card.

## PostMessage events

The plugin runs inside an iframe. It talks to the Port host via `window.postMessage`. All messages use a `type` field to identify the event.

### Plugin → Host (sent by the plugin)

| Event type             | When        | Payload | Meaning |
|------------------------|-------------|---------|--------|
| `REQUEST_PORT_TOKEN`   | On mount    | `{ type: 'REQUEST_PORT_TOKEN' }` | Asks the host for a JWT so the plugin can call Port APIs (e.g. `/v1/blueprints`). Sent only when `window.parent !== window` (i.e. inside an iframe). |

### Host → Plugin (received by the plugin)

| Event type   | Payload | Meaning |
|--------------|---------|--------|
| `PORT_TOKEN` | `{ type: 'PORT_TOKEN', token: string }` | JWT from the host. The plugin stores it and sends it as `Authorization: Bearer <token>` on Port API requests. |
| `PLUGIN_DATA`| `{ type: 'PLUGIN_DATA', params?, page?, user?, entity? }` | Context from the host. **params** — plugin configuration/inputs; **page** — current pagefilters and identifier; **user** — current user data; **entity** — the Port entity being viewed (on specific entity page). All fields are optional and default to `{}`. |

## Project structure

```
├── src/
│   ├── index.html           # HTML template (includes #plugin-root)
│   ├── index.tsx            # React entry, QueryClientProvider, mounts into #plugin-root
│   ├── App.tsx              # Main app: usePostMessageData, data cards + BlueprintDataCard
│   ├── App.css              # App styles
│   ├── types.ts             # DataCardProps, PluginDataCardProps, etc.
│   ├── components/
│   │   ├── index.ts
│   │   ├── PluginDataCard.tsx   # Renders key/value data from plugin context
│   │   ├── BlueprintDataCard.tsx # Fetches and displays blueprints via useBlueprints
│   │   └── DataCard/
│   │       ├── DataCard.tsx
│   │       ├── EmptySection.tsx
│   │       └── ErrorSection.tsx
│   └── hooks/
│       ├── usePostMessageData.ts # Listens for PORT_TOKEN + PLUGIN_DATA
│       └── useBlueprints.ts      # TanStack Query hook for /v1/blueprints
├── webpack.config.js
├── tsconfig.json
└── package.json
```

The app mounts into a `<div id="plugin-root">` in the template. The production build inlines the compiled bundle into the HTML so the plugin is delivered as one file.

## License

Private / unlicensed — adjust as needed for your use.
