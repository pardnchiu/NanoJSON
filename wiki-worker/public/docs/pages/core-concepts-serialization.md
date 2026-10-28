# Serialization

This page explains how the node tree is written back out as JSON: the node-level `json` getter, the root-level `editor.json` and `editor.export()`, and how the two root paths differ.

## Node Level: `JSONEditorNode.json`

`JSONEditorNode.json` (a getter) recursively calls the private `#json()` (`JSONEditorNode.js:157`), returning a JavaScript value per node type:

| Node Type | Returns |
|---|---|
| `array` | An array of each child's `#json()` result |
| `object` | An object keyed by each child's `key` |
| `boolean` | `value.toLowerCase() === "true"` |
| `number` | `Number(value)` |
| anything else | The raw `value` |

When an `object` node builds its object, keyless children are skipped — except when that `object` node itself sits inside an array (`this.parent.type === "array"`), in which case a keyless child gets the current count of collected keys as a numeric key (`JSONEditorNode.js:173`). For duplicate `key`s, the later one wins.

## Root Level: `editor.json` vs. `editor.export()`

The two root-level paths filter differently:

| Path | Filter Condition (`JSONEditor.js`) | Output |
|---|---|---|
| `editor.json` (getter, lines 267-277) | Only children where `e.key` is truthy | A 4-space-indented JSON string |
| `editor.export()` (lines 289-310) | Children where `e.key` is truthy, **or** any child when `children.length === 1` | Downloads `NanoJSON-{timestamp}.json`, also 4-space-indented |

Both paths build an object as the root; a keyless child is written under the key `0` (`result[e.key || 0]`).

## Importing an Array

The root's `editor.type` is always `"object"`. When the imported data is an array, the root-level children are keyless, so the two paths diverge:

| Imported Data | `editor.json` | `editor.export()` Download |
|---|---|---|
| `[1]` | `"{}"` | `{"0": 1}` |
| `[1, 2]` | `"{}"` | `{}` |
| `{"a": 1}` | `{"a": 1}` | `{"a": 1}` |

A root-level array is never written out as an array. To keep an array root, wrap it in an object before passing it in (for example `{ "items": [...] }`).

## Example

`editor.json` is printed after the initial render and after every edit:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    collapsed: false,
    json: { count: 1, list: [1, "two", true], nested: { ok: false } },
    when: {
      rendered: () => console.log(editor.json),
      updated: () => console.log(editor.json),
    },
  });
</script>
```

Importing a root-level array: the root children are keyless, so `editor.json` is `{}`:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    json: [1, 2],
    when: {
      rendered: () => console.log("editor.json:", editor.json),
    },
  });
</script>
```

## Further Reading

- Input and conversion rules per type: [Type System](/core-concepts-type-system)
- Member signatures for `json` / `export()`: [API Reference: Instance Members](/api-reference-instance)
