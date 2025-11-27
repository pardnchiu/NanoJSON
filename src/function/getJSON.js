function getJSON(data) {
  return new Promise(async (cb, _) => {
    if (data == null) {
      cb();
      return;
    };

    if (data instanceof File) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const json = JSON.parse(e[_target].result);
          cb(json);
        }
        catch (err) {
          console.error(`Failed to parse JSON from file ${data.name}: ${err}`);
          cb();
        };
      };
      reader.readAsText(data);
    }
    else if (typeof data === _object) {
      cb(data);
    }
    else if (typeof data === _string) {
      try {
        const result = await fetch(data);

        if (result.ok) {
          const text = await result.text();
          const json = JSON.parse(text);
          cb(json);
        }
      } catch (err) {
        console.error(`Failed to fetch data from ${data}: ${err}`);
        cb();
      };
    }
    else {
      console.error(`Invalid data [_type]: ${data} (${typeof data})`);
      cb();
    };
  });
};