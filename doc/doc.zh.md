# nanojson - 技術文件

> 返回 [README](./README.zh.md)

## 前置需求

- 支援 ES2022 的瀏覽器（使用 class private field `#field`），如 Chrome 90+、Firefox 90+、Safari 15+、Edge 90+
- 僅限瀏覽器環境：依賴 `window`、`document`、`FileReader`、`fetch`、`confirm()`，不支援 Node.js 或 SSR 執行
- Node.js 18+（僅在從原始碼建置時需要）

## 安裝

### npm

```bash
npm install @pardnchiu/nanojson
```

### CDN（UMD）

```html
<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/dist/NanoJSON.js" defer></script>
```

載入後以全域 `window.JSONEditor` 取用。

### ES Module

```javascript
import { JSONEditor } from "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/dist/NanoJSON.esm.js";
```

### 從原始碼建置

```bash
git clone https://github.com/pardnchiu/NanoJSON.git
cd nanojson
npm install
npm run build:once
```

產出 `dist/NanoJSON.js`（UMD）、`dist/NanoJSON.esm.js`（ESM）與 `dist/NanoJSON.debug.js`（未壓縮）。樣式由 `npm run sass:library` 從 `src/sass/` 編譯至 `dist/NanoJSON.css`。

## 使用方式

### 基礎：掛載到既有元素

```html
<div id="editor" style="position: relative; height: 480px"></div>

<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/dist/NanoJSON.js"></script>
<script>
  const editor = new JSONEditor({
    id: "editor",
    json: { name: "NanoJSON", version: "1.2.1" },
  });
</script>
```

`fill` 預設為 `true`，編輯器以絕對定位填滿容器，容器需具備定位與高度；改為 `fill: false` 則依內容高度排版。

樣式會在建構時自動注入，預設來源為 `https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.1.7/dist/NanoJSON.css`；需使用其他版本或自訂樣式時傳入 `css`。

### 基礎：不指定 `id`

未傳 `id` 時會建立新的 `<section class="pd-json-editor">`，但不會掛到頁面上。`editor.body` 在資料載入完成後才指派，需於鉤子中掛載：

```javascript
const editor = new JSONEditor({
  json: { name: "NanoJSON" },
  fill: false,
  when: {
    rendered: () => document.querySelector("#host").appendChild(editor.body),
  },
});
```

### 進階：從 URL 載入並處理錯誤

`getJSON()` 在 HTTP 非 2xx 時不會 resolve，初始化會停在載入階段且不觸發任何鉤子。正式環境建議自行 `fetch` 並檢查狀態，再以物件傳入：

```javascript
async function mountFromURL(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();

    // 根層陣列無法以陣列輸出，先包成物件
    const json = Array.isArray(data) ? { items: data } : data;

    return new JSONEditor({ id: "editor", json });
  } catch (err) {
    console.error(`載入失敗：${err.message}`);
    return new JSONEditor({ id: "editor", json: {} });
  } finally {
    clearTimeout(timer);
  }
}

mountFromURL("https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.2.1/package.json");
```

### 進階：以鉤子驗證並同步資料

`before*` 鉤子必須**同步**回傳 `false` 才能取消；回傳 Promise（例如 `async` 函式）一律視為放行。

```javascript
const STORAGE_KEY = "nanojson-draft";

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

const editor = new JSONEditor({
  id: "editor",
  title: "Draft",
  json: loadDraft(),
  confirmKeyRemove: false,
  button: { import: true, export: true, reset: false },
  when: {
    beforeUpdate: () => {
      // 有空 key 的根節點時略過本次同步
      return editor.children.every((node) => node.key !== "");
    },
    updated: () => {
      try {
        localStorage.setItem(STORAGE_KEY, editor.json);
      } catch (err) {
        console.error(`儲存失敗：${err.message}`);
      }
    },
  },
});
```

