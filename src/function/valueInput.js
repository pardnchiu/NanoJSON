function valueInput(node, lifecycle) {
  if (node[_type][_toLowerCase]() === _number) {
    const regex = /^-?\d+(\.\d+)?$/;
    const value = parseFloat(node[_value]);

    function newValue(value) {
      return isNaN(value) && value !== "-" && value !== "." ? "" : String(value)[_replace](/\s/g, "");
    };

    return _label._([
      (_textarea + "#value-" + node.id)._({
        [_placeholder]: "NUM"
      },
        newValue(value)
      )._({
        input: e => {
          const _this = e[_target];
          _this[_value] = _this[_nextElementSibling][_innerHTML] = newValue(_this[_value]);

          node[_value] = newValue(_this[_value]);
          lifecycle[_update](() => { });
        },
        change: e => {
          const _this = e[_target];
          _this[_value] = _this[_nextElementSibling][_innerHTML] = newValue(_this[_value]);

          node[_value] = newValue(_this[_value]);
        }
      }),
      "pre"._(newValue(value))
    ]);
  }
  else if (node[_type][_toLowerCase]() === _boolean) {
    if (node[_value].trim()[_length] < 1) {
      node[_value] = _true;
    };
    return ("select#value-" + node.id)._([
      _option._({
        [_value]: _true,
        [_selected]: node[_value] === _true
      }, _true),
      _option._({
        [_value]: "false",
        [_selected]: node[_value] === "false"
      }, "false")
    ])._({
      change: e => {
        node[_value] = e[_target][_value];
        lifecycle[_update](() => void 0);
      }
    });
  }
  else {
    const isObject = OBJ_CHECKER[node[_type][_toLowerCase]()];

    function showValue(value) {
      return value[_replace](/\n/g, htmlBr);
    };

    return _label._({
      [_display]: isObject ? "none" : "block"
    }, [
      (_textarea + "#value-" + node.id)._({
        [_placeholder]: "VAL"
      }, node[_value])._({
        input: e => {
          const _this = e[_target];
          _this[_nextElementSibling][_innerHTML] = showValue(_this[_value]);

          node[_value] = _this[_value];
          lifecycle[_update](() => void 0);
        },
        change: e => {
          const _this = e[_target];
          _this[_nextElementSibling][_innerHTML] = showValue(_this[_value]);

          node[_value] = _this[_value];
        }
      }),
      "pre"._(showValue(node[_value]))
    ]);
  };
};