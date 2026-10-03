# nanojson - Documentation

> Back to [README](../README.md)

## Prerequisites

- A browser with ES2022 support (class private fields `#field`), such as Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Browser only: depends on `window`, `document`, `FileReader`, `fetch`, and `confirm()`; Node.js and SSR are not supported
- Node.js 18+ (only for building from source)

## Installation

### npm

```bash
npm install @pardnchiu/nanojson
```

### CDN (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/dist/NanoJSON.js" defer></script>
```

Access it through the global `window.JSONEditor` after loading.

### ES Module

```javascript
import { JSONEditor } from "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/dist/NanoJSON.esm.js";
```

### Build from Source

```bash
git clone https://github.com/pardnchiu/nanojson.git
cd nanojson
npm install
npm run build:once
```

This produces `dist/NanoJSON.js` (UMD), `dist/NanoJSON.esm.js` (ESM), and `dist/NanoJSON.debug.js` (unminified). `npm run sass:library` compiles the styles from `src/sass/` into `dist/NanoJSON.css`.

## Usage

### Basic: Mount into an Existing Element

```html
<div id="editor" style="position: relative; height: 480px"></div>

<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/dist/NanoJSON.js"></script>
<script>
  const editor = new JSONEditor({
    id: "editor",
    json: { name: "NanoJSON", version: "1.2.1" },
  });
</script>
```

`fill` defaults to `true`, so the editor is absolutely positioned to fill its container; give the container positioning and a height. Set `fill: false` to lay it out by content height instead.

Styles are injected automatically on construction from `https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.1.7/dist/NanoJSON.css` by default; pass `css` to use another version or a custom stylesheet.

### Basic: Without an `id`

Without `id`, the editor creates a new `<section class="pd-json-editor">` but does not attach it to the page. `editor.body` is assigned only after data loading, so attach it inside a hook:

```javascript
const editor = new JSONEditor({
  json: { name: "NanoJSON" },
  fill: false,
  when: {
    rendered: () => document.querySelector("#host").appendChild(editor.body),
  },
});
```

### Advanced: Load from a URL with Error Handling

`getJSON()` never resolves on a non-2xx HTTP status, so initialization stalls at loading and no hook fires. In production, fetch the data yourself, check the status, and pass an object:

```javascript
async function mountFromURL(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();

    // A root-level array cannot be written back as an array, so wrap it
    const json = Array.isArray(data) ? { items: data } : data;

    return new JSONEditor({ id: "editor", json });
  } catch (err) {
    console.error(`Failed to load: ${err.message}`);
    return new JSONEditor({ id: "editor", json: {} });
  } finally {
    clearTimeout(timer);
  }
}

mountFromURL("https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/package.json");
```

### Advanced: Validate and Sync with Hooks

A `before*` hook must return `false` **synchronously** to cancel; a returned Promise (such as from an `async` function) always lets the action through.

```javascript
const STORAGE_KEY = "nanojson-draft";

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

