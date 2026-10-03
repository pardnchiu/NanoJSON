# nanojson - 架構

> 返回 [README](./README.zh.md)

## 概覽

```mermaid
graph TB
    A[資料來源：物件 / File / URL] --> B[getJSON]
    B --> C[JSONEditor]
    C -->|jsonToChildren| D[JSONEditorNode 樹]
    D --> E[DOM 渲染函式]
    E --> F[createElement：String.prototype._]
    C --> G[Lifecycle]
    D --> G
    E --> G
    C --> H[json getter / export 下載]
    D --> H
```

## Module: JSONEditor

根控制器：載入設定與樣式、將資料轉為節點樹、掛載 DOM，並提供匯入、匯出、唯讀切換等公開方法。

```mermaid
graph TB
    subgraph JSONEditor
        CTOR[constructor] --> CSS[loadCSS]
        CTOR --> INIT[#init 非同步]
        INIT --> LC[建立 Lifecycle]
        INIT --> LOAD[getJSON：file ?? json ?? path]
        LOAD --> J2C[#jsonToChildren]
        INIT --> MOUNT[掛載：id 元素或新 section]
        MOUNT --> FOOT[footer：新增 / 開啟 / 下載 / 重置]
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
    RENDER -->|isUpdate 且已初始化| Life[Lifecycle.update]
```

## Module: JSONEditorNode

遞迴節點：持有 key／type／value／children，自行建立並快取 DOM，局部替換子樹。

```mermaid
graph TB
    subgraph JSONEditorNode
        R[render] --> C[#create]
        C --> DOM[#dom 快取]
        UC[updateChild] --> C
        UC --> U[#update]
        SC[setCollapsed] --> C
        AC[addChild] --> ADD[#add]
        ADD --> U
        REM[#remove] --> U
        J[json getter] --> JS[#json 遞迴]
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

## Module: DOM 渲染函式

`src/function/` 中的無狀態函式，負責產生單一節點的各個控制項。

```mermaid
graph LR
    subgraph 渲染函式
        CE[createElement：String.prototype._]
        KI[keyInput：key textarea / 陣列索引]
        TS[typeSelect：型別下拉選單]
        VI[valueInput：textarea / boolean 下拉]
        BC[buttonToCollapseNode：收合按鈕]
        BA[buttonToAddSubNode：子節點容器與新增按鈕]
        RK[randomKey：64 字元 id]
        GT[getType：型別推導]
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

管理六個鉤子，`before*` 同步回傳 `false` 可取消，更新以 300ms 防抖合併。

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

## 資料流

### 初始化

```mermaid
sequenceDiagram
    participant App as 應用程式
    participant E as JSONEditor
    participant G as getJSON
    participant N as JSONEditorNode
    participant L as Lifecycle
    App->>E: new JSONEditor(config)
    E->>E: loadCSS(css)
    E-->>App: 回傳實例（body 尚未指派）
    E->>L: 建立 Lifecycle(when)
    E->>G: getJSON(file ?? json ?? path)
    G-->>E: 資料（失敗時為 {}；HTTP 非 2xx 時永不 resolve）
    E->>N: #jsonToChildren 建立節點樹
    E->>E: 掛載 DOM，無節點時 insert()
    E->>L: render(callback)
    L->>App: beforeRender()
    L->>E: callback：render() 與唯讀套用
    E->>N: render() 建立 DOM
    L->>App: rendered()
```

### 編輯更新

```mermaid
sequenceDiagram
    participant U as 使用者
    participant V as valueInput / keyInput
    participant N as JSONEditorNode
    participant L as Lifecycle
    participant App as 應用程式
    U->>V: 輸入
    V->>N: 更新 key / value
    V->>L: update()
    L->>L: clearTimeout 並重設 300ms 計時
    U->>V: 繼續輸入
    V->>L: update()
    L->>L: 重設計時
    Note over L: 停止輸入 300ms
    L->>App: beforeUpdate()
    L->>App: updated()
    App->>App: 讀取 editor.json
```

## 狀態機

### 更新防抖

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Pending: update()
    Pending --> Pending: update()（重設 300ms）
    Pending --> BeforeUpdate: 計時到期
    BeforeUpdate --> Idle: 回傳 false
    BeforeUpdate --> Updated: 其他回傳值
    Updated --> Idle: updated()
```

### 節點型別切換

```mermaid
stateDiagram-v2
    state "string / boolean" as Scalar
    state "number" as Number
    state "object / array" as Container
    [*] --> Scalar
    Scalar --> Scalar: 清空值與子節點
    Scalar --> Number: parseFloat，失敗則清空
    Scalar --> Container: 清空值，無子節點時補一個
    Number --> Scalar: 清空值與子節點
    Number --> Container: 清空值，保留既有子節點或補一個
    Container --> Container: 保留子節點
    Container --> Number: 保留子節點
    Container --> Scalar: 清空值與子節點
```

***

©️ 2025 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)
