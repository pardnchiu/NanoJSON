function printError(...args) {
    const dom = createElement(_script, `${_console}.${_error}.${_apply}(${_void} 0, ${$JSON[_stringify](args)});`);
    $document[_body][_appendChild](dom);
    dom[_remove]();
};