const editor = new JSONEditor({
  id: "editor",
  title: "Draft",
  json: loadDraft(),
  confirmKeyRemove: false,
  button: { import: true, export: true, reset: false },
  when: {
    beforeUpdate: () => {
      // Skip this sync while any root node has an empty key
      return editor.children.every((node) => node.key !== "");
    },
    updated: () => {
      try {
        localStorage.setItem(STORAGE_KEY, editor.json);
      } catch (err) {
        console.error(`Failed to save: ${err.message}`);
      }
    },
  },
});
```

Continuous input fires `beforeUpdate` / `updated` only once, 300ms after input stops.

### Advanced: Programmatic Control

```javascript
const editor = new JSONEditor({
  id: "editor",
  readonly: true,
  json: { mode: "view" },
  when: {
    rendered: async () => {
      await editor.import({ mode: "edit", tags: ["json"] });

      // Value fields re-rendered by import() lack disabled, so reapply read-only
      editor.disable();

      document.querySelector("#unlock").onclick = () => editor.enable();
      document.querySelector("#save").onclick = () => editor.export();
    },
  },
});
```

### Known Limitations

| Case | Actual Behavior | Recommendation |
|---|---|---|
| Root-level array (e.g. `[1, 2]`) | `editor.json` returns `"{}"`; `export()` writes `{"0": ...}` only for a single element | Wrap it in an object first, e.g. `{ items: [...] }` |
| Object value of `null` (e.g. `{"a": null}`) | The initial render throws `ReferenceError: _null is not defined` and `rendered` never fires | Convert to an empty string or drop the field before passing it in |
| Array item of `null` (e.g. `[null]`) | Becomes a string node containing `"null"` | Same as above |
| `when.beforeDestroy` / `when.destroyed` | No public API currently triggers them | Do not rely on these hooks |
| Global side effect | The library defines a `_` method on `String.prototype` as its DOM builder | Avoid other code on the page using the same property |

## API Reference

### Exports

| Build | How to Get It |
|---|---|
| UMD (`dist/NanoJSON.js`) | Global `window.JSONEditor` |
| ES Module (`dist/NanoJSON.esm.js`) | `import { JSONEditor } from ".../NanoJSON.esm.js"` |

`JSONEditorNode` and `Lifecycle` are not exported; nodes are reachable only through `editor.children`.

### `new JSONEditor(config)`

When `config` is not an object, it logs `Failed to load config.` and returns an unusable instance.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Id of the mount element, whose content is replaced; omit to create an unattached `<section>` |
| `title` | `string` | `""` | Title rendered in `<header>` |
| `description` | `string` | `""` | Description; no `<header>` is rendered when both `title` and `description` are empty |
| `fill` | `boolean` | `true` | Sets `data-fill`; `true` absolutely positions the editor to fill its container |
| `readonly` | `boolean` | `false` | Start in read-only mode |
| `collapsed` | `boolean` | `true` | Initial collapsed state of nodes created from initial data, `import()`, and `insert()` |
| `confirmKeyRemove` | `boolean` | `true` | Whether to show `confirm()` before removing a node; same scope as `collapsed` |
| `css` | `string` | v1.1.7 CDN stylesheet | Custom stylesheet path; the default is used for an empty or non-string value |
| `file` | `File \| string` | — | Initial data source |
| `json` | `object` | — | Initial data |
| `path` | `string` | — | URL source; the first non-`null` of `file ?? json ?? path` is used, falling back to `{}` |
| `button.import` | `boolean` | `true` | Show the Open button |
| `button.export` | `boolean` | `true` | Show the Download button |
| `button.reset` | `boolean` | `true` | Show the Reset button |
| `when` | `object` | `{}` | Lifecycle hooks, see below |

Children added manually inside a node (the add-child button, or the child auto-added when switching to `object` / `array`) do not receive `collapsed` or `confirmKeyRemove`: they always start expanded and are removed without confirmation.

### Instance Properties

`body`, `editor`, and `children` are assigned after data loading and are not available when the constructor returns.

| Member | Type | Description |
|---|---|---|
| `json` | `getter → string` | Serializes the current data with 4-space indentation, skipping keyless root nodes |
| `type` | `getter → string` | Root type, always `"object"` |
| `children` | `JSONEditorNode[]` | Root-level nodes |
| `body` | `HTMLElement` | Editor root element (with the `pd-json-editor` class) |
| `editor` | `HTMLElement` | Node container `<section>` |

### Instance Methods

| Method | Returns | Description |
|---|---|---|
| `import(data)` | `Promise<void>` | Replaces the data from an object, `File`, or URL string and re-renders; fires the update hooks once the initial render has completed |
| `export()` | `void` | Downloads `NanoJSON-{timestamp}.json`; a single root node is written even without a key |
| `reset()` | `void` | Equivalent to `import({})`; leaves no nodes |
| `enable()` | `void` | Leaves read-only mode |
| `disable()` | `void` | Enters read-only mode; collapse buttons are unaffected |
| `render(isUpdate = false)` | `void` | Re-renders all root nodes; fires the update hooks when `isUpdate` is `true` and the initial render has completed |
| `insert()` | `void` | Appends an empty root-level string node without firing the update hooks |

### `JSONEditorNode`

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Random 64-character string used in DOM ids such as `key-{id}` and `value-{id}` |
| `key` | `string` | Key name; `""` for array items |
| `type` | `string` | `"string"` / `"number"` / `"boolean"` / `"object"` / `"array"`; `"null"` comes only from import |
| `value` | `string` | Raw value (non-container types) |
| `parent` | `JSONEditor \| JSONEditorNode` | Parent node |
| `children` | `JSONEditorNode[]` | Child nodes |
| `collapsed` | `boolean` | Current collapsed state |
| `json` | `getter` | Recursively returns this node's JavaScript value; `number` goes through `Number()`, `boolean` compares against `"true"` |

| Method | Description |
|---|---|
| `render()` | Creates and returns this node's DOM |
| `addChild()` | Appends an empty child and fires the update hooks |
| `updateChild()` | Rebuilds this node's DOM and fires the update hooks |
| `setCollapsed()` | Toggles the collapsed state and rebuilds the DOM without firing the update hooks |

### Lifecycle Hooks (`when`)

| Hook | Fires | Return `false` to Cancel |
|---|---|---|
| `beforeRender` | Before the initial render | Yes |
| `rendered` | After the initial render | No |
| `beforeUpdate` | After the 300ms debounce, before an update | Yes |
| `updated` | After an update | No |
| `beforeDestroy` | Before destroy (currently never fired) | Yes |
| `destroyed` | After destroy (currently never fired) | No |

Operations that fire the update hooks: editing a key or value, switching a type, adding or removing a child, and `import()` / `reset()` after the initial render.

### Type Derivation and Switching

| Imported Value | Derived Type |
|---|---|
| Array | `array` |
| Object | `object` |
| `boolean` | `boolean` |
| `number` | `number` |
| Anything else | `string` |

| Switch To | Effect on the Existing Value |
|---|---|
| `object` / `array` | Clears `value`; adds one child when there are none |
| `number` | Runs `parseFloat` on the existing string and clears it on failure; keeps `children` |
| `string` / `boolean` | Clears both `value` and `children` |

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
