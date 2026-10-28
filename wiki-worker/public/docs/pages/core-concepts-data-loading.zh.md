# 資料載入

本頁說明 NanoJSON 接受哪些資料來源、初始設定與 `import()` 如何載入資料，以及各種載入失敗時的實際結果。

## 初始資料設定

`json` / `file` / `path` 三個設定欄位可指定初始資料，以 `config.file ?? config.json ?? config.path` 取第一個非 `null` 的值（`JSONEditor.js:60`），因此同時提供時 `file` 優先：

```javascript
// 從 JavaScript 物件載入
const editor = new JSONEditor({
  id: "editor",
  json: { name: "NanoJSON", version: "1.2.1" },
});

// 從遠端 URL 載入
const editor = new JSONEditor({
  id: "editor",
  file: "https://example.com/data.json",
});
```

三者皆未提供時，編輯器以空物件 `{}` 啟動，並自動呼叫一次 `insert()` 新增一個空節點。

## 資料來源與失敗行為

所有來源都經過 `getJSON()`（`src/function/getJSON.js`）：

| 傳入值 | 處理方式 | 失敗時 |
|---|---|---|
| `null` / `undefined` | 視為無資料 | 以 `{}` 載入 |
| `File` | `FileReader.readAsText` 後 `JSON.parse` | 解析失敗印出 `Failed to parse JSON from file ...`，以 `{}` 載入 |
| 物件或陣列 | 直接使用 | — |
| `string`（URL） | `fetch` 後 `JSON.parse` | 網路錯誤或解析失敗印出 `Failed to fetch data from ...`，以 `{}` 載入；**HTTP 狀態非 2xx 時 Promise 永不 resolve**（`getJSON.js:29`），初始化停在載入階段、`import()` 不會重新渲染 |
| 其他型別（數字、布林） | 印出 `Invalid data [_type]: ...` | 以 `{}` 載入 |

陣列可以載入，但根層輸出時不會保留陣列形式，見[序列化](/zh/core-concepts-serialization#匯入陣列時的差異)。

## 執行期匯入：`import()` 與 `reset()`

`editor.import(data)` 接受同一組來源，載入後以 `#jsonToChildren()` 重建全部節點，再呼叫 `render(true)`；初次渲染已完成時會觸發 `Lifecycle.update`（300ms 防抖後執行 `beforeUpdate` / `updated`）。

`editor.reset()` 等同 `import({})`。與初始化不同，`import()` 不會在結果為空時自動 `insert()`，所以重設後編輯器沒有任何節點，需按「新增」或呼叫 `insert()`。

## 內建按鈕

頁尾按鈕對應的動作：

| 按鈕 | 顯示條件 | 動作 |
|---|---|---|
| Add | 一律顯示 | `insert()` |
| Open | `button.import` 為真 | 開啟 `accept=".json"` 的檔案選擇器，選取後 `import(file)` |
| Download | `button.export` 為真 | `confirm("Download?")` 確認後 `export()` |
| Reset | `button.reset` 為真 | `confirm("Reset?")` 確認後 `import({})` |

## 範例

以 URL 字串載入（`fetch` 後 `JSON.parse`）：

```demo
<section id="editor"></section>
<script>
  new JSONEditor({
    id: "editor",
    fill: false,
    file: "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/package.json",
  });
</script>
```

## 延伸閱讀

- 載入後資料如何轉成節點型別：[型別系統](/zh/core-concepts-type-system)
- `import()` / `reset()` 的成員簽章：[API 參考：實例成員](/zh/api-reference-instance)
