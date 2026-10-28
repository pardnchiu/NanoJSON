# 生命週期鉤子

本頁說明 `Lifecycle`（`src/model/Lifecycle.js`）如何管理六個鉤子、更新事件的防抖機制，以及一個目前程式碼中尚未被觸發的鉤子。

## 六個鉤子

`Lifecycle` 建構時接收 `when` 設定物件，對應六個回呼：

| 鉤子 | 觸發時機 | 可否回傳 `false` 取消 |
|---|---|---|
| `beforeRender` | 初次渲染前 | 是 |
| `rendered` | 初次渲染完成後 | 否（一定執行） |
| `beforeUpdate` | 資料更新前（300ms 防抖後） | 是 |
| `updated` | 資料更新完成後 | 否（一定執行） |
| `beforeDestroy` | 銷毀前 | 是 |
| `destroyed` | 銷毀完成後 | 否（一定執行） |

僅 `before*` 三個鉤子可透過回傳 `false` 取消後續動作（`#beforeAction`，`Lifecycle.js:22-26`）；`rendered` / `updated` / `destroyed` 一律在對應階段完成後執行，沒有取消機制。

```javascript
const editor = new JSONEditor({
  id: "editor",
  when: {
    beforeRender: () => {
      // 回傳 false 可取消這次渲染
      return true;
    },
    rendered: () => console.log("渲染完成"),
    beforeUpdate: () => true,   // 回傳 false 可取消這次更新
    updated: () => console.log("資料已更新：", editor.json),
  },
});
```

## `render()`：初次渲染

`JSONEditor` 建構完成、DOM 掛載後，會呼叫 `lifecycle.render(callback)` 一次。流程：

1. 記錄 `#startAt = Date.now()`
2. 執行 `beforeRenderCallback`；若回傳 `false`，直接 `return`，不執行 `callback`，也不會觸發 `rendered`
3. `await callback()`（實際渲染節點樹）
4. 於 console 印出 `Rendered in {ms}ms.`
5. 若有 `renderedCallback`，執行之

## `update()`：300ms 防抖更新

每次節點資料變動（如編輯值、切換型別）都會呼叫 `lifecycle.update(callback)`。實作以 `setTimeout` 搭配 `clearTimeout` 達成防抖：

```javascript
async update(cb) {
  clearTimeout(this.#updateTimer);
  this.#updateTimer = setTimeout(async () => {
    // beforeUpdate → callback → updated
  }, 300);
}
```

**因此連續輸入（例如在 textarea 中逐字打字）只會在停止輸入 300ms 後觸發一次 `beforeUpdate` / `updated`**，中途每次呼叫 `update()` 都會重設計時器並取消前一次排程。若 `beforeUpdate` 回傳 `false`，本次排定的更新會被跳過，`updated` 也不會執行；下一次資料變動仍會重新排程。

## `destroy()`：目前未被自動呼叫

`Lifecycle.destroy(cb)` 已完整實作（依序執行 `beforeDestroy` → `cb()` → `destroyed`），但**目前 `src/model/JSONEditor.js` 沒有任何地方呼叫 `lifecycle.destroy()`**。也就是說，設定 `when.beforeDestroy` / `when.destroyed` 目前不會在既有 API（`import` / `reset` / `enable` / `disable`）的任何操作下被觸發；除非使用者的應用程式自行取得 `Lifecycle` 實例並手動呼叫（目前 `Lifecycle` 實例為 `JSONEditor` 的私有欄位 `#lifecycle`，無公開存取途徑），否則這兩個鉤子在現行版本中不會執行。

## 範例

每個鉤子印出自己的名稱；在值欄位連續輸入，`beforeUpdate` / `updated` 只會在停止輸入 300ms 後觸發一次：

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

## 延伸閱讀

- 節點樹的資料模型：[核心概念](/zh/core-concepts)
- 型別推導與型別切換：[型別系統](/zh/core-concepts-type-system)
- Constructor 的 `when.*` 完整參數表：[API 參考](/zh/api-reference)
