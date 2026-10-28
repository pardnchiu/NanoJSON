# Getting Started

This page covers installing NanoJSON and mounting your first editor instance.

## Prerequisites

- A browser with ES2022 class private fields and methods (`#field`, `#method()`), such as Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Browser only: the library uses `window`, `document`, `FileReader`, `fetch`, and `confirm()`, and has no runtime dependency
- Node.js 18+ (only for building from source)

## Installation

### npm

```bash
npm install @pardnchiu/nanojson
```

### CDN (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson/dist/NanoJSON.js"></script>
```

### ES Module

```javascript
import { JSONEditor } from "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson/dist/NanoJSON.esm.js";
```

CSS is injected automatically when `JSONEditor` is constructed (`loadCSS`, in `src/data.js`); to use a custom stylesheet, pass a `css` path in the config to override the default CDN URL.

## First Mount

Prepare a mount point in HTML and initialize the editor with an `id`:

```html
<div id="editor"></div>

<script>
  const editor = new JSONEditor({ id: "editor" });
</script>
```

If `id` is omitted, `JSONEditor` creates a new `<section class="pd-json-editor">` element (available as `editor.body`) but does not attach it to the page — you need to `appendChild` it yourself. `editor.body` is assigned asynchronously after data loading, so it is still `undefined` right after the constructor returns; attach it inside `when.beforeRender` or `when.rendered`:

```javascript
const editor = new JSONEditor({
  json: { name: "NanoJSON" },
  when: {
    rendered: () => document.querySelector("#host").appendChild(editor.body),
  },
});
```

## Example

Mounting into `#editor` with initial data:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    json: { name: "NanoJSON", version: "1.2.1" },
  });
</script>
```

## Next Steps

- Load initial data from an object, a File, or a URL: [Data Loading](/core-concepts-data-loading)
- Understand the `JSONEditor` / `JSONEditorNode` data model: [Core Concepts](/core-concepts)
- Learn how render and update hooks fire: [Lifecycle Hooks](/lifecycle-hooks)
- Look up the full constructor config and method signatures: [API Reference](/api-reference)
