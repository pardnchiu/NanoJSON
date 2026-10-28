# API 參考：JSONEditorNode

本頁列出 `JSONEditorNode` 的公開欄位與方法。節點由 `JSONEditor` 內部建立，類別本身不對外匯出，透過 `editor.children` 與各節點的 `children` 存取。

## 屬性

| 屬性 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `id` | `string` | 64 字元隨機字串 | 用於 `key-{id}`、`value-{id}` 等 DOM id |
| `key` | `string` | `""` | 節點鍵名；陣列子節點為空字串。編輯時會去除換行與前後空白 |
| `type` | `string` | `"string"` | `"string"` / `"number"` / `"boolean"` / `"object"` / `"array"`，見[型別系統](/zh/core-concepts-type-system) |
| `value` | `string` | `""` | 以字串保存的原始節點值（僅非容器型別有效） |
| `parent` | `JSONEditor \| JSONEditorNode` | — | 父節點參照 |
| `children` | `JSONEditorNode[]` | `[]` | 子節點陣列（`object` / `array` 型別使用） |
| `collapsed` | `boolean` | `false` | 目前折疊狀態；由 `JSONEditor` 建立的節點以 `config.collapsed`（預設 `true`）初始化 |

## 方法

| 方法 | 說明 |
|---|---|
| `render()` | 渲染並回傳此節點的 DOM 元素（呼叫私有 `#create()`） |
| `addChild()` | 新增一個空子節點、插入 DOM 並觸發 `Lifecycle.update`；新節點不繼承 `collapsed` / `confirmKeyRemove`，見[核心概念](/zh/core-concepts#節點設定的繼承差異) |
| `updateChild()` | 重建此節點 DOM 並觸發 `Lifecycle.update` |
| `setCollapsed()` | 切換折疊狀態並重建此節點 DOM，不觸發 `Lifecycle.update` |
| `json`（getter） | 回傳此節點對應的 JavaScript 值（遞迴），見[序列化](/zh/core-concepts-serialization) |

## 範例

遞迴走訪 `editor.children`，印出每個節點的 `key` / `type` / `value`，最後印出第一個節點的 `json`：

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

## 延伸閱讀

- Constructor 設定參數：[API 參考](/zh/api-reference)
- 編輯器實例的屬性與方法：[API 參考：實例成員](/zh/api-reference-instance)
