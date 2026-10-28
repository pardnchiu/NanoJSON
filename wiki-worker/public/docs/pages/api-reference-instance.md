# API Reference: Instance Members

This page lists the properties and methods available on a `JSONEditor` instance after construction.

## Properties

`body`, `editor`, and `children` are assigned asynchronously after data loading and are not ready when the constructor returns — see [Core Concepts](/core-concepts).

| Member | Type | Description |
|---|---|---|
| `json` | `getter → string` | Serializes the current data to a 4-space-indented JSON string; keyless root children are dropped — see [Serialization](/core-concepts-serialization) |
| `type` | `getter → string` | Root node type; the current implementation always returns `"object"`, even after importing an array |
| `children` | `JSONEditorNode[]` | Top-level child nodes |
| `body` | `HTMLElement` | Editor root DOM element (with the `pd-json-editor` class) |
| `editor` | `HTMLElement` | Node container DOM element (`<section>`) |
| `button` | `Array` | Initialized to `[]`; unused by the current implementation |

## Methods

| Method | Returns | Description |
|---|---|---|
| `import(data)` | `Promise<void>` | Imports new data (`Object` / `File` / URL `string`) and re-renders with `render(true)` — see [Data Loading](/core-concepts-data-loading) |
| `export()` | `void` | Downloads `NanoJSON-{timestamp}.json`; a single keyless root child is still written (unlike the `json` getter) |
| `reset()` | `void` | Equivalent to `import({})`; leaves the editor with no nodes |
| `enable()` | `void` | Leaves read-only mode; removes `disabled` across the rendered DOM |
| `disable()` | `void` | Enters read-only mode; adds `disabled` across the rendered DOM — see [Read-Only Mode](/core-concepts-readonly) |
| `render(isUpdate = false)` | `void` | Re-renders all top-level nodes; triggers `Lifecycle.update` only when `isUpdate === true` and the initial render has completed |
| `insert()` | `void` | Appends an empty root-level node (type `"string"`) and re-renders without triggering `Lifecycle.update` |

## Example

`editor.type` is read after the initial render, then `import()` replaces the data and `updated` prints `editor.json`:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    json: { name: "NanoJSON" },
    when: {
      rendered: () => {
        console.log("type:", editor.type);
        editor.import({ name: "NanoJSON", version: "1.2.1", tags: ["json"] });
      },
      updated: () => console.log(editor.json),
    },
  });
</script>
```

## Further Reading

- Constructor config options: [API Reference](/api-reference)
- Fields and methods of node objects: [API Reference: JSONEditorNode](/api-reference-node)
