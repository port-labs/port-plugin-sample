# Port Plugin Sample

A minimal sample plugin built with React and TypeScript. The build produces a single **self-contained HTML file** (`ui.html`) with all JavaScript and CSS inlined, suitable for embedding in Port or similar plugin hosts.

## Tech stack

- **React 18** + **TypeScript**
- **Webpack 5** with `InlineChunkHtmlPlugin` (from `react-dev-utils`) to inline JS and CSS into the HTML output
- **PostCSS** (with `postcss-preset-env`) for CSS

## Getting started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn (or npm)

### Install

```bash
yarn install
```

### Development

Run the dev server with hot reload on port 9000:

```bash
yarn dev
```

Open [http://localhost:9000](http://localhost:9000) to preview the plugin UI.

### Build

Produce a production build:

```bash
yarn build
```

Output is written to `dist/`:

- **`dist/ui.html`** — single HTML file with inlined JS and CSS, ready to host or embed.

## Project structure

```
├── src/
│   ├── index.html    # HTML template (includes #plugin-root)
│   ├── index.tsx     # React entry, mounts into #plugin-root
│   ├── App.tsx       # Main app component
│   └── App.css       # App styles
├── webpack.config.js # Webpack config + InlineChunkHtmlPlugin
├── tsconfig.json
└── package.json
```

The app mounts into a `<div id="plugin-root">` in the template. The production build inlines the compiled `ui` chunk into the HTML so the plugin is delivered as one file.

## License

Private / unlicensed — adjust as needed for your use.
