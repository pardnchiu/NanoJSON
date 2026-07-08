# NanoJSON - 技術文件

> 返回 [README](./README.zh.md)

## 前置需求

- 現代瀏覽器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）
- Node.js 18+（僅開發建置需要；無執行期依賴）

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

> CSS 於初始化時自動注入。若需使用自訂樣式表，於設定中傳入 `css` 路徑即可覆蓋預設的 CDN URL。

## 使用方式

### 基礎

於 HTML 中準備一個掛載點，並以 `id` 初始化編輯器：

```html
<div id="editor"></div>

<script>
  const editor = new JSONEditor({ id: "editor" });
</script>
```

### 載入初始資料

支援三種資料來源格式：JavaScript 物件、File 物件、URL 字串。

```javascript
// 從物件載入
const editor = new JSONEditor({
  id: "editor",
  json: { name: "NanoJSON", version: "1.1.7" },
});

// 從 URL 載入
const editor = new JSONEditor({
  id: "editor",
  file: "https://example.com/data.json",
});
```

### 進階：完整設定與生命週期鉤子

```javascript
const editor = new JSONEditor({
  id: "editor",
  title: "Config Editor",
  description: "Edit application settings",
  fill: true,
  readonly: false,
  collapsed: true,
  confirmKeyRemove: true,
  css: "/path/to/custom.css",   // 選填；省略則使用 CDN 預設值
  json: { theme: "dark", lang: "en" },
  button: {
    import: true,
    export: true,
    reset: true,
  },
  when: {
    beforeRender: () => {
      console.log("即將渲染");
      // 回傳 false 可取消渲染
    },
    rendered: () => {
      console.log("渲染完成");
    },
    beforeUpdate: () => {
      console.log("即將更新");
      // 回傳 false 可取消此次更新（於 300ms 防抖後觸發）
    },
    updated: () => {
      const json = editor.json;
      console.log("資料已更新：", json);
    },
    beforeDestroy: () => {
      console.log("即將銷毀");
    },
    destroyed: () => {
      console.log("已銷毀");
    },
  },
});
```

### 動態操作

```javascript
// 取得目前 JSON 字串（含縮排）
const jsonString = editor.json;

// 以程式方式匯入新資料
await editor.import({ key: "value" });
await editor.import(fileObject);        // File 物件
await editor.import("https://...");     // URL 字串

// 下載目前 JSON 為檔案（含確認對話框）
editor.export();

// 重設為空物件
editor.reset();

// 切換唯讀模式
editor.disable();   // 啟用唯讀
editor.enable();    // 停用唯讀（恢復編輯）
```

## API 參考

### JSONEditor

#### Constructor

```javascript
new JSONEditor(config)
```

| 參數 | 型別 | 必填 | 預設值 | 說明 |
|-----------|------|----------|---------|-------------|
| `id` | `string` | 否 | — | 掛載目標的 DOM 元素 id；省略則建立新的 `<section>` |
| `title` | `string` | 否 | `""` | 於 `<header>` 中顯示的編輯器標題 |
| `description` | `string` | 否 | `""` | 於 `<header>` 中顯示的編輯器描述 |
| `fill` | `boolean` | 否 | `true` | 是否設定 `data-fill="1"` 以填滿容器 |
| `readonly` | `boolean` | 否 | `false` | 是否以唯讀模式啟動 |
| `collapsed` | `boolean` | 否 | `true` | 所有節點的初始折疊狀態 |
| `confirmKeyRemove` | `boolean` | 否 | `true` | 移除節點前是否顯示確認對話框 |
| `css` | `string` | 否 | CDN URL | 自訂 CSS 路徑，覆蓋預設注入的樣式表 |
| `json` | `object` | 否 | `{}` | 以 JavaScript 物件表示的初始 JSON 資料 |
| `file` | `File \| string` | 否 | — | 初始資料來源（File 物件或 URL 字串）；為 `json` 的替代方式 |
| `path` | `string` | 否 | — | 當傳入 URL 字串時 `file` 的別名 |
| `button.import` | `boolean` | 否 | `true` | 顯示匯入按鈕 |
| `button.export` | `boolean` | 否 | `true` | 顯示匯出按鈕 |
| `button.reset` | `boolean` | 否 | `true` | 顯示重設按鈕 |
| `when.beforeRender` | `() => boolean?` | 否 | — | 渲染前鉤子；回傳 `false` 可取消 |
| `when.rendered` | `() => void` | 否 | — | 渲染完成後鉤子 |
| `when.beforeUpdate` | `() => boolean?` | 否 | — | 更新前鉤子（300ms 防抖）；回傳 `false` 可取消 |
| `when.updated` | `() => void` | 否 | — | 更新完成後鉤子 |
| `when.beforeDestroy` | `() => boolean?` | 否 | — | 銷毀前鉤子；回傳 `false` 可取消 |
| `when.destroyed` | `() => void` | 否 | — | 銷毀完成後鉤子 |

