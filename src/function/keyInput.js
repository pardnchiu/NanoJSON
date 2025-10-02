
function keyInput(node, index, isArray, isReadonly, lifecycle) {
  function newValue(value) {
    return value[_replace](/\n/g, "");
  };
  function updateValue(event) {
    const _this = event[_target];
    _this[_value] = _this[_nextElementSibling][_innerHTML] = newValue(_this[_value]);

    node[_key] = newValue(_this[_value])[_trim]();
  };
  return isArray
    ? createElement("span.array-index", index)
    : createElement(_label, [
      addEvent({
        [_dom]: createElement("textarea#key-" + node.id, {
          [_placeholder]: "KEY",
          "disabled": isReadonly ? "" : null,
        }, node[_key][_replace](/\n/g, "")),
        [_oninput]: e => {
          updateValue(e);
          lifecycle[_update](() => void 0);
        },
        [_onchange]: e => {
          updateValue(e);
        }
      }),
      createElement("pre", newValue(node[_key]))
    ]);
};