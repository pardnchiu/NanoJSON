function valueInput(node, lifecycle) {
    if (node[_type][_toLowerCase]() === _number) {
        const regex = /[^\d\-\.]/g;
        const value = $parseFloat(node[_value]);

        function newValue(value) {
            return $isNaN(value) ? "" : $String(value)[_replace](/\s/g, "")[_replace](regex, "");
        };

        return createElement(_label, [
            addEvent({
                [_dom]: createElement(
                    "textarea#value-" + node.id,
                    {
                        [_placeholder]: "NUM"
                    },
                    newValue(value)
                ),
                [_oninput]: e => {
                    const _this = e[_target];
                    _this[_value] = _this[_nextElementSibling][_innerHTML] = newValue(_this[_value]);

                    node[_value] = newValue(_this[_value]);
                    lifecycle[_update](() => { });
                },
                [_onchange]: e => {
                    const _this = e[_target];
                    _this[_value] = _this[_nextElementSibling][_innerHTML] = newValue(_this[_value]);

                    node[_value] = newValue(_this[_value]);
                }
            }),
            createElement("pre", newValue(value))
        ]);
    }
    else if (node[_type][_toLowerCase]() === _boolean) {
        if (node[_value][_trim]()[_length] < 1) {
            node[_value] = _true;
        };
        return addEvent({
            [_dom]: createElement("select#value-" + node.id, [
                createElement(_option, {
                    [_value]: _true,
                    [_selected]: node[_value] === _true
                }, _true),
                createElement(_option, {
                    [_value]: _false,
                    [_selected]: node[_value] === _false
                }, _false)
            ]),
            [_onchange]: e => {
                node[_value] = e[_target][_value];
                lifecycle[_update](() => void 0);
            }
        });
    }
    else {
        const isObject = {
            [_object]: 1,
            [_array]: 1
        }[node[_type][_toLowerCase]()];

        function showValue(value) {
            return value[_replace](/\n/g, htmlBr);
        };

        return createElement(_label, {
            display: isObject ? "none" : "block"
        }, [
            addEvent({
                [_dom]: createElement("textarea#value-" + node.id, {
                    [_placeholder]: "VAL"
                }, node[_value]),
                [_oninput]: e => {
                    const _this = e[_target];
                    _this[_nextElementSibling][_innerHTML] = showValue(_this[_value]);

                    node[_value] = _this[_value];
                    lifecycle[_update](() => void 0);
                },
                [_onchange]: e => {
                    const _this = e[_target];
                    _this[_nextElementSibling][_innerHTML] = showValue(_this[_value]);

                    node[_value] = _this[_value];
                }
            }),
            createElement("pre", showValue(node[_value]))
        ]);
    };
};