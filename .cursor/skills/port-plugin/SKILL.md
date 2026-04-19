---
name: port-plugin
description: >-
  Build, refactor, or review Port.io dashboard plugins that run in an iframe and ship as one self-contained HTML file. Use whenever the user mentions Port plugins, @port-labs/plugins-sdk, port-plugin-sample, plugin widgets, PLUGIN_DATA, mergePageFilters, applyThemeCss, entity search from a plugin, Port API calls or OpenAPI routes from a plugin, single-file webpack inline bundles, Port CSP/connect-src limits, or uploading plugins—even if they only say “widget” or “iframe” in a Port context. Also use for debugging fetch failures, theme variables, or Trusted Types inside a Port plugin.
---

# Port plugin development

Port plugins are single HTML artifacts that talk to the Port host over `postMessage` and call the Port API with a JWT the host provides. Prefer matching Port’s look-and-feel via the SDK theme, avoid persisting secrets, and respect CSP and the one-file size limit.

When you work with a **person**, keep a **conversational** tone: plain language, room for them to correct you, and short explanations of *why* something matters. Reserve dense bullet lists for **fixed platform rules** (CSP, artifact size, SDK facts) where precision beats chatty prose.

## Before you write code: talk it through first

Treat intake as a **short design conversation**, not a form. **Ask one or two questions at a time**, use ordinary language, and **echo back** what you understood (“So on an entity page you want a compact table of…”) before you ask the next thing. Skip topics the user already spelled out; do not paste a long questionnaire in a single message.

If it is still unclear **what should appear** in the widget (layout, components, metrics, actions, copy), ask in your own words what they want people to **see and do** there—**do not** invent a full UI without their say-so.

**Topics to weave in as the chat unfolds** (order flexibly):

- **What to show** — Density, main vs secondary content, labels, empty states, and any interactions (purely read-only vs actions), only where the brief is vague.
- **Where it runs in Port** — Dashboard widget (`page`, optional `page.pageFilters`) vs **entity page** (`entity` from `usePortPluginData()` usually available) vs both; if they are unsure, offer a simple either/or and how behavior differs when `entity` is missing.
- **Data** — What catalog or API information backs the UI (blueprints, entity search, one entity’s fields, relations, etc.).
- **Reusable configuration** — Which identifiers or property paths should become **plugin custom params** instead of literals in code.
- **Dashboard filters** — Whether results should follow the dashboard’s filters when relevant (`mergePageFilters`).
- **Rough edges** — Loading, no data, API errors, missing token or `baseUrl`.
- **Secrets** — Gently confirm they are not asking you to bake in API keys or persist tokens in the browser.

Framing helps: e.g. “To hook this up to the right SDK fields…” or “So the build matches how Port will host it…” rather than a block of demands.

If they have not mentioned theming, you can say you will default to **Port styling** via `applyThemeCss()` and host CSS variables (see “Look-and-feel”) unless they want something different.

## Default implementation path (align with port-plugin-sample)

