<img src="https://nanojson.pardn.io/static/image/logo.png" width=80>

# NanoJSON

> 基於純 JavaScript 與原生 APIs 的輕量級 JSON 編輯器，具備可視化編輯、動態類型切換和檔案導入導出功能。適用於網站嵌入與 JSON 資料編輯。<br>
> A lightweight JSON editor based on Vanilla JS and native APIs, provide visual editing, dynamic type switching, and file import/export. Suitable for website integration and JSON data editing.<br>
>
> 此專案於 2025/07/06 起改為 MIT 授權，並完整移除 `.git-crypt` 加密。
> This project has been licensed under MIT since 2025/07/06, and complete removal of `.git-crypt` encryption.

[![license](https://img.shields.io/github/license/pardnchiu/nanojson)](LICENSE)
[![version](https://img.shields.io/npm/v/@pardnchiu/nanojson)](https://www.npmjs.com/package/@pardnchiu/nanojson)
[![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@pardnchiu/nanojson)](https://www.jsdelivr.com/package/npm/@pardnchiu/nanojson)

## 三大主軸 / Three Core Features

### 無需第三方依賴 / Zero Dependencies
基於原生 DOM APIs 開發，無任何第三方依賴，可輕鬆嵌入任何網站專案。<br>
Built with native DOM APIs without any third-party dependencies, easily embeddable in any web project.

### 視覺化 JSON 編輯體驗 / Visual JSON Editing
採用樹狀結構顯示 JSON 資料，支援摺疊展開、動態新增刪除節點，提供直觀的編輯介面。<br>
Tree-structured JSON data display with collapsible/expandable nodes, dynamic add/remove operations, and intuitive editing interface.

### 完整類型支援 / Complete Type Support
支援 5 種 JSON 資料類型（`string`、`number`、`boolean`、`array`、`object`），可即時切換類型並保持資料完整性。<br>
Supports all 5 JSON data types (`string`, `number`, `boolean`, `array`, `object`) with real-time type switching while maintaining data integrity.

## 使用方法 / How to use

### 安裝 / Installation

#### 透過 npm 安裝 / Install via npm
```bash
npm install @pardnchiu/nanojson
```

#### 透過 CDN 引入 / Include via CDN

##### UMD 版本 / UMD Version
```html
<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@[VERSION]/dist/NanoJSON.js"></script>
```

##### ES Module 版本 / ES Module Version
```javascript
import { JSONEditor } from "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@[VERSION]/dist/NanoJSON.esm.js";
```

### 初始化 / Initialization
```javascript
// Basic initialization
const editor = new JSONEditor({
  id: "json-editor-container",    // Element ID to replace
  title: "JSON Editor",           // Editor title
  description: "Edit your JSON",  // Editor description
  fill: true,                     // Fill parent container
  json: {                         // Initial JSON data
    name: "NanoJSON",
    version: "0.3.4",
    features: ["lightweight", "pure-js", "visual-editing"]
  }
});

// Advanced configuration
const advancedEditor = new JSONEditor({
  id: "advanced-editor",
  title: "Advanced JSON Editor",
  description: "Full-featured JSON editor",
  fill: 1,                        // Fill container (1 = true, 0 = false)
  button: {                       // Function button configuration
    import: true,                 // File import
    export: true,                 // File export
    reset: true                   // Reset editor
  },
  when: {                         // Lifecycle callbacks
    rendered: () => {
      console.log("Editor rendered");
    },
    updated: () => {
      console.log("Editor content updated");
    }
  }
});

// Initialize from file
const fileEditor = new JSONEditor({
  id: "file-editor",
  path: "/data/sample.json",      // Load from URL
  // file: fileInput.files[0],    // Load from File object
});
```

## 配置介紹 / Configuration
```javascript
const config = {
  id: "container-id",       // Target container element ID
  title: "",                // Editor title (default: "")
  description: "",          // Editor description (default: "")
  fill: 1,                  // Fill parent container (default: 1)
  json: {},                 // Initial JSON data object
  file: null,               // File object (for file upload)
  path: "",                 // JSON file URL path
  button: {                 // Function button toggles
    import: true,           // File import button (default: true)
    export: true,           // File export button (default: true)
    reset: true             // Reset button (default: true)
  },
  when: {                   // Lifecycle events
    beforeRender: null,     // Before render
    rendered: null,         // After render
    beforeUpdate: null,     // Before update
    updated: null,          // After update
    beforeDestroy: null,    // Before destroy
    destroyed: null         // After destroy
  }
};
```

## 編輯器功能 / Editor

### 資料類型 / Data Type 

#### String 字串
```javascript
// Text input field editing
"Hello World"
```

#### Number 數字
```javascript
// Number input field with automatic non-numeric character filtering
42
3.14159
-123
```

#### Boolean 布林值
```javascript
// Dropdown selection
true
false
```

#### Array 陣列
```javascript
// Supports nested structures, add/remove elements
[
  "item1",
  "item2", 
  123,
  true,
  {
    "nested": "object"
  }
]
```

#### Object 物件
```javascript
// Supports nested structures, add/remove properties
{
  "key1": "value1",
  "key2": 456,
  "nested": {
    "deep": "value"
  }
}
```

## 可用函式 / Methods

- **獲取 JSON 資料 / Get JSON Data**
  ```javascript
  const jsonString = editor.json;  // Get formatted JSON string
  console.log(jsonString);
  ```

- **匯入資料 / Import Data**
  ```javascript
  // Import from object
  await editor.import({
    name: "New Data",
    version: "1.0.0"
  });
  
  // Import from file
  const fileInput = document.querySelector('input[type="file"]');
  await editor.import(fileInput.files[0]);
  
  // Import from URL
  await editor.import('/path/to/data.json');
  ```

- **匯出檔案 / Export File**
  ```javascript
  editor.export();  // Automatically download JSON file
  ```

- **重置編輯器 / Reset Editor**
  ```javascript
  editor.reset();   // Clear all content
  ```

- **新增根節點 / Add Root Node**
  ```javascript
  editor.insert();  // Add an empty root node
  ```

- **重新渲染 / Re-render***
  ```javascript
  editor.render();  // Force re-render the editor
  ```

## 生命週期 / Lifecycle
```javascript
const editor = new JSONEditor({
  id: "editor",
  when: {
    beforeRender: () => {
      console.log("About to render");
      // Return false to prevent rendering
    },
    rendered: () => {
      console.log("Render completed");
      // Post-initialization handling
    },
    beforeUpdate: () => {
      console.log("About to update content");
      // Return false to prevent update
    },
    updated: () => {
      console.log("Content updated");
      // Post-update handling, e.g., sync to server
    },
    beforeDestroy: () => {
      console.log("About to destroy editor");
    },
    destroyed: () => {
      console.log("Editor destroyed");
    }
  }
});
```

### 檔案處理機制 / File Handling

#### 支援格式 / Supported Type
- 僅支援 `.json` 檔案格式<br>
  Only supports `.json` file
- 自動驗證 JSON 語法正確性<br>
  Automatic JSON syntax validation

#### 匯出功能 / Export
- 自動格式化 JSON（4 空格縮排）<br>
  Automatic JSON formatting (4-space indentation)
- 檔案命名格式：`JSONEditor-{timestamp}.json`<br>
  File naming format: `JSONEditor-{timestamp}.json`

## 授權條款 / License

此專案採用 [MIT](LICENSE) 授權條款。<br>
This project is licensed under the [MIT](LICENSE) License.

## 作者 / Author

<img src="https://avatars.githubusercontent.com/u/25631760" align="left" width="96" height="96" style="margin-right: 0.5rem;">

<h4 style="padding-top: 0">邱敬幃 Pardn Chiu</h4>

<a href="mailto:dev@pardn.io" target="_blank">
    <img src="https://pardn.io/image/email.svg" width="48" height="48">
</a> <a href="https://linkedin.com/in/pardnchiu" target="_blank">
    <img src="https://pardn.io/image/linkedin.svg" width="48" height="48">
</a>

***

©️ 2025 [邱敬幃 Pardn Chiu](https://pardn.io)