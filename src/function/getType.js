function getType(value) {
  if ($Array.isArray(value)) {
    return "array";
  }
  else if (typeof value === "object") {
    return "object";
  }
  else if (typeof value === "boolean") {
    return "boolean";
  }
  else if (typeof value === "number") {
    return "number";
  };
  return "string";
};