#### 實例屬性與方法

| 成員 | 型別 | 說明 |
|--------|------|-------------|
| `json` | `getter → string` | 取得目前完整 JSON（4 空格縮排） |
| `type` | `getter → string` | 根節點型別（`"object"` 或 `"array"`） |
| `children` | `JSONEditorNode[]` | 頂層子節點陣列 |
| `body` | `HTMLElement` | 編輯器根 DOM 元素 |
| `editor` | `HTMLElement` | 節點容器 DOM 元素（`<section>`） |
| `import(data)` | `async method` | 匯入新資料（Object / File / URL）並重新渲染 |
| `export()` | `method` | 下載格式化 JSON；檔名含時間戳記 |
| `reset()` | `method` | 清空並重設為空物件 |
| `enable()` | `method` | 停用唯讀模式；恢復所有輸入控制項 |
| `disable()` | `method` | 啟用唯讀模式；停用所有輸入控制項 |
| `render(isUpdate?)` | `method` | 重新渲染所有節點；`isUpdate=true` 時觸發 `updated` 鉤子 |
| `insert()` | `method` | 於根層級新增一個空節點 |

---

### JSONEditorNode

節點由 `JSONEditor` 內部管理，通常不需直接存取。以下為可用於讀取操作的公開成員。

#### 屬性

| 屬性 | 型別 | 說明 |
|----------|------|-------------|
| `key` | `string` | 節點鍵名（物件子節點設定；陣列子節點為空） |
| `type` | `string` | 節點值型別：`string` / `number` / `boolean` / `object` / `array` / `null` |
| `value` | `string` | 原始節點值（適用於非容器型別） |
| `parent` | `JSONEditor \| JSONEditorNode` | 父節點參照 |
| `children` | `JSONEditorNode[]` | 子節點陣列（適用於 `object` 與 `array` 型別） |
| `collapsed` | `boolean` | 目前折疊狀態 |

#### 方法

| 方法 | 說明 |
|--------|-------------|
| `render()` | 渲染並回傳此節點的 DOM 元素 |
| `addChild()` | 新增子節點並更新 DOM |
| `updateChild()` | 重建 DOM 並觸發生命週期更新 |
| `setCollapsed()` | 切換折疊狀態並重新渲染 |
| `json`（getter） | 回傳此節點對應的 JavaScript 值（遞迴） |

---

### 支援的 JSON 型別

| 型別 | JavaScript 值 | 說明 |
|------|-----------------|-------------|
| `string` | `String` | 文字值；支援多行輸入 |
| `number` | `Number` | 數值；自動轉換為 JavaScript Number |
| `boolean` | `Boolean` | `true` / `false`，以下拉選單選擇 |
| `object` | `Object` | 鍵值容器；支援無限巢狀 |
| `array` | `Array` | 索引容器；子節點顯示數字索引 |
| `null` | `null` | 空值；顯示為 `null` |

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
