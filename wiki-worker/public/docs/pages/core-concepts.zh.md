# 核心概念

本頁說明 NanoJSON 的兩個核心物件：根控制器 `JSONEditor` 與遞迴節點 `JSONEditorNode`，以及兩者如何組成可即時編輯的 DOM 樹。

## JSONEditor：根控制器

`JSONEditor`（`src/model/JSONEditor.js`）是唯一的公開入口，以 `window.JSONEditor` 匯出。建構子先同步執行：

1. `config` 不是物件時印出 `Failed to load config.` 並結束，實例不可用
2. 依 `config.css` 注入樣式表（`loadCSS`）；未提供或為空字串時使用預設 CDN 樣式

接著由非同步的 `#init()`（`JSONEditor.js:33`）完成其餘步驟：

1. 建立 `Lifecycle` 實例並掛上 `when.*` 回呼
2. `await getJSON(...)` 載入初始資料（見[資料載入](/zh/core-concepts-data-loading)）
3. 以 `#jsonToChildren()` 將資料遞迴轉換為 `JSONEditorNode` 陣列
4. 掛載至 `config.id` 指定的既有元素（以 `replaceChildren` 取代其內容），或建立新的 `<section class="pd-json-editor">`（`JSONEditor.js:142-149`）
5. 若 `children.length < 1`，自動呼叫一次 `insert()` 新增一個空節點（`JSONEditor.js:153-155`）
6. 透過 `lifecycle.render()` 執行初次渲染，並在 `readonly` 為真時停用所有輸入元件

因為第 2 步會 `await`，`editor.body`、`editor.children` 在建構子回傳當下尚未就緒；需要存取它們時，請在 `when.beforeRender` / `when.rendered` 內進行。

## JSONEditorNode：遞迴節點

`JSONEditorNode`（`src/model/JSONEditorNode.js`）代表樹中的單一鍵值對或陣列項目，持有 `key` / `type` / `value` / `children` / `collapsed`，以及一個 64 字元的隨機 `id`（`randomKey()`），用於組成 `value-{id}`、`key-{id}` 等 DOM id。

每個節點的 DOM 由私有方法 `#create()` 局部渲染並快取於私有欄位 `#dom`；重新建立時以 `replaceChild` 換掉舊的 DOM。新增（`#add`）與移除（`#remove`）子節點時，只替換受影響的子樹，不重繪整棵樹。

## 節點設定的繼承差異

`collapsed` 與 `confirmKeyRemove` 兩個設定，並非所有節點都會拿到：

| 節點建立途徑 | `collapsed` | `confirmKeyRemove` |
|---|---|---|
| 初始資料、`import()`（`#jsonToChildren`） | 取 `config.collapsed`，預設 `true` | 取 `config.confirmKeyRemove`，預設 `true` |
| 根層「新增」按鈕、`insert()` | 同上 | 同上 |
| 節點內的子節點新增按鈕、`addChild()`、型別切換為 `object` / `array` 時自動新增（`#add`，`JSONEditorNode.js:111-116`） | 類別預設值 `false` | 未傳入，值為 `undefined`，移除時**不會**跳出 `confirm()` |

也就是說，在巢狀節點中手動新增的子節點一律展開，且刪除時不經確認，與 `confirmKeyRemove: true` 的設定無關。

## 範例

初始節點預設收合，移除時會跳出確認；展開 `profile`、在其中新增子節點再移除，可看到不經 `confirm()` 直接移除：

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

## 延伸閱讀

- 型別如何推導、切換型別時值如何變化：[型別系統](/zh/core-concepts-type-system)
- 節點樹如何輸出成 JSON：[序列化](/zh/core-concepts-serialization)
- 更新如何觸發、鉤子何時執行：[生命週期鉤子](/zh/lifecycle-hooks)
