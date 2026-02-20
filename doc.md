# NanoJSON - Documentation

> Back to [README](./README.md)

## Prerequisites

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Node.js 18+ (development build only; no runtime dependency)

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

> CSS injection is automatic on initialization. To use a custom stylesheet, pass a `css` path in the config to override the default CDN URL.

## Usage

### Basic

Prepare a mount point in HTML and initialize the editor with an `id`:

```html
<div id="editor"></div>

<script>
  const editor = new JSONEditor({ id: "editor" });
</script>
```

### Loading Initial Data

Three data source formats are supported: JavaScript object, File object, and URL string.

```javascript
// From an object
const editor = new JSONEditor({
  id: "editor",
  json: { name: "NanoJSON", version: "1.1.7" },
});

// From a URL
const editor = new JSONEditor({
  id: "editor",
  file: "https://example.com/data.json",
});
```

### Advanced: Full Config with Lifecycle Hooks

```javascript
const editor = new JSONEditor({
  id: "editor",
  title: "Config Editor",
  description: "Edit application settings",
  fill: true,
  readonly: false,
  collapsed: true,
  confirmKeyRemove: true,
  css: "/path/to/custom.css",   // optional; omit to use CDN default
  json: { theme: "dark", lang: "en" },
  button: {
    import: true,
    export: true,
    reset: true,
  },
  when: {
    beforeRender: () => {
      console.log("About to render");
      // Return false to cancel rendering
    },
    rendered: () => {
      console.log("Render complete");
    },
    beforeUpdate: () => {
      console.log("About to update");
      // Return false to cancel this update (fires after 300ms debounce)
    },
    updated: () => {
      const json = editor.json;
      console.log("Data updated:", json);
    },
    beforeDestroy: () => {
      console.log("About to destroy");
    },
    destroyed: () => {
      console.log("Destroyed");
    },
  },
});
```

### Dynamic Operations

```javascript
// Get current JSON string (indented)
const jsonString = editor.json;

// Programmatically import new data
await editor.import({ key: "value" });
await editor.import(fileObject);        // File object
await editor.import("https://...");    // URL string

// Download current JSON as a file (with confirmation dialog)
editor.export();

// Reset to an empty object
editor.reset();

// Toggle read-only mode
editor.disable();   // enable read-only
editor.enable();    // disable read-only (restore editing)
```

## API Reference

### JSONEditor

#### Constructor

```javascript
new JSONEditor(config)
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | No | — | Target DOM element id to mount into; omit to create a new `<section>` |
| `title` | `string` | No | `""` | Editor title rendered in `<header>` |
| `description` | `string` | No | `""` | Editor description rendered in `<header>` |
| `fill` | `boolean` | No | `true` | Whether to set `data-fill="1"` to expand to fill the container |
| `readonly` | `boolean` | No | `false` | Whether to start in read-only mode |
| `collapsed` | `boolean` | No | `true` | Initial collapsed state of all nodes |
| `confirmKeyRemove` | `boolean` | No | `true` | Whether to show a confirmation dialog before removing a node |
| `css` | `string` | No | CDN URL | Custom CSS path to override the default injected stylesheet |
| `json` | `object` | No | `{}` | Initial JSON data as a JavaScript object |
| `file` | `File \| string` | No | — | Initial data source (File object or URL string); alternative to `json` |
| `path` | `string` | No | — | Alias for `file` when passing a URL string |
| `button.import` | `boolean` | No | `true` | Show the import button |
| `button.export` | `boolean` | No | `true` | Show the export button |
| `button.reset` | `boolean` | No | `true` | Show the reset button |
| `when.beforeRender` | `() => boolean?` | No | — | Hook before rendering; return `false` to cancel |
| `when.rendered` | `() => void` | No | — | Hook after rendering completes |
| `when.beforeUpdate` | `() => boolean?` | No | — | Hook before update (300ms debounce); return `false` to cancel |
| `when.updated` | `() => void` | No | — | Hook after update completes |
| `when.beforeDestroy` | `() => boolean?` | No | — | Hook before destroy; return `false` to cancel |
| `when.destroyed` | `() => void` | No | — | Hook after destroy completes |

#### Instance Properties and Methods

| Member | Type | Description |
|--------|------|-------------|
| `json` | `getter → string` | Get current full JSON (4-space indentation) |
| `type` | `getter → string` | Root node type (`"object"` or `"array"`) |
| `children` | `JSONEditorNode[]` | Array of top-level child nodes |
| `body` | `HTMLElement` | Editor root DOM element |
| `editor` | `HTMLElement` | Node container DOM element (`<section>`) |
| `import(data)` | `async method` | Import new data (Object / File / URL) and re-render |
| `export()` | `method` | Download formatted JSON; filename includes a timestamp |
| `reset()` | `method` | Clear and reset to an empty object |
| `enable()` | `method` | Disable read-only mode; restore all input controls |
| `disable()` | `method` | Enable read-only mode; disable all input controls |
| `render(isUpdate?)` | `method` | Re-render all nodes; triggers `updated` hook when `isUpdate=true` |
| `insert()` | `method` | Append an empty node at the root level |

---

### JSONEditorNode

Nodes are managed internally by `JSONEditor` and rarely need direct access. The following public members are available for read operations.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Node key name (set for object children; empty for array children) |
| `type` | `string` | Node value type: `string` / `number` / `boolean` / `object` / `array` / `null` |
| `value` | `string` | Raw node value (valid for non-container types) |
| `parent` | `JSONEditor \| JSONEditorNode` | Reference to parent node |
| `children` | `JSONEditorNode[]` | Child node array (valid for `object` and `array` types) |
| `collapsed` | `boolean` | Current collapsed state |

#### Methods

| Method | Description |
|--------|-------------|
| `render()` | Render and return the DOM element for this node |
| `addChild()` | Append a new child node and update the DOM |
| `updateChild()` | Rebuild the DOM and trigger the lifecycle update |
| `setCollapsed()` | Toggle collapsed state and re-render |
| `json` (getter) | Return the corresponding JavaScript value for this node (recursive) |

---

### Supported JSON Types

| Type | JavaScript Value | Description |
|------|-----------------|-------------|
| `string` | `String` | Text value; supports multi-line input |
| `number` | `Number` | Numeric value; automatically converted to JavaScript Number |
| `boolean` | `Boolean` | `true` / `false` via dropdown selection |
| `object` | `Object` | Key-value container; supports unlimited nesting |
| `array` | `Array` | Index container; child nodes display numeric indices |
| `null` | `null` | Null value; rendered as `null` |

***

©️ 2025 [邱敬幃 Pardn Chiu](https://linkedin.com/in/pardnchiu)
