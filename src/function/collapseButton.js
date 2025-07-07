function collapseButton(node) {
  const isObject = {
    object: 1,
    array: 1
  }[node.type.toLowerCase()];

  const dom = addEvent({
    dom: createElement("button", {
      dataset: {
        collapsible: isObject ? 1 : 0,
        collapsed: node.collapsed ? 1 : 0
      }
    }, isObject ? icon.right : null),
    onclick: isObject ? _ => node.setCollapsed() : _ => void 0
  });

  return dom;
};