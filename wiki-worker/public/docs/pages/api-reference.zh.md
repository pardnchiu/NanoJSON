# API 參考

本頁列出 `JSONEditor`（`src/model`）constructor 的完整設定參數。

## 匯出方式

| 載入方式 | 取得 `JSONEditor` |
|---|---|
| UMD（`dist/NanoJSON.js`） | 全域 `window.JSONEditor` |
| ES Module（`dist/NanoJSON.esm.js`） | `import { JSONEditor } from ".../NanoJSON.esm.js"` |

`JSONEditor` 是唯一匯出的類別；`JSONEditorNode` 與 `Lifecycle` 不對外匯出，只能經由 `editor.children` 取得節點實例。

## Constructor

```javascript
new JSONEditor(config)
```

`config` 不是物件時印出 `Failed to load config.` 並結束。

| 參數 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `id` | `string` | — | 掛載目標的 DOM 元素 id，其內容會被取代；省略則建立新的 `<section>`（不會自動掛載到頁面） |
| `title` | `string` | `""` | 於 `<header>` 中顯示的編輯器標題 |
| `description` | `string` | `""` | 於 `<header>` 中顯示的編輯器描述；`title` 與 `description` 皆為空時不輸出 `<header>` |
| `fill` | `boolean` | `true` | 設定 `data-fill="1"`（或 `"0"`），控制是否填滿容器 |
| `readonly` | `boolean` | `false` | 以唯讀模式啟動，見[唯讀模式](/zh/core-concepts-readonly) |
| `collapsed` | `boolean` | `true` | 由初始資料、`import()`、`insert()` 建立的節點之初始折疊狀態；巢狀內手動新增的子節點不套用，見[核心概念](/zh/core-concepts#節點設定的繼承差異) |
| `confirmKeyRemove` | `boolean` | `true` | 移除節點前是否顯示 `confirm()`；套用範圍同 `collapsed` |
| `css` | `string` | `https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.1.7/dist/NanoJSON.css` | 自訂 CSS 路徑；未提供或空字串時使用預設值 |
| `file` | `File \| string` | — | 初始資料來源（File 物件或 URL 字串） |
| `json` | `object \| Array` | `{}` | 以 JavaScript 物件或陣列表示的初始資料 |
| `path` | `string` | — | URL 字串來源；三者以 `file ?? json ?? path` 取第一個非 `null` 值，見[資料載入](/zh/core-concepts-data-loading) |
| `button.import` | `boolean` | `true` | 顯示 Open 按鈕與隱藏的檔案輸入框 |
| `button.export` | `boolean` | `true` | 顯示 Download 按鈕 |
| `button.reset` | `boolean` | `true` | 顯示 Reset 按鈕 |
| `when.beforeRender` | `() => boolean \| void` | — | 見[生命週期鉤子](/zh/lifecycle-hooks) |
| `when.rendered` | `() => void` | — | 同上 |
| `when.beforeUpdate` | `() => boolean \| void` | — | 同上 |
| `when.updated` | `() => void` | — | 同上 |
| `when.beforeDestroy` | `() => boolean \| void` | — | 同上（目前未被自動呼叫） |
| `when.destroyed` | `() => void` | — | 同上（目前未被自動呼叫） |

`button` 不是物件時三個按鈕全部顯示；物件中缺少的鍵視為 `true`。

## 範例

標題、按鈕顯示與節點設定皆由 constructor config 決定：

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    title: "NanoJSON",
    description: "Configured from the constructor",
    collapsed: false,
    confirmKeyRemove: false,
    button: { import: false, reset: false },
    json: { name: "NanoJSON", tags: ["json", "editor"] },
  });
</script>
```

## 延伸閱讀

- 建構後可用的屬性與方法：[API 參考：實例成員](/zh/api-reference-instance)
- 節點物件的欄位與方法：[API 參考：JSONEditorNode](/zh/api-reference-node)
