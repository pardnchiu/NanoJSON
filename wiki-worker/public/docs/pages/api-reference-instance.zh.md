# API 參考：實例成員

本頁列出 `JSONEditor` 實例建構後可用的屬性與方法。

## 屬性

`body`、`editor`、`children` 在資料載入完成後才以非同步方式指定，建構子剛回傳時尚未就緒，見[核心概念](/zh/core-concepts)。

| 成員 | 型別 | 說明 |
|---|---|---|
| `json` | `getter → string` | 序列化目前資料為 4 空格縮排的 JSON 字串；根層無鍵子節點會被忽略，見[序列化](/zh/core-concepts-serialization) |
| `type` | `getter → string` | 根節點型別；目前實作固定回傳 `"object"`，匯入陣列也不會改變 |
| `children` | `JSONEditorNode[]` | 頂層子節點陣列 |
| `body` | `HTMLElement` | 編輯器根 DOM 元素（帶 `pd-json-editor` class） |
| `editor` | `HTMLElement` | 節點容器 DOM 元素（`<section>`） |
| `button` | `Array` | 初始值為 `[]`，目前實作未使用 |

## 方法

| 方法 | 回傳 | 說明 |
|---|---|---|
| `import(data)` | `Promise<void>` | 匯入新資料（`Object` / `File` / URL `string`）並以 `render(true)` 重新渲染，見[資料載入](/zh/core-concepts-data-loading) |
| `export()` | `void` | 下載 `NanoJSON-{timestamp}.json`；根層只有一個無鍵子節點時仍會寫入（與 `json` getter 不同） |
| `reset()` | `void` | 等同 `import({})`；重設後沒有任何節點 |
| `enable()` | `void` | 解除唯讀；移除整棵已渲染 DOM 的 `disabled` 屬性 |
| `disable()` | `void` | 進入唯讀；為整棵已渲染 DOM 加上 `disabled` 屬性，見[唯讀模式](/zh/core-concepts-readonly) |
| `render(isUpdate = false)` | `void` | 重新渲染所有頂層節點；僅當 `isUpdate === true` 且初次渲染已完成時觸發 `Lifecycle.update` |
| `insert()` | `void` | 於根層新增一個空節點（型別 `"string"`）並重新渲染，不觸發 `Lifecycle.update` |

## 範例

初次渲染後讀取 `editor.type`，再以 `import()` 替換資料，`updated` 印出 `editor.json`：

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

## 延伸閱讀

- Constructor 設定參數：[API 參考](/zh/api-reference)
- 節點物件的欄位與方法：[API 參考：JSONEditorNode](/zh/api-reference-node)
