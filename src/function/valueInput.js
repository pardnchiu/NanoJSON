function valueInput(node, lifecycle) {
  if (node.type.toLowerCase() === "number") {
    const regex = /[^\d\-\.]/g;
    const value = $parseFloat(node.value);

    function newValue(value) {
      return $isNaN(value) ? "" : $String(value).replace(/\s/g, "").replace(regex, "");
    };

    return createElement("label", [
      addEvent({
        dom: createElement(
          "textarea#value-" + node.id,
          {
            placeholder: "NUM"
          },
          newValue(value)
        ),
        oninput: e => {
          console.log("onchange", e);
          const _this = e.target;
          _this.value = _this.nextElementSibling.innerHTML = newValue(_this.value);

          node.value = newValue(_this.value);
          lifecycle.update(() => { });
        },
        onchange: e => {
          console.log("onchange", e);
          const _this = e.target;
          _this.value = _this.nextElementSibling.innerHTML = newValue(_this.value);

          node.value = newValue(_this.value);
        }
      }),
      createElement("pre", newValue(value))
    ]);
  }
  else if (node.type.toLowerCase() === "boolean") {
    if (node.value.trim().length < 1) {
      node.value = "true";
    };
    return addEvent({
      dom: createElement("select#value-" + node.id, [
        createElement("option", {
          value: "true",
          selected: node.value === "true"
        }, "true"),
        createElement("option", {
          value: "false",
          selected: node.value === "false"
        }, "false")
      ]),
      onchange: e => {
        node.value = e.target.value;
        lifecycle.update(() => void 0);
      }
    });
  }
  else {
    const isObject = {
      object: 1,
      array: 1
    }[node.type.toLowerCase()];

    function showValue(value) {
      return value.replace(/\n/g, htmlBr);
    };

    return createElement("label", {
      display: isObject ? "none" : "block"
    }, [
      addEvent({
        dom: createElement("textarea#value-" + node.id, {
          placeholder: "VAL"
        }, node.value),
        oninput: e => {
          const _this = e.target;
          _this.nextElementSibling.innerHTML = showValue(_this.value);

          node.value = _this.value;
          lifecycle.update(() => void 0);
        },
        onchange: e => {
          const _this = e.target;
          _this.nextElementSibling.innerHTML = showValue(_this.value);

          node.value = _this.value;
        }
      }),
      createElement("pre", showValue(node.value))
    ]);
  };
};