連續輸入只會在停止輸入 300ms 後觸發一次 `beforeUpdate`／`updated`。

### 進階：程式化操作

```javascript
const editor = new JSONEditor({
  id: "editor",
  readonly: true,
  json: { mode: "view" },
  when: {
    rendered: async () => {
      await editor.import({ mode: "edit", tags: ["json"] });

      // import() 重新渲染後的值欄位不帶 disabled，需重新套用唯讀
      editor.disable();

      document.querySelector("#unlock").onclick = () => editor.enable();
      document.querySelector("#save").onclick = () => editor.export();
    },
  },
});
```

### 已知限制

| 情境 | 實際行為 | 建議處理 |
|---|---|---|
| 根層為陣列（如 `[1, 2]`） | `editor.json` 輸出 `"{}"`；`export()` 僅在單一元素時輸出 `{"0": ...}` | 包成物件後傳入，例如 `{ items: [...] }` |
| 物件值為 `null`（如 `{"a": null}`） | 初次渲染拋出 `ReferenceError: _null is not defined`，`rendered` 不觸發 | 傳入前轉成空字串或移除該欄位 |
| 陣列元素為 `null`（如 `[null]`） | 轉為內容為 `"null"` 的字串節點 | 同上 |
| `when.beforeDestroy`／`when.destroyed` | 目前沒有任何公開 API 會觸發 | 不依賴這兩個鉤子 |
| 全域副作用 | 函式庫在 `String.prototype` 上定義 `_` 方法作為 DOM 建構工具 | 避免頁面上其他程式碼使用同名屬性 |

## API 參考

### 匯出

| 建置 | 取得方式 |
|---|---|
| UMD（`dist/NanoJSON.js`） | 全域 `window.JSONEditor` |
| ES Module（`dist/NanoJSON.esm.js`） | `import { JSONEditor } from ".../NanoJSON.esm.js"` |

`JSONEditorNode` 與 `Lifecycle` 不對外匯出，節點只能透過 `editor.children` 取得。

### `new JSONEditor(config)`

`config` 非物件時輸出 `Failed to load config.` 並回傳不可用的實例。

| 參數 | 型別 | 預設 | 說明 |
|---|---|---|---|
| `id` | `string` | — | 掛載目標元素的 id，其內容會被替換；省略則建立未掛載的 `<section>` |
| `title` | `string` | `""` | 標題，渲染於 `<header>` |
| `description` | `string` | `""` | 描述；`title` 與 `description` 皆空時不渲染 `<header>` |
| `fill` | `boolean` | `true` | 設定 `data-fill`，`true` 時絕對定位填滿容器 |
| `readonly` | `boolean` | `false` | 以唯讀模式啟動 |
| `collapsed` | `boolean` | `true` | 由初始資料、`import()`、`insert()` 建立之節點的初始收合狀態 |
| `confirmKeyRemove` | `boolean` | `true` | 移除節點前是否跳出 `confirm()`；適用範圍同 `collapsed` |
| `css` | `string` | 1.1.7 版 CDN 樣式 | 自訂樣式路徑，空字串或非字串時使用預設值 |
| `file` | `File \| string` | — | 初始資料來源 |
| `json` | `object` | — | 初始資料 |
| `path` | `string` | — | URL 來源；取 `file ?? json ?? path` 的第一個非 `null` 值，皆無時為 `{}` |
| `button.import` | `boolean` | `true` | 顯示「開啟」按鈕 |
| `button.export` | `boolean` | `true` | 顯示「下載」按鈕 |
| `button.reset` | `boolean` | `true` | 顯示「重置」按鈕 |
| `when` | `object` | `{}` | 生命週期鉤子，見下方 |

在節點內部手動新增的子節點（子節點新增按鈕、切換為 `object`／`array` 時自動補的子節點）不套用 `collapsed` 與 `confirmKeyRemove`：一律展開，且移除時不跳確認。

### 實例屬性

