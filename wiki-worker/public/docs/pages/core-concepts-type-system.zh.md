# 型別系統

本頁說明 NanoJSON 如何從 JavaScript 值推導節點型別、各型別的輸入與輸出行為、切換型別時既有值的變化，以及 `null` 的邊界情況。

## 型別推導

匯入資料時，型別由 `getType()`（`src/function/getType.js`）依 JavaScript 執行期型別推導：

| JS 值 | `getType()` 回傳 |
|---|---|
| `Array.isArray(v)` 為真 | `"array"` |
| `typeof v === "object"`（**含 `null`**） | `"object"` |
| `typeof v === "boolean"` | `"boolean"` |
| `typeof v === "number"` | `"number"` |
| 其他 | `"string"` |

## 各型別的行為

| 型別 | 輸入元件 | 序列化結果 | 備註 |
|---|---|---|---|
| `string` | `textarea`，支援多行 | 原字串 | — |
| `number` | `textarea`，placeholder `NUM` | `Number(value)` | 輸入無法解析為數字時整欄清空（`-`、`.` 例外，方便輸入負數與小數）；空值序列化為 `0` |
| `boolean` | `true` / `false` 下拉選單 | `value.toLowerCase() === "true"` | 值為空時自動設為 `"true"` |
| `object` | 無值輸入框，顯示子節點 | 物件 | 支援無限巢狀 |
| `array` | 無值輸入框，子節點以索引顯示、無 `key` 輸入框 | 陣列 | 同上 |

## 切換型別

型別下拉選單（`src/function/typeSelect.js:25`）只提供 `string` / `number` / `boolean` / `array` / `object` 五個選項，**不能**手動切換成 `null`。切換時依目標型別處理既有值（`typeSelect.js:30-51`）：

| 切換為 | 對既有值的處理 |
|---|---|
| `object` / `array` | `value` 清空；若沒有子節點，自動新增一個（經 `#add`，見[核心概念](/zh/core-concepts#節點設定的繼承差異)） |
| `number` | 對既有字串 `parseFloat`；無法解析則清空。`children` **不清除**，切回 `object` / `array` 時原子節點仍在 |
| `string` / `boolean` | `value` 清空、`children` 清空 |

切換後呼叫 `updateChild()` 重建該節點 DOM 並觸發 `Lifecycle.update`，再把焦點移到 `value-{id}` 元素。

## `null` 的邊界情況

`getType(null)` 回傳 `"object"`（JavaScript 的 `typeof null === "object"`），兩個呼叫點的處理方式不一致：

- **物件的子鍵值**（`JSONEditor.js:227-234`）：`value === null` 分支把 `_null` 指派給節點型別，但原始碼中沒有定義 `_null`，因此此分支會拋出 `ReferenceError`。
- **陣列的子項目**（`JSONEditor.js:205-209`）：沒有對應處理。`getType()` 回傳 `"object"`，但 `e != null` 為假，落入 `else` 分支以 `String(e)` 存成文字 `"null"`，節點型別維持預設的 `"string"`。

兩者的實際結果：

| 匯入資料 | 結果 |
|---|---|
| `[null]` | 渲染為內容是文字 `"null"` 的 **string** 節點；序列化後變成字串 `"null"` |
| `{"a": null}` | 將資料轉換為節點時拋出 `ReferenceError: _null is not defined`（`src/model/JSONEditor.js:230`），編輯器不渲染任何內容，`rendered` 不會觸發 |

若資料可能含 `null`，需在傳入 NanoJSON 前於應用層先轉換（例如改為空字串）。

## 範例

每種型別各一個節點；`[null]` 會渲染成內容為 `"null"` 的字串節點。可從下拉選單切換型別觀察值的變化：

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

物件值為 `null` 時，初次渲染會拋出錯誤，錯誤訊息顯示於 log：

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

## 延伸閱讀

- 各型別如何組回 JSON：[序列化](/zh/core-concepts-serialization)
- `JSONEditorNode` 的 `type` / `value` 欄位：[API 參考：JSONEditorNode](/zh/api-reference-node)
