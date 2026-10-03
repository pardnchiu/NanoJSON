# nanojson - Architecture

> Back to [README](../README.md)

## Overview

```mermaid
graph TB
    A[Source: Object / File / URL] --> B[getJSON]
    B --> C[JSONEditor]
    C -->|jsonToChildren| D[JSONEditorNode Tree]
    D --> E[DOM Renderers]
    E --> F[createElement: String.prototype._]
    C --> G[Lifecycle]
    D --> G
    E --> G
    C --> H[json getter / export Download]
    D --> H
```

## Module: JSONEditor

The root controller: loads config and styles, converts data into a node tree, mounts the DOM, and exposes the public import, export, and read-only methods.

```mermaid
graph TB
    subgraph JSONEditor
        CTOR[constructor] --> CSS[loadCSS]
        CTOR --> INIT[#init async]
        INIT --> LC[Create Lifecycle]
        INIT --> LOAD[getJSON: file ?? json ?? path]
        LOAD --> J2C[#jsonToChildren]
        INIT --> MOUNT[Mount: id element or new section]
        MOUNT --> FOOT[footer: Add / Open / Download / Reset]
        INIT --> RENDER[render]
        IMPORT[import] --> LOAD
        IMPORT --> RENDER
        RESET[reset] --> IMPORT
        INSERT[insert] --> RENDER
        JSON[json getter]
        EXPORT[export]
        RO[enable / disable]
    end
    Config[config] --> CTOR
    J2C --> Node[JSONEditorNode]
    RENDER --> Node
    RENDER -->|isUpdate and initialized| Life[Lifecycle.update]
```

## Module: JSONEditorNode

The recursive node: holds key / type / value / children, builds and caches its own DOM, and swaps only its subtree.

```mermaid
graph TB
    subgraph JSONEditorNode
        R[render] --> C[#create]
        C --> DOM[#dom cache]
        UC[updateChild] --> C
        UC --> U[#update]
        SC[setCollapsed] --> C
        AC[addChild] --> ADD[#add]
        ADD --> U
        REM[#remove] --> U
        J[json getter] --> JS[#json recursive]
    end
    C --> Col[buttonToCollapseNode]
    C --> Key[keyInput]
    C --> Type[typeSelect]
    C --> Val[valueInput]
    C --> Sub[buttonToAddSubNode]
    U --> Life[Lifecycle.update]
    Col --> SC
    Sub --> ADD
    Type --> UC
```

## Module: DOM Renderers

Stateless functions in `src/function/` that build each control of a single node.

```mermaid
graph LR
    subgraph Renderers
        CE[createElement: String.prototype._]
        KI[keyInput: key textarea / array index]
        TS[typeSelect: type dropdown]
        VI[valueInput: textarea / boolean dropdown]
        BC[buttonToCollapseNode: collapse button]
        BA[buttonToAddSubNode: child container and add button]
        RK[randomKey: 64-character id]
        GT[getType: type derivation]
    end
    KI --> CE
    TS --> CE
    VI --> CE
    BC --> CE
    BA --> CE
    KI -->|input| Life[Lifecycle.update]
    VI -->|input / change| Life
    TS -->|change| Node[node.updateChild]
```

## Module: Lifecycle

Manages the six hooks; a `before*` hook cancels by returning `false` synchronously, and updates are merged by a 300ms debounce.

```mermaid
classDiagram
    class Lifecycle {
        -beforeRenderCallback
        -renderedCallback
        -beforeUpdateCallback
        -updatedCallback
        -beforeDestroyCallback
        -destroyedCallback
        -updateTimer
        +render(cb)
        +update(cb)
        +destroy(cb)
    }
    class JSONEditor {
        +children
        +body
        +editor
        +json
        +type
        +import(data)
        +export()
        +reset()
        +enable()
        +disable()
        +render(isUpdate)
        +insert()
    }
    class JSONEditorNode {
        +id
        +key
        +type
        +value
        +parent
        +children
        +collapsed
        +json
        +render()
        +addChild()
        +updateChild()
        +setCollapsed()
    }
    JSONEditor "1" *-- "1" Lifecycle
    JSONEditor "1" o-- "*" JSONEditorNode
    JSONEditorNode "1" o-- "*" JSONEditorNode
    JSONEditorNode --> Lifecycle
```

## Data Flow

### Initialization

```mermaid
sequenceDiagram
    participant App as Application
    participant E as JSONEditor
    participant G as getJSON
    participant N as JSONEditorNode
    participant L as Lifecycle
    App->>E: new JSONEditor(config)
    E->>E: loadCSS(css)
    E-->>App: Returns instance (body not yet assigned)
    E->>L: Create Lifecycle(when)
    E->>G: getJSON(file ?? json ?? path)
    G-->>E: Data ({} on failure, never resolves on non-2xx HTTP)
    E->>N: #jsonToChildren builds the node tree
    E->>E: Mount DOM, insert() when there are no nodes
    E->>L: render(callback)
    L->>App: beforeRender()
    L->>E: callback: render() and apply read-only
    E->>N: render() builds DOM
    L->>App: rendered()
```

### Edit Update

```mermaid
sequenceDiagram
    participant U as User
    participant V as valueInput / keyInput
    participant N as JSONEditorNode
    participant L as Lifecycle
    participant App as Application
    U->>V: Type
    V->>N: Update key / value
    V->>L: update()
    L->>L: clearTimeout and restart the 300ms timer
    U->>V: Keep typing
    V->>L: update()
    L->>L: Restart timer
    Note over L: 300ms after input stops
    L->>App: beforeUpdate()
    L->>App: updated()
    App->>App: Read editor.json
```

## State Machine

### Update Debounce

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Pending: update()
    Pending --> Pending: update() (restart 300ms)
    Pending --> BeforeUpdate: Timer expires
    BeforeUpdate --> Idle: Returns false
    BeforeUpdate --> Updated: Any other return
    Updated --> Idle: updated()
```

### Node Type Switching

```mermaid
stateDiagram-v2
    state "string / boolean" as Scalar
    state "number" as Number
    state "object / array" as Container
    [*] --> Scalar
    Scalar --> Scalar: Clear value and children
    Scalar --> Number: parseFloat, cleared on failure
    Scalar --> Container: Clear value, add a child if none
    Number --> Scalar: Clear value and children
    Number --> Container: Clear value, keep existing children or add one
    Container --> Container: Keep children
    Container --> Number: Keep children
    Container --> Scalar: Clear value and children
```

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
