function getJSON(data) {
  return new $Promise(async (res, _) => {
    if (data == null) {
      res({});
      return;
    };

    if (data instanceof $File) {
      const reader = new $FileReader();
      reader.onload = e => {
        try {
          res($JSON.parse(e.target.result));
        }
        catch (err) {
          printError(`Failed to parse JSON from file ${data.name}: ${err}`);
          res({});
        };
      };
      reader.readAsText(data);
    }
    else if (typeof data === "object") {
      res(data);
    }
    else if (typeof data === "string") {
      await $fetch(data).
        then(res => res.text()).
        then(data => {
          try {
            res($JSON.parse(data));
          }
          catch (err) {
            throw (err);
          }
        }).
        catch(err => {
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