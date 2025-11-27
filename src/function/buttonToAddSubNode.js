function buttonToAddSubNode(node, subNode, click) {
  if (!OBJ_CHECKER[node[_type][_toLowerCase]()] || node[_collapsed]) {
    return;
  };

  return (_section + "." + classNameEditorNestedChild)._([
    ...node[_children].map((e, i) => subNode(e, i)),
    (_button + ".child-add")._(icon.add)._({
      click
    })
  ]);
};