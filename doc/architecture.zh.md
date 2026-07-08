# NanoJSON - 架構

> 返回 [README](./README.zh.md)

## 概覽

```mermaid
graph TB
    Dev[開發者設定] --> JE[JSONEditor]
    JE --> Data[getJSON 資料載入]
    JE --> Tree[JSONEditorNode 樹]
    Tree --> Render[DOM 渲染函式]
    JE --> LC[Lifecycle]
    JE --> IO[Import / Export]
```

## Module: JSONEditor

根控制器，負責掛載 DOM、載入初始資料、管理子節點樹，並協調匯入 / 匯出與生命週期。

```mermaid
graph TB
    subgraph JSONEditor
        Init[#init 初始化] --> Mount[掛載至 id 或建立 section]
        Init --> LoadJSON[getJSON 載入資料]
        LoadJSON --> ToChildren[#jsonToChildren 建樹]
        ToChildren --> Nodes[JSONEditorNode 陣列]
        Render[render] --> Nodes
        Import[import/export/reset] --> ToChildren
        Insert[insert] --> Nodes
    end
    CSS[loadCSS] --> Init
    Config[config: title/readonly/collapsed/button/when] --> Init
```

## Module: JSONEditorNode

樹狀結構中的遞迴節點，管理自身的鍵值、型別、子節點與折疊狀態，並負責局部 DOM 重繪。

```mermaid
graph TB
    subgraph JSONEditorNode
        Create[#create 渲染] --> Collapse[buttonToCollapseNode]
        Create --> Key[keyInput]
        Create --> TypeSel[typeSelect]
        Create --> Value[valueInput]
        Create --> AddSub[buttonToAddSubNode]
        Add[#add] --> Create
        Remove[#remove] --> Update[#update]
        JsonGetter[json getter #json] --> Children[children 遞迴]
    end
    Parent[父節點 / JSONEditor] --> Create
```

## Module: Lifecycle

集中管理六個生命週期鉤子，並對更新事件套用 300ms 防抖，避免頻繁觸發。

```mermaid
graph TB
    subgraph Lifecycle
        RenderFn[render] --> BeforeRender[beforeRenderCallback]
        BeforeRender -->|回傳 false 則中止| Cancel1[取消]
        BeforeRender --> Rendered[renderedCallback]
        UpdateFn[update] --> Debounce[300ms setTimeout]
        Debounce --> BeforeUpdate[beforeUpdateCallback]
        BeforeUpdate -->|回傳 false 則中止| Cancel2[取消]
        BeforeUpdate --> Updated[updatedCallback]
        DestroyFn[destroy] --> BeforeDestroy[beforeDestroyCallback]
        BeforeDestroy --> Destroyed[destroyedCallback]
    end
```

## 資料流

```mermaid
sequenceDiagram
    participant User
    participant JSONEditor
    participant JSONEditorNode
    participant Lifecycle
    User->>JSONEditor: new JSONEditor(config)
    JSONEditor->>JSONEditor: getJSON(file/json/path)
    JSONEditor->>JSONEditorNode: #jsonToChildren(data)
    JSONEditorNode-->>JSONEditor: 節點樹
    JSONEditor->>Lifecycle: render(callback)
    Lifecycle->>Lifecycle: beforeRenderCallback
    Lifecycle->>JSONEditor: 執行 callback
    User->>JSONEditorNode: 編輯值 / 型別 / 鍵
    JSONEditorNode->>Lifecycle: update(callback)
    Lifecycle->>Lifecycle: 300ms 防抖後觸發 beforeUpdate/updated
    User->>JSONEditor: export()
    JSONEditor-->>User: 下載 JSON 檔案
```

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
