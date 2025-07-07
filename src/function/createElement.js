function createElement(tag = "", val0, val1) {
  const cssTag = ((tag.match(regexCssTag) || [])[0] || "").trim();
  const cssID = ((tag.match(regexCssID) || [])[1] || "").trim();
  const cssClass = (regexCssClass.test(tag) ? tag.match(regexCssClass) : []).map(e => e.replace(/^\./, ""));

  if (cssTag.length < 1) {
    return;
  };

  let isTemp = tag === "temp";
  let dom = isTemp
    ? $document.createDocumentFragment()
    : $document.createElement(cssTag);

  if (cssID.length > 0) {
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
    if (typeof val0 === "string" || typeof val0 === "number" || $Array.isArray(val0)) {
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
    if (typeof attributeValue !== "object" || attributeValue == null) {
      return;
    };

    for (const e in attributeValue) {
      if (!attributeValue.hasOwnProperty(e)) {
        continue;
      };

      const value = attributeValue[e];

      if ({
        value: 1,
        innerText: 1,
        innerHTML: 1,
        textContent: 1,
        contentEditable: 1,
        selected: 1,
        checked: 1
      }[e]) {
        dom[e] = value;
      }
      else if ({
        display: 1,
        color: 1,
        backgroundColor: 1,
        background: 1,
        width: 1,
        height: 1,
        float: 1
      }[e]) {
        dom.style[e] = value;
      }
      else if (e === "dataset" && typeof value === "object") {
        for (const k of $Object.keys(value)) {
          dom.dataset[k] = value[k];
        };
      }
      else if (value != null) {
        dom.setAttribute(e, value);
      };
    };
  })();

  (_ => {
    if (childrenValue == null) {
      return;
    };

    const isObj = typeof childrenValue === "object";
    const isAry = $Array.isArray(childrenValue);

    if (isAry) {
      for (let e of childrenValue) {
        const isStr = typeof e === "string";
        const isNum = typeof e === "number";
        const isElm = e instanceof Element;

        if (isStr || isNum) {
          if (isTemp) {
            dom.appendChild($document.createTextNode(e))
          }
          else {
            dom.innerHTML += e;
          }
        }
        else if (isElm) {
          dom.appendChild(e);
        };
      };
      return;
    }
    else if (isObj) {
      return;
    };

    const value = childrenValue;
    const isImg = (cssTag === "img");
    const isSource = (cssTag === "source");
    const isInput = (cssTag === "input");
    const isTextarea = (cssTag === "textarea");

    if (isImg || isSource) {
      dom.src = value;
    }
    else if (isTextarea || isInput) {
      dom.value = value
    }
    else if (isTemp) {
      dom.appendChild($document.createTextNode(childrenValue))
    }
    else {
      dom.innerHTML = value;
    };
  })();

  return dom;
};