function getJSON(data) {
    return new $Promise(async (res, _) => {
        if (data == null) {
            res({});
            return;
        };

        if (data instanceof $File) {
            const reader = new $FileReader();
            reader[_onload] = e => {
                try {
                    res($JSON[_parse](e[_target].result));
                }
                catch (err) {
                    printError(`Failed to parse JSON from file ${data[_name]}: ${err}`);
                    res({});
                };
            };
            reader[_readAsText](data);
        }
        else if (typeof data === _object) {
            res(data);
        }
        else if (typeof data === _string) {
            await $fetch(data)
            [_then](res => res[_text]())
            [_then](data => {
                try {
                    res($JSON[_parse](data));
                }
                catch (err) {
                    throw (err);
                }
            })
            [_catch](err => {
                printError(`Failed to fetch data from ${data}: ${err}`);
                res({});
            });
        }
        else {
            printError(`Invalid data type: ${data} (${typeof data})`);
            res({});
        };
    });
};