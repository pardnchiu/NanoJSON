# Read-Only Mode

This page explains how the `readonly` config and `enable()` / `disable()` toggle read-only mode, and which controls get disabled.

## How It Works

Read-only is not a flag passed to each node; it batch-toggles the `disabled` attribute across the whole rendered DOM:

| Trigger | Action |
|---|---|
| Config `readonly: true` | After the initial render, sets `body.dataset.readonly = 1` and adds `disabled` to every element matching the selector |
| `editor.disable()` | Same (`JSONEditor.js:178-183`) |
| `editor.enable()` | Sets `body.dataset.readonly = 0` and removes `disabled` from every matching element (`JSONEditor.js:171-176`) |

The selector is `selectorSubNodes` (`src/data.js`): `button:not(.collapsed), textarea, input, select`. Collapse buttons are excluded, so nodes can still be expanded and collapsed while read-only.

## Nodes Rendered Later

When a node re-renders, `keyInput()` and `typeSelect()` read `body.dataset.readonly`, so the key input and type dropdown stay disabled; the other controls (value input, remove and add-child buttons) are rebuilt by `#create()` without `disabled`. If nodes re-render while read-only (for example after a programmatic `import()`), call `disable()` again.

## Hooks

Toggling read-only does not trigger any `Lifecycle` hook.

## Example

Starting read-only; collapse buttons still work, and `enable()` is called after 3 seconds:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    readonly: true,
    json: { name: "NanoJSON", tags: ["json", "editor"] },
    when: {
      rendered: () => setTimeout(() => {
        editor.enable();
        console.log("enable()");
      }, 3000),
    },
  });
</script>
```

## Further Reading

- The `readonly` config and `enable()` / `disable()` signatures: [API Reference](/api-reference)
- How nodes re-render: [Core Concepts](/core-concepts)
