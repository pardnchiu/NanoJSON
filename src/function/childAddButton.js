function childAddButton(node, childNode, onclick) {
  const isObject = {
    object: 1,
    array: 1
  }[node.type.toLowerCase()];

  if (!isObject || node.collapsed) {
    return;
  };

  return createElement("section", {
    class: "pd-json-editor-nested-child"
  }, [
    ...node.children.map((e, i) => childNode(e, i)),
    addEvent({
      dom: createElement("button" + ".child-add", icon.add),
      onclick: onclick
    })
  ]);
};