Use or mirror [port-plugin-sample](https://github.com/port-labs/port-plugin-sample):

- **Runtime**: React + TypeScript; mount into `<div id="plugin-root">` from `src/index.html`.
- **SDK (React)**: `usePortPluginData()` from `@port-labs/plugins-sdk/react` for `params`, `page`, `user`, `entity`, `portToken`, `portApiBaseUrl`, and `applyThemeCss`.
- **Build**: Webpack 5 with `InlineChunkHtmlPlugin` so production output is **one** `dist/index.html` with inlined JS and CSS. Dev server listens on **port 9000** in the sample.
- **Server state**: The sample uses **TanStack React Query** for Port API queries (optional pattern, not required by the SDK).
- **Node**: Sample targets **Node 22+** (`engines` in sample `package.json`).

### Host messaging and API calls

- The host sends `PORT_TOKEN` and `PLUGIN_DATA`. `PLUGIN_DATA` may include `baseUrl`; the SDK exposes it as **`portApiBaseUrl`**. Without a valid `portApiBaseUrl`, `fetch` URLs to the Port API are wrong—handle missing `baseUrl` explicitly in UX.
- Call the Port API with `Authorization: Bearer ${portToken}` and URLs under `portApiBaseUrl` (for example `GET ${portApiBaseUrl}/v1/blueprints`, `POST ${portApiBaseUrl}/v1/entities/search`).
- **Shape and correctness of API calls** — Use the official [Port API](https://docs.port.io/api-reference/port-api) (OpenAPI) for paths, HTTP methods, query parameters, request bodies, and response fields. Prefer copying route segments and payload structure from the docs rather than guessing. Keep request bodies within documented limits (for example the API’s **1 MiB** body size cap where it applies). Always use the host-provided `portApiBaseUrl` as the origin—do not hard-code regional base URLs such as `https://api.port.io` in plugin code; the iframe host supplies the correct base for the environment.
- **`connect-src` allows only `'self'` and `https://*.getport.io` / `https://*.port.io`** (see CSP below). Do not rely on third-party analytics or arbitrary REST hosts from the plugin.

### Entity search and dashboard filters

When posting `entities/search`, merge the widget query with dashboard page filters using **`mergePageFilters`** from `@port-labs/plugins-sdk`, passing the blueprint metadata and `page.pageFilters` as in the sample’s `entitiesSearch` hook. Use SDK types such as `EntitiesQuery` and `Blueprint` where applicable.

### Sample vs production patterns

`EntitiesSearchExample` in the sample uses the **first** blueprint returned from the API for demonstration. In real plugins, **do not** assume “first blueprint”; drive blueprint and rules from **params** or explicit user configuration.

## Look-and-feel (Port theme)

Call **`applyThemeCss()`** whenever theme data can change (for example in a `useEffect` that depends on `applyThemeCss` from `usePortPluginData()`), so the host’s `theme.css` applies.

Style with **CSS variables** supplied by the host, with sensible fallbacks—for example:

- Surfaces: `--background-primary`, `--background-dim`, `--background-dim-transparent` (prefer dim transparent for inset rows so light/dark modes stay coherent)
- Text: `--text-high`, `--text-medium`, `--text-low`
- Borders: `--border-medium`, `--border-contrast-medium`
- Primary accent: `rgb(var(--primary, …))` (triple form from host)

Avoid hard-coded colors that fight the host theme unless the user explicitly wants a fixed brand palette.

## Security and storage

- **Never** embed Port tokens, API keys, or customer secrets in plugin source or in query strings logged to analytics.
- **Do not** persist `portToken`, refresh tokens, or sensitive payloads in `localStorage` or `sessionStorage`. Keep credentials in memory for the session; expect the host to re-send a token when needed.
- Treat `params`, `page`, and `entity` as potentially sensitive—only display what the UX requires.

## Reusability

- Replace hard-coded blueprint identifiers, entity identifiers, property keys, and search rules with **plugin custom parameters** (or configuration the host passes in `params`) and document those params for operators.
- Prefer small, composable components and shared hooks so similar plugins can reuse the same patterns.

## CSP and platform limits (Port)

These constraints shape what the plugin can load and where it can connect. Design accordingly so the first build works inside Port’s iframe.

### Content Security Policy (summary)

- **Scripts and styles** load only from the **plugin origin**, with **`'unsafe-inline'`** allowed so a single HTML file with inlined JavaScript and CSS behaves as expected.
- **`default-src`**: **`'self'`**, **`https://*.getport.io`**, and **`https://*.port.io`**. That covers `<img>`, `<video>`, `<audio>`, `<source>`, **`@font-face`**, and similar, so asset URLs on those origins load, and every other host stays blocked. You upload **one HTML file** to Port, so you can **embed** images, fonts, and media (inline or `data:` URLs) **or** reference media served under the allowed Port hosts.
- **`object-src 'none'`** blocks `<object>` and `<embed>`, including common patterns for embedding external players or documents.
- **`frame-src 'none'`** blocks `<iframe>`, so you cannot embed another site’s page, player, or document inside the plugin UI.
- **`connect-src`** limits scripted network APIs (`fetch`, `XMLHttpRequest`, WebSockets, and similar) to **`'self'`**, **`https://*.getport.io`**, and **`https://*.port.io`**. Calls to other hosts (for example third-party analytics or public REST APIs) are blocked.
- **`frame-ancestors`** allows the Port web app (on **`*.getport.io`** and **`*.port.io`**) to embed your plugin; arbitrary third-party sites cannot frame it.
- **`require-trusted-types-for 'script'`** enforces [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) for script-related DOM sinks. If a library assigns raw strings where the browser expects a trusted type, you may need to adjust usage or dependencies.

### Artifact limitations

- Each plugin artifact is **one self-contained HTML file**; multi-file bundles or separate asset uploads are not supported.
- The uploaded file must be **10 MB** or smaller.

### Practical implications for development

- Bundle fonts and small images inline or as `data:` URLs when they are not on `*.getport.io` / `*.port.io`.
- Avoid `iframe`, `object`, and `embed` for external content.
- Use only Port API endpoints under `portApiBaseUrl` (which fall under allowed hosts) for authenticated calls.

## Build and ship

1. Run production build (`yarn build` or `npm run build` in a project modeled on the sample).
2. Confirm **`dist/index.html`** exists and is the inlined artifact.
3. Check file size **≤ 10 MB**.
4. **Upload with the Port plugins CLI** (`@port-labs/port-plugins-cli`). Read the current CLI usage on [npm](https://www.npmjs.com/package/@port-labs/port-plugins-cli) and [Port plugins documentation](https://docs.port.io/customize-pages-dashboards-and-plugins/plugins/) before suggesting exact commands or flags—do not invent subcommands.

## References

- Port API (OpenAPI, routes and request/response details): [https://docs.port.io/api-reference/port-api](https://docs.port.io/api-reference/port-api)
- Port plugins: [https://docs.port.io/customize-pages-dashboards-and-plugins/plugins/](https://docs.port.io/customize-pages-dashboards-and-plugins/plugins/)
- Sample repo: [https://github.com/port-labs/port-plugin-sample](https://github.com/port-labs/port-plugin-sample)
- SDK: [https://www.npmjs.com/package/@port-labs/plugins-sdk](https://www.npmjs.com/package/@port-labs/plugins-sdk)
- CLI: [https://www.npmjs.com/package/@port-labs/port-plugins-cli](https://www.npmjs.com/package/@port-labs/port-plugins-cli)
