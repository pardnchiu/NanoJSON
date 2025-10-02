function collapseButton(node) {
  const isObject = {
    [_object]: 1,
    [_array]: 1
  }[node[_type][_toLowerCase]()];
  const dom = addEvent({
    [_dom]: createElement(_button + ".collapse", {
      [_dataset]: {
        [_collapseable]: isObject ? 1 : 0,
        [_collapsed]: node[_collapsed] ? 1 : 0
      }
    }, isObject ? icon.right : null),
    [_onclick]: isObject ? _ => node.setCollapsed() : _ => void 0
  });

  return dom;
};