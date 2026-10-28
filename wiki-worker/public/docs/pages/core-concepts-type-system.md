# Type System

This page explains how NanoJSON derives a node's type from a JavaScript value, how each type is edited and serialized, what happens to an existing value on a type switch, and the `null` edge cases.

## Type Derivation

On import, the type is derived at runtime by `getType()` (`src/function/getType.js`):

| JS Value | `getType()` Returns |
|---|---|
| `Array.isArray(v)` is true | `"array"` |
| `typeof v === "object"` (**including `null`**) | `"object"` |
| `typeof v === "boolean"` | `"boolean"` |
| `typeof v === "number"` | `"number"` |
| anything else | `"string"` |

## Per-Type Behavior

| Type | Input | Serialized As | Notes |
|---|---|---|---|
| `string` | `textarea`, multi-line | The raw string | — |
| `number` | `textarea`, placeholder `NUM` | `Number(value)` | Input that can't parse as a number clears the field (except `-` and `.`, so negatives and decimals can be typed); an empty value serializes as `0` |
| `boolean` | `true` / `false` dropdown | `value.toLowerCase() === "true"` | An empty value is set to `"true"` |
| `object` | No value input; shows children | Object | Unlimited nesting |
| `array` | No value input; children shown by index with no `key` input | Array | Same |

## Switching Types

The type dropdown (`src/function/typeSelect.js:25`) offers only `string` / `number` / `boolean` / `array` / `object` — `null` **cannot** be selected manually. On a switch, the existing value is handled per target type (`typeSelect.js:30-51`):

| Switch To | Effect on the Existing Value |
|---|---|
| `object` / `array` | `value` is cleared; if there are no children, one is added automatically (through `#add`, see [Core Concepts](/core-concepts#how-node-settings-are-inherited)) |
| `number` | `parseFloat` on the existing string; cleared if unparseable. `children` are **not** cleared, so switching back to `object` / `array` restores them |
| `string` / `boolean` | `value` and `children` are both cleared |

After a switch, `updateChild()` rebuilds the node's DOM and triggers `Lifecycle.update`, then focus moves to the `value-{id}` element.

## `null` Edge Cases

`getType(null)` returns `"object"` (JavaScript's `typeof null === "object"`), and the two call sites handle it inconsistently:

- **Object child values** (`JSONEditor.js:227-234`): the `value === null` branch assigns `_null` to the node's type, but `_null` is never defined in the source, so this branch throws a `ReferenceError`.
- **Array child items** (`JSONEditor.js:205-209`): no equivalent handling. `getType()` returns `"object"`, but `e != null` is false, so it falls through to the `else` branch and is stored via `String(e)` as the text `"null"`, keeping the default `"string"` type.

The actual results:

| Imported Data | Result |
|---|---|
| `[null]` | Renders a **string** node containing the text `"null"`; serializes back as the string `"null"` |
| `{"a": null}` | Converting the data to nodes throws `ReferenceError: _null is not defined` (`src/model/JSONEditor.js:230`); the editor renders nothing and `rendered` never fires |

If your data may contain `null`, convert it at the application layer (for example, to an empty string) before passing it to NanoJSON.

## Example

One node per type; `[null]` renders as a string node containing `"null"`. Switch a node's type from the dropdown to see how the value changes:

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    collapsed: false,
    json: {
      string: "text",
      number: 42,
      boolean: true,
      object: { key: "value" },
      array: [1, 2],
      nullInArray: [null],
    },
  });
</script>
```

An object value of `null` throws during the initial render; the error appears in the log:

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    json: { a: null },
  });
</script>
```

## Further Reading

- How each type is assembled back into JSON: [Serialization](/core-concepts-serialization)
- The `type` / `value` fields of `JSONEditorNode`: [API Reference: JSONEditorNode](/api-reference-node)
