# 快速開始

本頁說明如何安裝 NanoJSON 並掛載第一個編輯器實例。

## 前置需求

- 支援 ES2022 class 私有欄位與私有方法（`#field`、`#method()`）的瀏覽器，例如 Chrome 90+、Firefox 90+、Safari 15+、Edge 90+
- 僅於瀏覽器執行：函式庫使用 `window`、`document`、`FileReader`、`fetch` 與 `confirm()`，執行期無任何依賴
- Node.js 18+（僅從原始碼建置時需要）

## 安裝

### npm

```bash
npm install @pardnchiu/nanojson
```

### CDN（UMD）

```html
<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson/dist/NanoJSON.js"></script>
```

### ES Module

```javascript
import { JSONEditor } from "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson/dist/NanoJSON.esm.js";
```

CSS 於 `JSONEditor` 建構時自動注入（`loadCSS`，見 `src/data.js`）；若需自訂樣式，於設定中傳入 `css` 路徑即可覆蓋預設的 CDN URL。

## 第一次掛載

於 HTML 中準備一個掛載點，並以 `id` 初始化編輯器：

```html
<div id="editor"></div>

<script>
  const editor = new JSONEditor({ id: "editor" });
</script>
```

若省略 `id`，`JSONEditor` 會建立一個新的 `<section class="pd-json-editor">` 元素（存放於 `editor.body`），但不會自動掛載到頁面上，需自行 `appendChild`。`editor.body` 在資料載入完成後才以非同步方式指定，建構子剛回傳時仍是 `undefined`；請在 `when.beforeRender` 或 `when.rendered` 內再掛載：

```javascript
const editor = new JSONEditor({
  json: { name: "NanoJSON" },
  when: {
    rendered: () => document.querySelector("#host").appendChild(editor.body),
  },
});
```

## 範例

以初始資料掛載到 `#editor`：

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    json: { name: "NanoJSON", version: "1.2.1" },
  });
</script>
```

## 下一步

- 以物件、File 或 URL 載入初始資料：[資料載入](/zh/core-concepts-data-loading)
- 了解 `JSONEditor` 與 `JSONEditorNode` 的資料模型：[核心概念](/zh/core-concepts)
- 掌握渲染與更新時機的鉤子機制：[生命週期鉤子](/zh/lifecycle-hooks)
- 查閱完整 constructor 設定與方法簽章：[API 參考](/zh/api-reference)
