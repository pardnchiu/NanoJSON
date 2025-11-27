function typeSelect(node, isReadonly) {
  return _label._([
    // * icon
    (_ => {
      if (node[_type][_toLowerCase]() === _number) {
        return icon[_number]
      }
      else if (node[_type][_toLowerCase]() === _boolean) {
        return icon[_boolean]
      }
      else if (node[_type][_toLowerCase]() === _array) {
        return icon[_array]
      }
      else if (node[_type][_toLowerCase]() === _object) {
        return icon[_object]
      }
      else {
        return icon[_string]
      }
    })(),
    // * select
    _select._({
      [_disabled]: isReadonly ? "" : null,
    }, [
      ...[_string, _number, _boolean, _array, _object].map(e => _option._({
        [_value]: e,
        [_selected]: e === node[_type]
      }, e))
    ])._({
      change: e => {
        node[_type] = e[_target][_value];
        if (OBJ_CHECKER[e[_target][_value][_toLowerCase]()]) {
          node[_value] = "";

          if (node[_children][_length] === 0) {
            node.addChild();
          };
        }
        else if (e[_target][_value][_toLowerCase]() === _number) {
          const value = parseFloat(node[_value]);
          node[_value] = isNaN(value) ? "" : value;
        }
        else {
          node[_value] = '';
          node[_children] = [];
        };

        node.updateChild();

        document.getElementById("value-" + node.id).focus();
      }
    })
  ])
};