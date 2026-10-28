# Data Loading

This page explains which data sources NanoJSON accepts, how the initial config and `import()` load data, and what actually happens when loading fails.

## Initial Data Config

The `json` / `file` / `path` config fields specify the initial data. The first non-`null` value of `config.file ?? config.json ?? config.path` is used (`JSONEditor.js:60`), so `file` wins when several are given:

```javascript
// From a JavaScript object
const editor = new JSONEditor({
  id: "editor",
  json: { name: "NanoJSON", version: "1.2.1" },
});

// From a remote URL
const editor = new JSONEditor({
  id: "editor",
  file: "https://example.com/data.json",
});
```

If none is provided, the editor starts with an empty object `{}` and calls `insert()` once to add an empty node.

## Data Sources and Failure Behavior

Every source goes through `getJSON()` (`src/function/getJSON.js`):

| Input | Handling | On Failure |
|---|---|---|
| `null` / `undefined` | Treated as no data | Loads `{}` |
| `File` | `FileReader.readAsText`, then `JSON.parse` | Parse errors log `Failed to parse JSON from file ...` and load `{}` |
| Object or array | Used as is | — |
| `string` (URL) | `fetch`, then `JSON.parse` | Network or parse errors log `Failed to fetch data from ...` and load `{}`; **a non-2xx HTTP status never resolves the Promise** (`getJSON.js:29`), so initialization stalls at loading and `import()` never re-renders |
| Any other type (number, boolean) | Logs `Invalid data [_type]: ...` | Loads `{}` |

Arrays load, but a root-level array is not written back out as an array — see [Serialization](/core-concepts-serialization#importing-an-array).

## Runtime Import: `import()` and `reset()`

`editor.import(data)` accepts the same sources, rebuilds every node through `#jsonToChildren()`, then calls `render(true)`; once the initial render has completed, this triggers `Lifecycle.update` (`beforeUpdate` / `updated` after the 300ms debounce).

`editor.reset()` is equivalent to `import({})`. Unlike initialization, `import()` does not call `insert()` when the result is empty, so after a reset the editor has no nodes until you press "Add" or call `insert()`.

## Built-in Buttons

The footer buttons map to these actions:

| Button | Shown When | Action |
|---|---|---|
| Add | Always | `insert()` |
| Open | `button.import` is truthy | Opens a file picker with `accept=".json"`, then `import(file)` |
| Download | `button.export` is truthy | `export()` after `confirm("Download?")` |
| Reset | `button.reset` is truthy | `import({})` after `confirm("Reset?")` |

## Example

Loading from a URL string (`fetch`, then `JSON.parse`):

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    file: "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/package.json",
  });
</script>
```

## Further Reading

- How loaded data turns into node types: [Type System](/core-concepts-type-system)
- Member signatures for `import()` / `reset()`: [API Reference: Instance Members](/api-reference-instance)
