> [!NOTE]
> This README was translated by ChatGPT 4.1, get the original version from [here](./README.zh.md).

![](./cover.png)

# NanoJSON

[![license](https://img.shields.io/github/license/pardnchiu/nanojson)](LICENSE)
[![version](https://img.shields.io/npm/v/@pardnchiu/nanojson)](https://www.npmjs.com/package/@pardnchiu/nanojson)
[![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@pardnchiu/nanojson)](https://www.jsdelivr.com/package/npm/@pardnchiu/nanojson)

> A Firebase-style JSON editor based on pure JavaScript and native APIs, featuring visual editing, dynamic type switching, and file import/export. Suitable for website embedding and JSON data editing.

## Table of Contents

- [Three Core Features](#core-features)
  - [No Third-Party Dependencies](#no-third-party-dependencies)
  - [Visual JSON Editing Experience](#visual-json-editing-experience)
  - [Full Type Support](#full-type-support)
- [Usage](#usage)
  - [Installation](#installation)
  - [Initialization](#initialization)
- [Configuration](#configuration)
- [Editor Features](#editor-features)
  - [Data Types](#data-types)
- [Available Methods](#available-methods)
- [Lifecycle](#lifecycle)
  - [File Handling](#file-handling)
- [Additional Notes](#additional-notes)
- [License](#license)
- [Author](#author)
- [Stars](#stars)

## Core Features

### No Third-Party Dependencies
Developed entirely with native DOM APIs, no third-party dependencies, easily embeddable in any web project.

### Visual JSON Editing Experience
Displays JSON data in a tree structure similar to the Firebase console, supports collapse/expand, dynamic node addition/removal, and provides an intuitive editing interface.

### Full Type Support
Supports 5 standard JSON data types (`string`, `number`, `boolean`, `array`, `object`), allows real-time type switching while preserving data integrity.

## Usage

### Installation

#### Install via npm
```bash
npm install @pardnchiu/nanojson
```

#### Import via CDN

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
  id: "json-editor-container",    // Element ID
  title: "JSON Editor",           // Editor title
  description: "Edit your JSON",  // Editor description
  fill: true,                     // Fill parent container
  json: {                         // Initial JSON data
    name: "NanoJSON",
    version: "0.3.4",
    features: ["Lightweight", "Pure JS", "Visual Editing"]
  }
});

// Advanced configuration
const advancedEditor = new JSONEditor({
  id: "advanced-editor",
  title: "Advanced JSON Editor",
  description: "Full-featured JSON editor",
  fill: 1,                        // Fill container (1 = true, 0 = false)
  button: {                       // Button configuration
    import: true,                 // Import file
    export: true,                 // Export file
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
  // file: fileInput.files[0],    // Load from file object
});
```

## Configuration
```javascript
const config = {
  id: "container-id",       // Target container element ID
  title: "",                // Editor title (default: "")
  description: "",          // Editor description (default: "")
  fill: 1,                  // Fill parent container (default: 1)
  readonly: 0,              // Read-only mode (default: 0)
  json: {},                 // Initial JSON data object
  file: null,               // File object (for uploads)
  path: "",                 // JSON file URL path
  button: {                 // Button toggles
    import: true,           // Import button (default: true)
    export: true,           // Export button (default: true)
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

## Editor Features

### Data Types

#### String
```javascript
// Edit via text input
"Hello World"
```

#### Number
```javascript
// Number input, auto-filters non-numeric characters
42
3.14159
-123
.123
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
  editor.insert();  // Add empty root node
  ```

- **Re-render**
  ```javascript
  editor.render();  // Force re-render editor
  ```

- **Enable Edit Mode**
  ```javascript
  editor.enable();
  ```

- **Read-only Mode**
  ```javascript
  editor.disable();
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
      console.log("Render complete");
      // Post-initialization
    },
    beforeUpdate: () => {
      console.log("About to update content");
      // Return false to prevent update
    },
    updated: () => {
      console.log("Content updated");
      // Post-update, e.g., sync to server
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
- Only `.json` file format supported
- Automatically validates JSON syntax

#### Export Function
- Automatically formats JSON (4-space indentation)
- File naming: `JSONEditor-{timestamp}.json`

## Additional Notes
- This project switched to MIT license from 2025/07/06 and fully removed `.git-crypt` encryption.

## License

This project is licensed under the [MIT](LICENSE).

## Author

<img src="https://avatars.githubusercontent.com/u/25631760" align="left" width="96" height="96" style="margin-right: 0.5rem;">

<h4 style="padding-top: 0">邱敬幃 Pardn Chiu</h4>

<a href="mailto:dev@pardn.io" target="_blank">
<img src="https://pardn.io/image/email.svg" width="48" height="48">
</a> <a href="https://linkedin.com/in/pardnchiu" target="_blank">
<img src="https://pardn.io/image/linkedin.svg" width="48" height="48">
</a>

## Stars

[![Star](https://api.star-history.com/svg?repos=pardnchiu/NanoJSON&type=Date)](https://www.star-history.com/#pardnchiu/NanoJSON&Date)

***

©️ 2025 [邱敬幃 Pardn Chiu](https://pardn.io)

