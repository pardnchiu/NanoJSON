function printLog(...args) {
  const dom = createElement("script", `${"console"}.${"log"}.${"apply"}(${"void"} 0, ${$JSON.stringify(args)});`);
  $document.body.appendChild(dom);
  dom.remove();
};