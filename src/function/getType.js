function getType(value) {
  // * use ifelse for better minification
  if (Array[_isArray](value)) {
    return _array;
  }
  else if (typeof value === _object) {
    return _object;
  }
  else if (typeof value === _boolean) {
    return _boolean;
  }
  else if (typeof value === _number) {
    return _number;
  };
  return _string;
};