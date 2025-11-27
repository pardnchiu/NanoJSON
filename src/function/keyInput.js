
function keyInput(node, index, isArray, isReadonly, lifecycle) {
  function newValue(value) {
    return value[_replace](/\n/g, "");
  };

  function updateValue(event) {
    const _this = event[_target];
    _this[_value] = _this[_nextElementSibling][_innerHTML] = newValue(_this[_value]);

    node.key = newValue(_this[_value]).trim();
  };
  return isArray
    ? "span.array-index"._(index)
    : _label._([
      (_textarea + "#key-" + node.id)._({
        [_placeholder]: "KEY",
        [_disabled]: isReadonly ? "" : null,
      }, node.key[_replace](/\n/g, ""))._({
        input: e => {
          updateValue(e);
          lifecycle[_update](() => void 0);
        },
        change: e => {
          updateValue(e);
        }
      }),
      "pre"._(newValue(node.key))
    ]);
};