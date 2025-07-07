
function keyInput(node, index, isArray, lifecycle) {
  function newValue(value) {
    return value.replace(/\n/g, "");
  };
  function updateValue(event) {
    const _this = event.target;
    _this.value = _this.nextElementSibling.innerHTML = newValue(_this.value);

    node.key = newValue(_this.value).trim();
  };
  return isArray
    ? createElement("span.array-index", index)
    : createElement("label", [
      addEvent({
        dom: createElement("textarea#key-" + node.id, {
          placeholder: "KEY"
        }, node.key.replace(/\n/g, "")),
        oninput: e => {
          updateValue(e);
          lifecycle.update(() => void 0);
        },
        onchange: e => {
          updateValue(e);
        }
      }),
      createElement("pre", newValue(node.key))
    ]);
};