const regexCssClass = /\.([\w_-]+)?/gi;
const regexCssID = /\#([\w_-]+)?/i;
const regexCssTag = /^\w+(?=[\#\.]*)/i;
const htmlBr = "<br>";
const classNameEditor = "pd-json-editor";
const classNameEditorNestedChild = "pd-json-editor-nested-child";
const selectorSubNodes = "button:not(.collapsed), textarea, input, select";

/**
 * * for minimization purpose
 * * char len > 3, and used in 3 or more places
 */
const _appendChild = "appendChild";
const _array = "array";
const _body = "body";
const _boolean = "boolean";
const _display = "display";
const _temp = "temp";
const _push = "push";
const _button = "button";
const _children = "children";
const _collapsed = "collapsed";
const _setAttribute = "setAttribute";
const _dataset = "dataset";
const _true = "true";
const _disabled = "disabled";
const _type = "type";
const _editor = "editor";
const _export = "export";
const _import = "import";
const _innerHTML = "innerHTML";
const _isArray = "isArray";
const _label = "label";
const _section = "section";
const _length = "length";
const _toLowerCase = "toLowerCase";
const _match = "match";
const _nextElementSibling = "nextElementSibling";
const _querySelectorAll = "querySelectorAll";
const _number = "number";
const _object = "object";
const _option = "option";
const _parent = "parent";
const _placeholder = "placeholder";
const _render = "render";
const _replace = "replace";
const _reset = "reset";
const _select = "select";
const _selected = "selected";
const _string = "string";
const _target = "target";
const _textarea = "textarea";
const _title = "title";
const _update = "update";
const _value = "value";
const _readonly = "readonly";
const _lifecycle = "lifecycle";
const _click = "click";
const _download = "download";

const OBJ_CHECKER = {
  [_object]: 1,
  [_array]: 1
}

const defaultCSS = "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.1.7/dist/NanoJSON.css";

let lifecycleAction = {
  beforeRender: "beforeRender",
  beforeUpdate: "beforeUpdate",
  beforeDestroy: "beforeDestroy",
  rendered: "rendered",
  updated: "updated",
  destroyed: "destroyed"
};

function loadCSS(url) {
  for (let e of [
    "link"._({
      rel: "preload",
      href: url,
      as: "style"
    }),
    "link"._({
      rel: "stylesheet",
      href: url,
    })
  ]) {
    document.head[_appendChild](e);
  };
}

let icon = {
  [_number]: "M5.5 15v-4.5H4V9h3v6H5.5zM9 15v-2.5c0-.283.096-.52.287-.713A.967.967 0 0110 11.5h2v-1H9V9h3.5c.283 0 .52.096.713.287.191.192.287.43.287.713v1.5c0 .283-.096.52-.287.713a.968.968 0 01-.713.287h-2v1h3V15H9zm6 0v-1.5h3v-1h-2v-1h2v-1h-3V9h3.5c.283 0 .52.096.712.287.192.192.288.43.288.713v4c0 .283-.096.52-.288.713A.968.968 0 0118.5 15H15z",
  [_string]: "M17 15a.968.968 0 01-.712-.287A.968.968 0 0116 14v-4c0-.283.096-.52.288-.713A.968.968 0 0117 9h3c.283 0 .52.096.712.287.192.192.288.43.288.713v1h-1.5v-.5h-2v3h2V13H21v1c0 .283-.096.52-.288.713A.968.968 0 0120 15h-3zm-7.5 0V9h4c.283 0 .52.096.713.287.191.192.287.43.287.713v1c0 .283-.096.52-.287.713A.968.968 0 0113.5 12c.283 0 .52.096.713.287.191.192.287.43.287.713v1c0 .283-.096.52-.287.713A.968.968 0 0113.5 15h-4zm1.5-3.75h2v-.75h-2v.75zm0 2.25h2v-.75h-2v.75zM3 15v-5c0-.283.096-.52.288-.713A.968.968 0 014 9h3c.283 0 .52.096.713.287.191.192.287.43.287.713v5H6.5v-1.5h-2V15H3zm1.5-3h2v-1.5h-2V12z",
  [_object]: "M13.5 18v-1.5h2.25c.213 0 .39-.072.534-.216a.726.726 0 00.216-.534v-1.5c0-.475.137-.906.413-1.294A2.233 2.233 0 0118 12.131v-.262a2.233 2.233 0 01-1.087-.825A2.184 2.184 0 0116.5 9.75v-1.5a.726.726 0 00-.216-.534.726.726 0 00-.534-.216H13.5V6h2.25a2.17 2.17 0 011.594.656c.437.438.656.969.656 1.594v1.5c0 .213.072.39.216.534a.726.726 0 00.534.216h.75v3h-.75a.726.726 0 00-.534.216.726.726 0 00-.216.534v1.5a2.17 2.17 0 01-.656 1.594A2.17 2.17 0 0115.75 18H13.5zm-5.25 0a2.17 2.17 0 01-1.594-.656A2.17 2.17 0 016 15.75v-1.5a.726.726 0 00-.216-.534.726.726 0 00-.534-.216H4.5v-3h.75c.213 0 .39-.072.534-.216A.726.726 0 006 9.75v-1.5c0-.625.219-1.156.656-1.594A2.17 2.17 0 018.25 6h2.25v1.5H8.25a.726.726 0 00-.534.216.726.726 0 00-.216.534v1.5c0 .475-.138.906-.412 1.294A2.233 2.233 0 016 11.869v.262c.45.163.813.438 1.088.825.274.388.412.819.412 1.294v1.5c0 .213.072.39.216.534a.726.726 0 00.534.216h2.25V18H8.25z",
  [_array]: "M14.625 19v-1.75h2.625V6.75h-2.625V5H19v14h-4.375zM5 19V5h4.375v1.75H6.75v10.5h2.625V19H5z",
  [_boolean]: "M7.91 16.818c-1.365 0-2.524-.477-3.478-1.432C3.477 14.432 3 13.273 3 11.91c0-1.364.477-2.523 1.432-3.477C5.386 7.477 6.545 7 7.909 7h8.182c1.363 0 2.523.477 3.477 1.432.955.954 1.432 2.114 1.432 3.477 0 1.364-.477 2.523-1.432 3.477-.954.955-2.114 1.432-3.477 1.432H7.909zm0-1.636h8.18c.9 0 1.671-.32 2.312-.962.641-.64.962-1.41.962-2.31 0-.9-.32-1.671-.962-2.312a3.151 3.151 0 00-2.311-.962H7.909c-.9 0-1.67.32-2.311.962a3.151 3.151 0 00-.962 2.311c0 .9.32 1.67.962 2.311.64.641 1.411.962 2.311.962zm8.18-.818c.683 0 1.262-.239 1.74-.716a2.367 2.367 0 00.716-1.739c0-.682-.24-1.261-.716-1.739a2.367 2.367 0 00-1.74-.715c-.68 0-1.26.238-1.738.716a2.367 2.367 0 00-.716 1.738c0 .682.239 1.261.716 1.739a2.367 2.367 0 001.739.716z",
  right: "M10 18V6l6 6-6 6z",
  folder: "M4 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 012 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 014 4h6l2 2h8c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412H11.175l-2-2H4v12l2.4-8h17.1l-2.575 8.575a1.95 1.95 0 01-.738 1.038A1.985 1.985 0 0119 20H4zm2.1-2H19l1.8-6H7.9l-1.8 6z",
  add: "M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6z",
  [_download]: "M12 16l-5-5 1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5zm-6 4c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 014 18v-3h2v3h12v-3h2v3c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0118 20H6z",
  clear: "M17.25 18H22v2h-6.75l2-2zm-12.5 2l-2.125-2.125c-.383-.383-.58-.858-.587-1.425-.009-.567.179-1.05.562-1.45l11-11.4c.383-.4.854-.6 1.412-.6.559 0 1.03.192 1.413.575L21.4 8.55c.383.383.575.858.575 1.425 0 .567-.192 1.042-.575 1.425L13 20H4.75zm7.4-2L20 9.95 15.05 5 4 16.4 5.6 18h6.55z"
};
for (let e of Object.keys(icon)) {
  icon[e] = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${icon[e]}" fill="#5F6368"/></svg>`;
}

document.addEventListener("DOMContentLoaded", _ => {
  console.log("NanoJSON: https://github.com/pardnchiu/NanoJSON\nLicense: MIT\nCreator: Pardn Chiu");
});