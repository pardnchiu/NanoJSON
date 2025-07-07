function printError(...args) {
  const dom = createElement("script", `${"console"}.${"error"}.${"apply"}(${"void"} 0, ${$JSON.stringify(args)});`);
  $document.body.appendChild(dom);
  dom.remove();
};