class JSONEditor {
  children = [];

  body;
  editor;
  button = [];
  #lifecycle;
  #isInit = false;
  #type = "Object";

  get type() {
    return this.#type;
  };

  constructor(config = {}) {
    if (typeof config != "object") {
      printError(`Failed to load config.`);
      return;
    };

    let css = config[_css];
    console.log(1, css);
    if (css == null || typeof css !== _string || css.length < 1) {
      css = "https://cdn.jsdelivr.net/npm/@pardnchiu/nanojson@1.1.3/dist/NanoJSON.css";
    };

    console.log(2, css);

    loadCSS(css);

    this.#init(config);
  }

  async #init(config = {}) {
    this[_editor] = createElement("section");

    const when = config[_when] ?? {};
    const title = config[_title] ?? "";
    const description = config[_description] ?? "";
    const fill = $Boolean(config[_fill] == null ? 1 : config[_fill]) ? 1 : 0;
    const readonly = config["readonly"] ?? false;

    let button = config[_button] != null && typeof config[_button] === _object
      ? config[_button]
      : { [_import]: 1, [_export]: 1, [_reset]: 1 };
    button[_reset] = button[_reset] ?? 1;
    button[_import] = button[_import] ?? 1;
    button[_export] = button[_export] ?? 1;

    this.#lifecycle = new Lifecycle({
      [_beforeRender]: when[lifecycleAction[_beforeRender]],
      [_rendered]: when[lifecycleAction[_rendered]],
      [_beforeUpdate]: when[lifecycleAction[_beforeUpdate]],
      [_updated]: when[lifecycleAction[_updated]],
      [_beforeDestroy]: when[lifecycleAction[_beforeDestroy]],
      [_destroyed]: when[lifecycleAction[_destroyed]],
    });

    let json = await getJSON(config.file ?? config.json ?? config.path);
    this.children = this.#jsonToChildren(json);

    let dom = createElement("temp", [
      Math.max(title[_length], description[_length]) > 0
        ? createElement("header", [
          title[_length] > 0
            ? createElement("strong", title)
            : null,
          description[_length] > 0
            ? createElement("p", description)
            : null
        ])
        : null,
      this[_editor],
      createElement("footer", [
        addEvent({
          [_dom]: createElement(_button, {
            [_title]: "Add row"
          }, icon[_add]),
          [_onclick]: e => this[_insert]()
        }),
        $Boolean(button[_import]) ? addEvent({
          [_dom]: createElement(_button, {
            [_title]: "Open file"
          }, icon.folder),
          [_onclick]: e => e[_target][_nextElementSibling][_click]()
        }) : null,
        $Boolean(button[_import]) ? addEvent({
          [_dom]: createElement(_input, {
            [_type]: "file",
            accept: ".json",
            [_display]: "none"
          }),
          [_onchange]: e => this[_import](e[_target].files[0])
        }) : null,
        $Boolean(button[_export]) ? addEvent({
          [_dom]: createElement(_button, {
            [_title]: "Download file"
          }, icon.download),
          [_onclick]: e => {
            if (!$confirm("Download?")) {
              return;
            };
            this[_export]()
          }
        }) : null,
        $Boolean(button[_reset]) ? addEvent({
          [_dom]: createElement(_button, {
            [_title]: "清空"
          }, icon.clear),
          [_onclick]: e => {
            if (!$confirm("Reset?")) {
              return;
            };
            this[_import]({});
          }
        }) : null,
      ])
    ]);

    const className = "pd-json-editor";

    if (config.id == null) {
      this[_body] = createElement(_section + "." + className);
      this[_body][_appendChild](dom)
    }
    else {
      this[_body] = $document[_getElementById](config.id);
      this[_body][_classList][_add](className)
      this[_body][_replaceChildren](...dom[_children]);
    };

    this[_body][_dataset][_fill] = fill;

    if (this[_children][_length] < 1) {
      this[_insert]();
    };

    // * 執行初始渲染
    this.#lifecycle[_render](async () => {
      this[_render]();

      if (readonly) {
        this[_body][_dataset]["readonly"] = 1;
        for (let e of [...this[_body].querySelectorAll("button:not(.collapse), textarea, input, select")]) {
          e[_setAttribute]("disabled", "true");
        }
      }

      this.#isInit = true;
    });
  };

  enable() {
    this[_body][_dataset]["readonly"] = 0;
    for (let e of [...this[_body].querySelectorAll("button:not(.collapse), textarea, input, select")]) {
      e["removeAttribute"]("disabled");
    }
  }

  disable() {
    this[_body][_dataset]["readonly"] = 1;
    for (let e of [...this[_body].querySelectorAll("button:not(.collapse), textarea, input, select")]) {
      e[_setAttribute]("disabled", "true");
    }
  }

  #create(childNode) {
    return childNode.render();
  };

  #jsonToChildren(data, parent = null) {
    const result = [];

    if ($Array[_isArray](data)) {
      for (let e of data) {
        const type = getType(e);
        const node = new JSONEditorNode({
          [_type]: type,
          [_parent]: parent ?? this,
          [_editor]: this,
          lifecycle: this.#lifecycle
        });

        // * 子物件的 type 為開頭大寫;
        if ((type === _object && e != null) || type === _array) {
          node[_children] = this.#jsonToChildren(e, node);
        }
        else {
          node[_value] = $String(e);
        };

        result[_push](node);
      };
    }
    else {
      for (const [key, value] of $Object[_entries](data)) {
        const type = getType(value);
        const node = new JSONEditorNode({
          [_key]: key,
          [_type]: type,
          [_parent]: parent ?? this,
          [_editor]: this,
          lifecycle: this.#lifecycle
        });

        // * 子物件的 type 為開頭大寫;
        if ((type === _object && value != null) || type === _array) {
          node[_children] = this.#jsonToChildren(value, node);
        }
        else if (value == null) {
          node[_value] = "";
        }
        else {
          node[_value] = $String(value);
        };

        result[_push](node);
      }
    }
    return result;
  };

  render(isUpdate = false) {
    let temp = createElement("temp", this[_children].map(e => this.#create(e)))

    this[_editor][_replaceChildren](...temp[_children]);

    if (!this.#isInit || !isUpdate) {
      return;
    };

    this.#lifecycle[_update](() => void 0);
  };

  insert() {
    this[_children][_push](new JSONEditorNode({
      [_parent]: this,
      [_editor]: this,
      lifecycle: this.#lifecycle
    }));
    this[_render]()
  };

  get json() {
    const result = {};

    for (let e of this[_children]) {
      if (e[_key]) {
        result[e[_key] || 0] = e.json;
      };
    };

    return $JSON[_stringify](result, null, 4);
  };

  async import(file) {

    let json = await getJSON(file);
    this.children = this.#jsonToChildren(json);
    this[_render](true);
  };

  reset() {
    this[_import]({});
  };

  export() {
    const result = {};

    for (let e of this[_children]) {
      if (e.key || this[_children][_length] === 1) {
        result[e.key || 0] = e.json;
      }
    };

    const blob = new $Blob([$JSON[_stringify](result, null, 4)], {
      [_type]: 'application/json'
    });
    const url = $URL[_createObjectURL](blob);
    const a = createElement("a", {
      href: url,
      download: `JSONEditor-${$Date[_now]()}.json`
    });
    $document[_body][_appendChild](a);
    a[_click]();
    $document[_body][_removeChild](a);
    $URL[_revokeObjectURL](url);
  };
};

$window.JSONEditor = JSONEditor;