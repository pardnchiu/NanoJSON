# 唯讀模式

本頁說明 `readonly` 設定與 `enable()` / `disable()` 如何切換唯讀，以及哪些元件會被停用。

## 運作方式

唯讀不是逐節點傳遞的旗標，而是對整棵已渲染的 DOM 批次切換 `disabled` 屬性：

| 觸發 | 動作 |
|---|---|
| 設定 `readonly: true` | 初次渲染完成後設定 `body.dataset.readonly = 1`，並對所有符合選擇器的元素加上 `disabled` |
| `editor.disable()` | 同上（`JSONEditor.js:178-183`） |
| `editor.enable()` | 設定 `body.dataset.readonly = 0`，並移除所有符合選擇器元素的 `disabled`（`JSONEditor.js:171-176`） |

選擇器為 `selectorSubNodes`（`src/data.js`）：`button:not(.collapsed), textarea, input, select`。折疊按鈕不受影響，唯讀時仍可展開與收合節點。

## 之後建立的節點

節點重新渲染時，`keyInput()` 與 `typeSelect()` 會讀取 `body.dataset.readonly`，鍵輸入框與型別下拉選單維持停用；其餘元件（值輸入框、移除與新增子節點按鈕）由 `#create()` 重建時不會帶 `disabled`。因此唯讀狀態下若有節點重新渲染（例如經程式呼叫 `import()`），需再呼叫一次 `disable()`。

## 鉤子

切換唯讀不會觸發任何 `Lifecycle` 鉤子。

## 範例

以唯讀模式啟動；收合按鈕仍可操作，3 秒後呼叫 `enable()`：

```demo
<section id="editor"></section>
<script>
  const editor = new JSONEditor({
    id: "editor",
    fill: false,
    readonly: true,
    json: { name: "NanoJSON", tags: ["json", "editor"] },
    when: {
      rendered: () => setTimeout(() => {
        editor.enable();
        console.log("enable()");
      }, 3000),
    },
  });
</script>
```

## 延伸閱讀

- `readonly` 設定與 `enable()` / `disable()` 簽章：[API 參考](/zh/api-reference)
- 節點如何重新渲染：[核心概念](/zh/core-concepts)
