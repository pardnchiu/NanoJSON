# Update Log

> Generated: 2026-01-01 02:00

## Recommended Commit Message

```
DOC: Update README structure and add translation note
FIX: Improve number input validation logic
STYLE: Fix CSS layout for pre and textarea
```

***

## Summary

修正文檔結構與數字輸入驗證邏輯，並調整樣式顯示

## Changes

### DOC
- **[README.md]**: 新增 ChatGPT 翻譯註記、重新組織目錄結構、調整段落標題與內容描述、移除 Author badge、移動授權說明至獨立章節
- **[README.zh.md]**: 調整目錄結構、標題層級改為「三大核心特色」、移除 Author badge、移動授權說明至獨立章節、新增補充章節

### FIX
- **[valueInput.js]**: 修正數字輸入驗證邏輯，允許輸入負號與小數點前導符號（`-` 和 `.`）
- **[dist/NanoJSON.esm.js]**: 同步修正數字輸入驗證邏輯
- **[dist/NanoJSON.js]**: 同步修正數字輸入驗證邏輯

### STYLE
- **[src/sass/NanoJSON.scss]**: pre 元素新增 `width: 100%`、textarea 新增 `text-align: left`
- **[dist/NanoJSON.css]**: 同步樣式更新

***

## Summary

Fixed documentation structure and number input validation logic, along with style adjustments

## Changes

### DOC
- **[README.md]**: Add ChatGPT translation note, reorganize table of contents, adjust section titles and descriptions, remove Author badge, move license description to separate section
- **[README.zh.md]**: Adjust table of contents structure, change heading to "三大核心特色", remove Author badge, move license description to separate section, add supplementary section

### FIX
- **[valueInput.js]**: Fix number input validation to allow leading minus and decimal point (`-` and `.`)
- **[dist/NanoJSON.esm.js]**: Sync number input validation fix
- **[dist/NanoJSON.js]**: Sync number input validation fix

### STYLE
- **[src/sass/NanoJSON.scss]**: Add `width: 100%` to pre element, add `text-align: left` to textarea
- **[dist/NanoJSON.css]**: Sync style updates

***

## Files Changed

| File | Status | Tag |
|------|--------|-----|
| `README.md` | Modified | DOC |
| `README.zh.md` | Modified | DOC |
| `dist/NanoJSON.css` | Modified | STYLE |
| `dist/NanoJSON.esm.js` | Modified | FIX, UPDATE |
| `dist/NanoJSON.js` | Modified | FIX, UPDATE |
| `src/function/valueInput.js` | Modified | FIX |
| `src/sass/NanoJSON.scss` | Modified | STYLE |