`body`、`editor`、`children` 在資料載入完成後才指派，建構子回傳當下尚不可用。

| 成員 | 型別 | 說明 |
|---|---|---|
| `json` | `getter → string` | 以 4 空格縮排序列化目前資料，略過無 key 的根層節點 |
| `type` | `getter → string` | 根型別，固定為 `"object"` |
| `children` | `JSONEditorNode[]` | 根層節點 |
| `body` | `HTMLElement` | 編輯器根元素（含 `pd-json-editor` class） |
| `editor` | `HTMLElement` | 節點容器 `<section>` |

### 實例方法

| 方法 | 回傳 | 說明 |
|---|---|---|
| `import(data)` | `Promise<void>` | 以物件、`File` 或 URL 字串替換資料並重新渲染；初次渲染完成後會觸發更新鉤子 |
| `export()` | `void` | 下載 `NanoJSON-{timestamp}.json`；僅一個根節點時即使無 key 也會輸出 |
| `reset()` | `void` | 等同 `import({})`，重置後不保留任何節點 |
| `enable()` | `void` | 解除唯讀 |
| `disable()` | `void` | 進入唯讀；收合按鈕不受影響 |
| `render(isUpdate = false)` | `void` | 重新渲染所有根層節點；`isUpdate` 為 `true` 且已完成初次渲染時觸發更新鉤子 |
| `insert()` | `void` | 新增一個空的根層 string 節點，不觸發更新鉤子 |

### `JSONEditorNode`

| 屬性 | 型別 | 說明 |
|---|---|---|
| `id` | `string` | 64 字元隨機字串，用於 `key-{id}`、`value-{id}` 等 DOM id |
| `key` | `string` | 鍵名，陣列元素為 `""` |
| `type` | `string` | `"string"`／`"number"`／`"boolean"`／`"object"`／`"array"`；`"null"` 僅由匯入產生 |
| `value` | `string` | 原始值（非容器型別） |
| `parent` | `JSONEditor \| JSONEditorNode` | 父節點 |
| `children` | `JSONEditorNode[]` | 子節點 |
| `collapsed` | `boolean` | 目前收合狀態 |
| `json` | `getter` | 遞迴回傳此節點的 JavaScript 值；`number` 經 `Number()`，`boolean` 比對 `"true"` |

| 方法 | 說明 |
|---|---|
| `render()` | 建立並回傳此節點的 DOM |
| `addChild()` | 新增空子節點並觸發更新鉤子 |
| `updateChild()` | 重建此節點 DOM 並觸發更新鉤子 |
| `setCollapsed()` | 切換收合狀態並重建 DOM，不觸發更新鉤子 |

### 生命週期鉤子（`when`）

| 鉤子 | 觸發時機 | 回傳 `false` 可取消 |
|---|---|---|
| `beforeRender` | 初次渲染前 | 是 |
| `rendered` | 初次渲染完成後 | 否 |
| `beforeUpdate` | 資料變動經 300ms 防抖後、更新前 | 是 |
| `updated` | 更新完成後 | 否 |
| `beforeDestroy` | 銷毀前（目前不會被觸發） | 是 |
| `destroyed` | 銷毀後（目前不會被觸發） | 否 |

會觸發更新鉤子的操作：編輯 key 或值、切換型別、新增或移除子節點、初次渲染後的 `import()`／`reset()`。

### 型別推導與切換

| 匯入值 | 推導型別 |
|---|---|
| 陣列 | `array` |
| 物件 | `object` |
| `boolean` | `boolean` |
| `number` | `number` |
| 其他 | `string` |

| 切換為 | 對既有值的影響 |
|---|---|
| `object`／`array` | 清空 `value`；無子節點時自動新增一個 |
| `number` | 對既有字串做 `parseFloat`，失敗則清空；保留 `children` |
| `string`／`boolean` | 清空 `value` 與 `children` |

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
