# API Reference: JSONEditorNode

This page lists the public fields and methods of `JSONEditorNode`. Nodes are created internally by `JSONEditor`; the class itself is not exported, so access nodes through `editor.children` and each node's `children`.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | Random 64-character string | Used in DOM ids such as `key-{id}` and `value-{id}` |
| `key` | `string` | `""` | Node key name; empty string for array children. Newlines and surrounding whitespace are stripped while editing |
| `type` | `string` | `"string"` | `"string"` / `"number"` / `"boolean"` / `"object"` / `"array"` — see [Type System](/core-concepts-type-system) |
| `value` | `string` | `""` | Raw node value as a string (non-container types only) |
| `parent` | `JSONEditor \| JSONEditorNode` | — | Reference to the parent node |
| `children` | `JSONEditorNode[]` | `[]` | Child nodes (used by `object` / `array` types) |
| `collapsed` | `boolean` | `false` | Current collapsed state; nodes created by `JSONEditor` start from `config.collapsed` (default `true`) |

## Methods

| Method | Description |
|---|---|
| `render()` | Renders and returns this node's DOM element (calls the private `#create()`) |
| `addChild()` | Appends an empty child, inserts it into the DOM, and triggers `Lifecycle.update`; the new node does not inherit `collapsed` / `confirmKeyRemove` — see [Core Concepts](/core-concepts#how-node-settings-are-inherited) |
| `updateChild()` | Rebuilds this node's DOM and triggers `Lifecycle.update` |
| `setCollapsed()` | Toggles the collapsed state and rebuilds this node's DOM without triggering `Lifecycle.update` |
| `json` (getter) | Returns this node's JavaScript value (recursive) — see [Serialization](/core-concepts-serialization) |

## Example

Walking `editor.children` recursively and printing each node's `key` / `type` / `value`, then the first node's `json`:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    json: { user: { name: "Pardn", langs: ["Go", "JS"] } },
    when: {
      rendered: () => {
        const walk = (nodes, depth) => nodes.forEach((n) => {
          console.log("  ".repeat(depth) + (n.key || "-"), n.type, n.value);
          walk(n.children, depth + 1);
        });
        walk(editor.children, 0);
        console.log(editor.children[0].json);
      },
    },
  });
</script>
```

## Further Reading

- Constructor config options: [API Reference](/api-reference)
- Properties and methods of the editor instance: [API Reference: Instance Members](/api-reference-instance)
