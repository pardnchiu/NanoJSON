# NanoJSON - Architecture

> Back to [README](../README.md)

## Overview

```mermaid
graph TB
    Dev[Developer Config] --> JE[JSONEditor]
    JE --> Data[getJSON Data Loading]
    JE --> Tree[JSONEditorNode Tree]
    Tree --> Render[DOM Renderers]
    JE --> LC[Lifecycle]
    JE --> IO[Import / Export]
```

## Module: JSONEditor

The root controller. Mounts to the DOM, loads the initial data, manages the child node tree, and coordinates import/export with the lifecycle.

```mermaid
graph TB
    subgraph JSONEditor
        Init[#init] --> Mount[Mount to id or create section]
        Init --> LoadJSON[getJSON loads data]
        LoadJSON --> ToChildren[#jsonToChildren builds tree]
        ToChildren --> Nodes[JSONEditorNode array]
        Render[render] --> Nodes
        Import[import/export/reset] --> ToChildren
        Insert[insert] --> Nodes
    end
    CSS[loadCSS] --> Init
    Config[config: title/readonly/collapsed/button/when] --> Init
```

## Module: JSONEditorNode

A recursive tree node. Manages its own key, type, children, and collapsed state, and handles its own local DOM re-render.

```mermaid
graph TB
    subgraph JSONEditorNode
        Create[#create renders] --> Collapse[buttonToCollapseNode]
        Create --> Key[keyInput]
        Create --> TypeSel[typeSelect]
        Create --> Value[valueInput]
        Create --> AddSub[buttonToAddSubNode]
        Add[#add] --> Create
        Remove[#remove] --> Update[#update]
        JsonGetter[json getter #json] --> Children[recurse into children]
    end
    Parent[Parent / JSONEditor] --> Create
```

## Module: Lifecycle

Centralizes the six lifecycle hooks and applies a 300ms debounce to update events to avoid excessive triggering.

```mermaid
graph TB
    subgraph Lifecycle
        RenderFn[render] --> BeforeRender[beforeRenderCallback]
        BeforeRender -->|returns false: abort| Cancel1[Cancelled]
        BeforeRender --> Rendered[renderedCallback]
        UpdateFn[update] --> Debounce[300ms setTimeout]
        Debounce --> BeforeUpdate[beforeUpdateCallback]
        BeforeUpdate -->|returns false: abort| Cancel2[Cancelled]
        BeforeUpdate --> Updated[updatedCallback]
        DestroyFn[destroy] --> BeforeDestroy[beforeDestroyCallback]
        BeforeDestroy --> Destroyed[destroyedCallback]
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant JSONEditor
    participant JSONEditorNode
    participant Lifecycle
    User->>JSONEditor: new JSONEditor(config)
    JSONEditor->>JSONEditor: getJSON(file/json/path)
    JSONEditor->>JSONEditorNode: #jsonToChildren(data)
    JSONEditorNode-->>JSONEditor: node tree
    JSONEditor->>Lifecycle: render(callback)
    Lifecycle->>Lifecycle: beforeRenderCallback
    Lifecycle->>JSONEditor: run callback
    User->>JSONEditorNode: edit value / type / key
    JSONEditorNode->>Lifecycle: update(callback)
    Lifecycle->>Lifecycle: 300ms debounce, then beforeUpdate/updated
    User->>JSONEditor: export()
    JSONEditor-->>User: downloads JSON file
```

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
