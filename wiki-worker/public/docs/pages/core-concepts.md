# Core Concepts

This page explains NanoJSON's two core objects — the root controller `JSONEditor` and the recursive node `JSONEditorNode` — and how they form a live, editable DOM tree.

## JSONEditor: the Root Controller

`JSONEditor` (`src/model/JSONEditor.js`) is the sole public entry point, exported as `window.JSONEditor`. The constructor first runs synchronously:

1. If `config` is not an object, it logs `Failed to load config.` and returns; the instance is unusable
2. Injects a stylesheet based on `config.css` (`loadCSS`); falls back to the default CDN stylesheet when missing or empty

The asynchronous `#init()` (`JSONEditor.js:33`) then completes the rest:

1. Creates a `Lifecycle` instance wired to the `when.*` callbacks
2. `await getJSON(...)` loads the initial data (see [Data Loading](/core-concepts-data-loading))
3. Recursively converts the data into a `JSONEditorNode` array via `#jsonToChildren()`
4. Mounts into the existing element referenced by `config.id` (replacing its content with `replaceChildren`), or creates a new `<section class="pd-json-editor">` (`JSONEditor.js:142-149`)
5. If `children.length < 1`, calls `insert()` once to add an empty node (`JSONEditor.js:153-155`)
6. Runs the initial render through `lifecycle.render()`, disabling every input when `readonly` is true

Because step 2 is awaited, `editor.body` and `editor.children` are not ready when the constructor returns; access them inside `when.beforeRender` / `when.rendered`.

## JSONEditorNode: the Recursive Node

`JSONEditorNode` (`src/model/JSONEditorNode.js`) represents a single key/value pair or array item, holding `key` / `type` / `value` / `children` / `collapsed`, plus a random 64-character `id` (`randomKey()`) used to build DOM ids such as `value-{id}` and `key-{id}`.

Each node's DOM is rendered locally by the private `#create()` and cached in the private field `#dom`; re-creating it swaps the old DOM out with `replaceChild`. Adding (`#add`) or removing (`#remove`) a child only replaces the affected subtree instead of re-rendering the whole tree.

## How Node Settings Are Inherited

Not every node receives the `collapsed` and `confirmKeyRemove` settings:

| How the node is created | `collapsed` | `confirmKeyRemove` |
|---|---|---|
| Initial data, `import()` (`#jsonToChildren`) | Taken from `config.collapsed`, default `true` | Taken from `config.confirmKeyRemove`, default `true` |
| Root-level "Add" button, `insert()` | Same | Same |
| A node's add-child button, `addChild()`, or the auto-added child when switching to `object` / `array` (`#add`, `JSONEditorNode.js:111-116`) | Class default `false` | Not passed, so `undefined` — removal does **not** show `confirm()` |

In other words, children added manually inside a nested node are always expanded and are removed without confirmation, regardless of `confirmKeyRemove: true`.

## Example

Initial nodes start collapsed and ask for confirmation on removal; expand `profile`, add a child inside it, and remove that child to see it removed without `confirm()`:

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    collapsed: true,
    confirmKeyRemove: true,
    json: { profile: { name: "NanoJSON" } },
  });
</script>
```

## Further Reading

- How types are derived and how values change on a type switch: [Type System](/core-concepts-type-system)
- How the node tree is written back out as JSON: [Serialization](/core-concepts-serialization)
- How updates fire and when hooks run: [Lifecycle Hooks](/lifecycle-hooks)
