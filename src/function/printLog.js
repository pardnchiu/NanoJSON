function printLog(...args) {
    const dom = createElement(_script, `${_console}.${_log}.${_apply}(${_void} 0, ${$JSON[_stringify](args)});`);
    $document[_body][_appendChild](dom);
    dom[_remove]();
};