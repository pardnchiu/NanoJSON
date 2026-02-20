# NanoJSON - 技術文件

> 返回 [README](./README.zh.md)

## 前置需求

- 現代瀏覽器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）
- Node.js 18+（僅用於開發建置，執行期不需要）

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

> 不需要手動引入 CSS，編輯器在初始化時會自動注入樣式表。如需使用自訂 CSS，可透過 `css` 設定覆蓋預設路徑。

## 使用方式

### 基礎用法

在 HTML 中準備一個掛載點，傳入 `id` 即可初始化編輯器：

```html
<div id="editor"></div>

<script>
  const editor = new JSONEditor({ id: "editor" });
</script>
```

### 載入初始資料

支援三種資料來源：JavaScript 物件、File 物件、URL 字串。

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

### 進階用法：完整設定與生命週期

```javascript
const editor = new JSONEditor({
  id: "editor",
  title: "設定編輯器",
  description: "編輯應用程式設定",
  fill: true,
  readonly: false,
  collapsed: true,
  confirmKeyRemove: true,
  css: "/path/to/custom.css",   // 自訂 CSS 路徑（可省略，預設使用 CDN）
  json: { theme: "dark", lang: "zh-TW" },
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
      // 回傳 false 可取消此次更新（300ms debounce 後觸發）
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
// 取得目前 JSON 字串（縮排格式）
const jsonString = editor.json;

// 以程式方式匯入新資料
await editor.import({ key: "value" });
await editor.import(fileObject);        // File 物件
await editor.import("https://...");    // URL 字串

// 下載目前 JSON 為檔案（含確認對話框）
editor.export();

// 重設為空物件
editor.reset();

// 切換唯讀模式
editor.disable();   // 啟用唯讀
editor.enable();    // 停用唯讀（恢復可編輯）
```

## API Reference

### JSONEditor

#### Constructor

```javascript
new JSONEditor(config)
```

| 參數 | 型別 | 必要 | 預設值 | 說明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | — | 掛載目標 DOM 元素的 id；若省略則建立新 `<section>` |
| `title` | `string` | 否 | `""` | 編輯器標題，渲染於 `<header>` |
| `description` | `string` | 否 | `""` | 編輯器說明，渲染於 `<header>` |
| `fill` | `boolean` | 否 | `true` | 是否以 `data-fill="1"` 填滿容器 |
| `readonly` | `boolean` | 否 | `false` | 是否以唯讀模式啟動 |
| `collapsed` | `boolean` | 否 | `true` | 節點初始折疊狀態 |
| `confirmKeyRemove` | `boolean` | 否 | `true` | 刪除節點前是否顯示確認對話框 |
| `css` | `string` | 否 | CDN URL | 自訂 CSS 路徑，覆蓋預設注入的樣式表 |
| `json` | `object` | 否 | `{}` | 初始 JSON 資料（物件格式） |
| `file` | `File \| string` | 否 | — | 初始資料來源（File 物件或 URL 字串），與 `json` 二選一 |
| `path` | `string` | 否 | — | 同 `file`，URL 字串別名 |
| `button.import` | `boolean` | 否 | `true` | 是否顯示匯入按鈕 |
| `button.export` | `boolean` | 否 | `true` | 是否顯示匯出按鈕 |
| `button.reset` | `boolean` | 否 | `true` | 是否顯示重設按鈕 |
| `when.beforeRender` | `() => boolean?` | 否 | — | 渲染前鉤子，回傳 `false` 取消 |
| `when.rendered` | `() => void` | 否 | — | 渲染完成鉤子 |
| `when.beforeUpdate` | `() => boolean?` | 否 | — | 更新前鉤子（300ms debounce），回傳 `false` 取消 |
| `when.updated` | `() => void` | 否 | — | 更新完成鉤子 |
| `when.beforeDestroy` | `() => boolean?` | 否 | — | 銷毀前鉤子，回傳 `false` 取消 |
| `when.destroyed` | `() => void` | 否 | — | 銷毀完成鉤子 |

#### 實例屬性與方法

| 成員 | 類型 | 說明 |
|------|------|------|
| `json` | `getter → string` | 取得目前完整 JSON（縮排 4 格） |
| `type` | `getter → string` | 根節點型別（`"object"` 或 `"array"`） |
| `children` | `JSONEditorNode[]` | 根層直接子節點陣列 |
| `body` | `HTMLElement` | 編輯器根 DOM 元素 |
| `editor` | `HTMLElement` | 節點容器 DOM 元素（`<section>`） |
| `import(data)` | `async method` | 匯入新資料（Object / File / URL），完成後重新渲染 |
| `export()` | `method` | 下載格式化 JSON，檔名含 timestamp |
| `reset()` | `method` | 清空並重設為空物件 |
| `enable()` | `method` | 停用唯讀模式，恢復所有輸入控制項 |
| `disable()` | `method` | 啟用唯讀模式，禁用所有輸入控制項 |
| `render(isUpdate?)` | `method` | 重新渲染所有節點；`isUpdate=true` 時觸發 updated 鉤子 |
| `insert()` | `method` | 在根層新增一個空節點 |

---

### JSONEditorNode

節點為內部類別，由 `JSONEditor` 自動管理，通常不需直接操作。以下為可讀屬性與方法。

#### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `key` | `string` | 節點鍵名（物件型別時有值，陣列子節點為空） |
| `type` | `string` | 節點值型別：`string` / `number` / `boolean` / `object` / `array` / `null` |
| `value` | `string` | 節點原始值（非容器型別時有效） |
| `parent` | `JSONEditor \| JSONEditorNode` | 父節點參考 |
| `children` | `JSONEditorNode[]` | 子節點陣列（僅 object / array 型別有效） |
| `collapsed` | `boolean` | 目前折疊狀態 |

#### 方法

| 方法 | 說明 |
|------|------|
| `render()` | 渲染並回傳此節點的 DOM 元素 |
| `addChild()` | 新增一個子節點並更新 DOM |
| `updateChild()` | 重新建立 DOM 並觸發生命週期更新 |
| `setCollapsed()` | 切換折疊狀態並重新渲染 |
| `json` (getter) | 回傳此節點對應的 JavaScript 值（遞迴） |

---

### 支援的 JSON 型別

| 型別 | JavaScript 值 | 說明 |
|------|--------------|------|
| `string` | `String` | 文字值，支援多行輸入 |
| `number` | `Number` | 數值，自動轉換為 JavaScript Number |
| `boolean` | `Boolean` | `true` / `false` 下拉選擇 |
| `object` | `Object` | 鍵值對容器，可無限巢狀 |
| `array` | `Array` | 索引容器，子節點顯示數字索引 |
| `null` | `null` | 空值，渲染為 `null` |

***

©️ 2025 [邱敬幃 Pardn Chiu](https://linkedin.com/in/pardnchiu)
