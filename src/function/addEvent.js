function addEvent(config = {}) {
  let dom;

  if (typeof config !== "object" || !config.hasOwnProperty("dom")) {
    return;
  };

  dom = config.dom;

  for (const key of $Object.keys(config)) {
    if (key === "dom") {
      continue;
    };

    dom[key] = e => config[key](e);
  };

  return dom;
};