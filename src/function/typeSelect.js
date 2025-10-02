function typeSelect(node, isReadonly) {
  return createElement(_label, [
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
    addEvent({
      [_dom]: createElement(_select, {
        "disabled": isReadonly ? "" : null,
      }, [
        ...types[_map](e => createElement(_option, {
          [_value]: e,
          [_selected]: e === node[_type]
        }, e))
      ]),
      [_onchange]: e => {
        node[_type] = e[_target][_value];

        const isObject = {
          [_object]: 1,
          [_array]: 1
        }[e[_target][_value][_toLowerCase]()];

        if (isObject) {
          node[_value] = "";

          if (node[_children][_length] === 0) {
            node.addChild();
          };
        }
        else if (e[_target][_value][_toLowerCase]() === _number) {
          const value = $parseFloat(node[_value]);
          node[_value] = $isNaN(value) ? "" : value;
        }
        else {
          node[_value] = '';
          node[_children] = [];
        };

        // * 更新畫面並觸發更新
        node.updateChild();

        $document[_getElementById]("value-" + node.id)[_focus]();
      }
    })
  ])
};