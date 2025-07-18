function createElement(tag = "", val0, val1) {
    const cssTag = ((tag[_match](regexCssTag) || [])[0] || "")[_trim]();
    const cssID = ((tag[_match](regexCssID) || [])[1] || "")[_trim]();
    const cssClass = (regexCssClass[_test](tag) ? tag[_match](regexCssClass) : [])[_map](e => e[_replace](/^\./, ""));

    if (cssTag[_length] < 1) {
        return;
    };

    let isTemp = tag === _temp;
    let dom = isTemp
        ? $document[_createDocumentFragment]()
        : $document[_createElement](cssTag);

    if (cssID[_length] > 0) {
        dom.id = cssID;
    };

    for (const e of cssClass) {
        dom[_classList][_add](e);
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
        if (typeof val0 === _string || typeof val0 === _number || $Array[_isArray](val0)) {
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
            if (!attributeValue[_hasOwnProperty](e)) {
                continue;
            };

            const value = attributeValue[e];

            if ({
                [_value]: 1,
                [_innerText]: 1,
                [_innerHTML]: 1,
                [_textContent]: 1,
                [_contentEditable]: 1,
                [_selected]: 1,
                [_checked]: 1
            }[e]) {
                dom[e] = value;
            }
            else if ({
                [_display]: 1,
                [_color]: 1,
                [_backgroundColor]: 1,
                [_background]: 1,
                [_width]: 1,
                [_height]: 1,
                [_float]: 1
            }[e]) {
                dom[_style][e] = value;
            }
            else if (e === _dataset && typeof value === _object) {
                for (const k of $Object[_keys](value)) {
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

        const is_object = typeof childrenValue === _object;
        const is_array = $Array[_isArray](childrenValue);

        if (is_array) {
            for (let e of childrenValue) {
                const is_string = typeof e === _string;
                const is_number = typeof e === _number;
                const is_element = e instanceof Element;

                if (is_string || is_number) {
                    if (isTemp) {
                        dom[_appendChild]($document[_createTextNode](e))
                    }
                    else {
                        dom[_innerHTML] += e;
                    }
                }
                else if (is_element) {
                    dom[_appendChild](e);
                };
            };
            return;
        }
        else if (is_object) {
            return;
        };

        const value = childrenValue;
        const is_img = (cssTag === _img);
        const is_source = (cssTag === _source);
        const is_input = (cssTag === _input);
        const is_textarea = (cssTag === _textarea);

        if (is_img || is_source) {
            dom[_src] = value;
        }
        else if (is_textarea || is_input) {
            dom[_value] = value
        }
        else if (isTemp) {
            dom[_appendChild]($document[_createTextNode](childrenValue))
        }
        else {
            dom[_innerHTML] = value;
        };
    })();

    return dom;
};