function addEvent(config = {}) {
    let dom;

    if (typeof config !== _object || !config[_hasOwnProperty](_dom)) {
        return;
    };

    dom = config[_dom];

    for (const key of $Object[_keys](config)) {
        if (key === _dom) {
            continue;
        };

        dom[key] = e => config[key](e);
    };

    return dom;
};