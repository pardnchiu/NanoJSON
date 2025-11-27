function buttonToCollapseNode(node) {
  const isObject = OBJ_CHECKER[node[_type][_toLowerCase]()];

  return (_button + "." + _collapsed)._({
    [_dataset]: {
      collapsable: isObject ? 1 : 0,
      [_collapsed]: node[_collapsed] ? 1 : 0
    }
  }, isObject ? icon.right : null)._({
    [_click]: isObject ? _ => node.setCollapsed() : _ => void 0
  });
};