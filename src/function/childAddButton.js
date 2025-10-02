function childAddButton(node, childNode, onclick) {
  const isObject = {
    [_object]: 1,
    [_array]: 1
  }[node[_type][_toLowerCase]()];

  if (!isObject || node[_collapsed]) {
    return;
  };

  return createElement(_section, {
    [_class]: "pd-json-editor-nested-child"
  }, [
    ...node[_children][_map]((e, i) => childNode(e, i)),
    addEvent({
      [_dom]: createElement(_button + ".child-add", icon[_add]),
      [_onclick]: onclick
    })
  ]);
};
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