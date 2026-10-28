# Lifecycle Hooks

This page explains how `Lifecycle` (`src/model/Lifecycle.js`) manages the six hooks, the update debounce, and one hook that is not currently wired up anywhere in the source.

## The Six Hooks

`Lifecycle` receives a `when` config object at construction, mapping to six callbacks:

| Hook | Fires | Can return `false` to cancel? |
|---|---|---|
| `beforeRender` | Before the initial render | Yes |
| `rendered` | After the initial render completes | No (always runs) |
| `beforeUpdate` | Before a data update (after the 300ms debounce) | Yes |
| `updated` | After a data update completes | No (always runs) |
| `beforeDestroy` | Before destroy | Yes |
| `destroyed` | After destroy completes | No (always runs) |

Only the three `before*` hooks can cancel the following action by returning `false` (`#beforeAction`, `Lifecycle.js:22-26`); `rendered` / `updated` / `destroyed` always run once their phase completes — there's no cancellation for them.

```javascript
const editor = new JSONEditor({
  id: "editor",
  when: {
    beforeRender: () => {
      // return false to cancel this render
      return true;
    },
    rendered: () => console.log("Render complete"),
    beforeUpdate: () => true,   // return false to cancel this update
    updated: () => console.log("Data updated:", editor.json),
  },
});
```

## `render()`: the Initial Render

After `JSONEditor` finishes construction and mounts the DOM, it calls `lifecycle.render(callback)` exactly once. The sequence:

1. Records `#startAt = Date.now()`
2. Runs `beforeRenderCallback`; if it returns `false`, the method returns immediately — `callback` never runs, and `rendered` never fires
3. `await callback()` (the actual node tree render)
4. Logs `Rendered in {ms}ms.` to the console
5. If `renderedCallback` is set, runs it

## `update()`: the 300ms Debounce

Every node data change (editing a value, switching a type) calls `lifecycle.update(callback)`. It debounces via `setTimeout` paired with `clearTimeout`:

```javascript
async update(cb) {
  clearTimeout(this.#updateTimer);
  this.#updateTimer = setTimeout(async () => {
    // beforeUpdate → callback → updated
  }, 300);
}
```

**As a result, continuous input (e.g. typing character-by-character in a textarea) only fires `beforeUpdate` / `updated` once, 300ms after input stops** — every intermediate call to `update()` resets the timer and cancels the previously scheduled run. If `beforeUpdate` returns `false`, that scheduled update is skipped and `updated` never runs; the next data change still reschedules normally.

## `destroy()`: Not Currently Invoked Automatically

`Lifecycle.destroy(cb)` is fully implemented (running `beforeDestroy` → `cb()` → `destroyed` in sequence), but **nothing in `src/model/JSONEditor.js` currently calls `lifecycle.destroy()`**. This means setting `when.beforeDestroy` / `when.destroyed` will not fire from any of the existing public API operations (`import` / `reset` / `enable` / `disable`). Unless your application obtains the `Lifecycle` instance itself and calls it manually — and there is currently no public accessor, since `Lifecycle` is stored in `JSONEditor`'s private field `#lifecycle` — these two hooks will not run in the current version.

## Example

Each hook prints its name; type continuously into a value and `beforeUpdate` / `updated` fire only once, 300ms after you stop:

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    json: { name: "NanoJSON" },
    when: {
      beforeRender: () => console.log("beforeRender"),
      rendered: () => console.log("rendered"),
      beforeUpdate: () => console.log("beforeUpdate"),
      updated: () => console.log("updated", editor.json),
    },
  });
</script>
```

## Further Reading

- The node tree data model: [Core Concepts](/core-concepts)
- Type derivation and type switching: [Type System](/core-concepts-type-system)
- The constructor's full `when.*` parameter table: [API Reference](/api-reference)
