// * create Element
String.prototype._ = function (val0, val1) {
  const tag = this.toString();
  const cssTag = ((tag[_match](regexCssTag) || [])[0] || "").trim();
  const cssID = ((tag[_match](regexCssID) || [])[1] || "").trim();
  const cssClass = (regexCssClass.test(tag) ? tag[_match](regexCssClass) : []).map(e => e[_replace](/^\./, ""));

  if (cssTag[_length] < 1) {
    return;
  };

  let isTemp = tag === _temp;
  let dom = isTemp
    ? document.createDocumentFragment()
    : document.createElement(cssTag);

  if (cssID[_length] > 0) {
    dom.id = cssID;
  };

  for (const e of cssClass) {
    dom.classList.add(e);
  };

  if (val0 == null && val1 != null) {
    [val0, val1] = [val1, null];
  };

  let attributeValue;
  let childrenValue;

  if (val0 != null && val1 != null) {
    [attributeValue, childrenValue] = [val0, val1];
  }
  else if (val1 == null) {
    if (typeof val0 === _string || typeof val0 === _number || Array[_isArray](val0)) {
      childrenValue = val0;
    }
    else {
      attributeValue = val0;
    };
  }
  else if (val0 == null) {
    return dom;
  };

  (_ => {
    if (typeof attributeValue !== _object || attributeValue == null) {
      return;
    };

    for (const e in attributeValue) {
      if (!attributeValue.hasOwnProperty(e)) {
        continue;
      };

      const value = attributeValue[e];

      if ({
        [_value]: 1,
        innerText: 1,
        [_innerHTML]: 1,
        textContent: 1,
        contentEditable: 1,
        [_selected]: 1,
        checked: 1
      }[e]) {
        dom[e] = value;
      }
      else if ({
        [_display]: 1,
        color: 1,
        backgroundColor: 1,
        background: 1,
        width: 1,
        height: 1,
        float: 1
      }[e]) {
        dom.style[e] = value;
      }
      else if (e === _dataset && typeof value === _object) {
        for (const k of Object.keys(value)) {
          dom[_dataset][k] = value[k];
        };
      }
      else if (value != null) {
        dom[_setAttribute](e, value);
      };
    };
  })();

  (_ => {
    if (childrenValue == null) {
      return;
    };

    if (Array[_isArray](childrenValue)) {
      for (let e of childrenValue) {
        if (typeof e === _string || typeof e === _number) {
          if (isTemp) {
            dom[_appendChild](document.createTextNode(e))
          }
          else {
            dom[_innerHTML] += e;
          }
        }
        else if (e instanceof Element) {
          dom[_appendChild](e);
        };
      };
      return;
    }
    else if (typeof childrenValue === _object) {
      return;
    };

    const value = childrenValue;

    if (cssTag === "img" || cssTag === "source") {
      dom.src = value;
    }
    else if (cssTag === _textarea || cssTag === "input") {
      dom[_value] = value
    }
    else if (isTemp) {
      dom[_appendChild](document.createTextNode(childrenValue))
    }
    else {
      dom[_innerHTML] = value;
    };
  })();

  return dom;
};

// * add Event
HTMLElement.prototype._ = function (config = {}) {
  if (typeof config !== _object) {
    return;
  };

  let dom = this;

  for (const key of Object.keys(config)) {
    dom["on" + key] = e => config[key](e);
  };

  return dom;
};