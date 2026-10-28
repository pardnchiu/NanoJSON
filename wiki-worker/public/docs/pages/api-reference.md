# API Reference

This page lists every constructor config option of `JSONEditor` (`src/model`).

## Exports

| Build | How to Get `JSONEditor` |
|---|---|
| UMD (`dist/NanoJSON.js`) | Global `window.JSONEditor` |
| ES Module (`dist/NanoJSON.esm.js`) | `import { JSONEditor } from ".../NanoJSON.esm.js"` |

`JSONEditor` is the only exported class; `JSONEditorNode` and `Lifecycle` are not exported, and node instances are reachable only through `editor.children`.

## Constructor

```javascript
new JSONEditor(config)
```

If `config` is not an object, it logs `Failed to load config.` and returns.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Id of the DOM element to mount into; its content is replaced. Omit to create a new `<section>` (not attached to the page) |
| `title` | `string` | `""` | Editor title rendered in `<header>` |
| `description` | `string` | `""` | Editor description rendered in `<header>`; no `<header>` is rendered when both `title` and `description` are empty |
| `fill` | `boolean` | `true` | Sets `data-fill="1"` (or `"0"`) to control whether the editor fills its container |
| `readonly` | `boolean` | `false` | Start in read-only mode; see [Read-Only Mode](/core-concepts-readonly) |
| `collapsed` | `boolean` | `true` | Initial collapsed state for nodes created from initial data, `import()`, and `insert()`; children added manually inside a nested node don't get it — see [Core Concepts](/core-concepts#how-node-settings-are-inherited) |
| `confirmKeyRemove` | `boolean` | `true` | Whether to show `confirm()` before removing a node; same scope as `collapsed` |
| `css` | `string` | `https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.1.7/dist/NanoJSON.css` | Custom CSS path; the default is used when missing or empty |
| `file` | `File \| string` | — | Initial data source (File object or URL string) |
| `json` | `object \| Array` | `{}` | Initial data as a JavaScript object or array |
| `path` | `string` | — | URL string source; the first non-`null` of `file ?? json ?? path` is used — see [Data Loading](/core-concepts-data-loading) |
| `button.import` | `boolean` | `true` | Show the Open button and its hidden file input |
| `button.export` | `boolean` | `true` | Show the Download button |
| `button.reset` | `boolean` | `true` | Show the Reset button |
| `when.beforeRender` | `() => boolean \| void` | — | See [Lifecycle Hooks](/lifecycle-hooks) |
| `when.rendered` | `() => void` | — | Same |
| `when.beforeUpdate` | `() => boolean \| void` | — | Same |
| `when.updated` | `() => void` | — | Same |
| `when.beforeDestroy` | `() => boolean \| void` | — | Same (currently never invoked automatically) |
| `when.destroyed` | `() => void` | — | Same (currently never invoked automatically) |

If `button` is not an object, all three buttons are shown; keys missing from the object count as `true`.

## Example

Header, button visibility, and node settings come from the constructor config:

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    title: "NanoJSON",
    description: "Configured from the constructor",
    collapsed: false,
    confirmKeyRemove: false,
    button: { import: false, reset: false },
    json: { name: "NanoJSON", tags: ["json", "editor"] },
  });
</script>
```

## Further Reading

- Properties and methods available after construction: [API Reference: Instance Members](/api-reference-instance)
- Fields and methods of node objects: [API Reference: JSONEditorNode](/api-reference-node)
