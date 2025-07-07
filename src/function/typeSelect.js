function typeSelect(node) {
  return createElement("label", [
    (_ => {
      if (node.type.toLowerCase() === "number") {
        return icon["number"]
      }
      else if (node.type.toLowerCase() === "boolean") {
        return icon["boolean"]
      }
      else if (node.type.toLowerCase() === "array") {
        return icon.array
      }
      else if (node.type.toLowerCase() === "object") {
        return icon.object
      }
      else {
        return icon["string"]
      }
    })(),
    addEvent({
      dom: createElement("select", [
        ...types.map(e => createElement("option", {
          value: e,
          selected: e === node.type
        }, e))
      ]),
      onchange: e => {
        node.type = e.target.value;

        const isObject = {
          object: 1,
          array: 1
        }[e.target.value.toLowerCase()];

        if (isObject) {
          node.value = "";

          if (node.children.length === 0) {
            node.addChild();
          };
        }
        else if (e.target.value.toLowerCase() === "number") {
          const value = $parseFloat(node.value);
          node.value = $isNaN(value) ? "" : value;
        }
        else {
          node.value = '';
          node.children = [];
        };

        // * 更新畫面並觸發更新
        node.updateChild();

        $document.getElementById("value-" + node.id).focus();
      }
    })
  ])
};