# 序列化

本頁說明節點樹如何輸出成 JSON：節點層的 `json` getter、根層的 `editor.json` 與 `editor.export()`，以及兩條根層路徑的差異。

## 節點層：`JSONEditorNode.json`

`JSONEditorNode.json`（getter）遞迴呼叫私有的 `#json()`（`JSONEditorNode.js:157`），依節點型別回傳 JavaScript 值：

| 節點型別 | 回傳 |
|---|---|
| `array` | 子節點 `#json()` 結果組成的陣列 |
| `object` | 以子節點 `key` 為鍵的物件 |
| `boolean` | `value.toLowerCase() === "true"` |
| `number` | `Number(value)` |
| 其他 | `value` 原值 |

`object` 節點組物件時，沒有 `key` 的子節點會被略過；例外是該 `object` 節點本身位於陣列中（`this.parent.type === "array"`），此時無鍵子節點以目前已收集的鍵數作為數字鍵（`JSONEditorNode.js:173`）。同名的 `key` 後者覆蓋前者。

## 根層：`editor.json` 與 `editor.export()`

根層的兩條路徑篩選條件不同：

| 路徑 | 篩選條件（`JSONEditor.js`） | 輸出 |
|---|---|---|
| `editor.json`（getter，第 267-277 行） | 只收 `e.key` 為真的子節點 | 4 空格縮排的 JSON 字串 |
| `editor.export()`（第 289-310 行） | 收 `e.key` 為真，**或** `children.length === 1` 時也收 | 下載檔案 `NanoJSON-{timestamp}.json`，同樣 4 空格縮排 |

兩條路徑都以物件作為根，無鍵子節點寫入時使用鍵 `0`（`result[e.key || 0]`）。

## 匯入陣列時的差異

根節點的 `editor.type` 固定為 `"object"`，匯入的資料若是陣列，根層子節點會是無鍵節點，兩條路徑的結果因此不同：

| 匯入資料 | `editor.json` | `editor.export()` 下載內容 |
|---|---|---|
| `[1]` | `"{}"` | `{"0": 1}` |
| `[1, 2]` | `"{}"` | `{}` |
| `{"a": 1}` | `{"a": 1}` | `{"a": 1}` |

根層陣列不會以陣列形式輸出。需要保留陣列根時，請在傳入前包一層物件（例如 `{ "items": [...] }`）。

## 範例

初次渲染後與每次編輯後印出 `editor.json`：

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

匯入根層陣列：根層子節點沒有 key，因此 `editor.json` 為 `{}`：

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

## 延伸閱讀

- 各型別的輸入與轉換規則：[型別系統](/zh/core-concepts-type-system)
- `json` / `export()` 的成員簽章：[API 參考：實例成員](/zh/api-reference-instance)
