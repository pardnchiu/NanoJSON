> [!Note]
> This content is translated by LLM. Original text can be found [here](README.zh.md)

<img src="https://nanojson.pardn.io/static/image/logo.png" width=80>

# NanoJSON

> A lightweight JSON editor based on pure JavaScript and native APIs, featuring visual editing, dynamic type switching, and file import/export capabilities. Perfect for website integration and JSON data editing.<br>
> This project has been licensed under MIT since 2025/07/06, with complete removal of `.git-crypt` encryption.

[![version](https://img.shields.io/npm/v/@pardnchiu/nanojson)](https://www.npmjs.com/package/@pardnchiu/nanojson)
[![download](https://img.shields.io/npm/dm/@pardnchiu/nanojson)](https://www.npmjs.com/package/@pardnchiu/nanojson)
[![readme](https://img.shields.io/badge/readme-繁體中文-blue)](README.zh.md)

## Core Features

### Zero Dependencies, Pure JavaScript
Built with native DOM APIs without any third-party dependencies, easily embeddable in any web project.

### Visual JSON Editing Experience
Tree-structured JSON data display with collapsible/expandable nodes, dynamic add/remove operations, and intuitive editing interface.

### Complete Type Support
Supports all 5 JSON data types (`string`, `number`, `boolean`, `array`, `object`) with real-time type switching while maintaining data integrity.

## Usage

### Installation

#### Install via npm
```bash
npm install @pardnchiu/nanojson
```

#### Include via CDN

##### UMD Version
```html
<script src="https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@[VERSION]/dist/NanoJSON.js"></script>
```

##### ES Module Version
```javascript
import { JSONEditor } from "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@[VERSION]/dist/NanoJSON.esm.js";
```

### Initialization

```javascript
// Basic initialization
const editor = new JSONEditor({
  id: "json-editor-container", // Element ID to replace
  title: "JSON Editor",        // Editor title
  description: "Edit your JSON", // Editor description
  fill: true,                  // Fill parent container
  json: {                      // Initial JSON data
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
    import: true,               // File import
    export: true,               // File export
    reset: true                 // Reset editor
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

## Configuration Options

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
    import: true,         // File import button (default: true)
    export: true,         // File export button (default: true)
    reset: true           // Reset button (default: true)
  },
  when: {                   // Lifecycle events
    beforeRender: null,   // Before render
    rendered: null,       // After render
    beforeUpdate: null,   // Before update
    updated: null,        // After update
    beforeDestroy: null,  // Before destroy
    destroyed: null       // After destroy
  }
};
```

## Editor Features

### Data Type Support

#### String
```javascript
// Text input field editing
"Hello World"
```

#### Number
```javascript
// Number input field with automatic non-numeric character filtering
42
3.14159
-123
```

#### Boolean
```javascript
// Dropdown selection
true
false
```

#### Array
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

#### Object
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

## Available Methods

- **Get JSON Data**
  ```javascript
  const jsonString = editor.json;  // Get formatted JSON string
  console.log(jsonString);
  ```

- **Import Data**
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

- **Export File**
  ```javascript
  editor.export();  // Automatically download JSON file
  ```

- **Reset Editor**
  ```javascript
  editor.reset();   // Clear all content
  ```

- **Add Root Node**
  ```javascript
  editor.insert();  // Add an empty root node
  ```

- **Re-render**
  ```javascript
  editor.render();  // Force re-render the editor
  ```

## Lifecycle

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

### File Handling

#### Supported Formats
- Only supports `.json` file format
- Automatic JSON syntax validation
- User-friendly error messages

#### Export Features
- Automatic JSON formatting (4-space indentation)
- File naming format: `JSONEditor-{timestamp}.json`

## License

This project is licensed under the [MIT](LICENSE) License.

## Author

<img src="https://avatars.githubusercontent.com/u/25631760" align="left" width="96" height="96" style="margin-right: 0.5rem;">

<h4 style="padding-top: 0">邱敬幃 Pardn Chiu</h4>

<a href="mailto:dev@pardn.io" target="_blank">
    <img src="https://pardn.io/image/email.svg" width="48" height="48">
</a> <a href="https://linkedin.com/in/pardnchiu" target="_blank">
    <img src="https://pardn.io/image/linkedin.svg" width="48" height="48">
</a>

***

©️ 2025 [邱敬幃 Pardn Chiu](https://pardn.io)