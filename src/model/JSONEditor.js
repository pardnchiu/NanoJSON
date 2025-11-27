class JSONEditor {
  children = [];

  body;
  editor;
  button = [];
  #lifecycle;
  #isInit = false;
  #type = _object;

  get type() {
    return this.#type;
  };

  constructor(config = {}) {
    if (typeof config != _object) {
      console.error(`Failed to load config.`);
      return;
    };

    let css = config.css;
    if (css == null || typeof css !== _string || css.length < 1) {
      css = defaultCSS;
    };

    loadCSS(css);

    this.#init(config);
  }

  async #init(config = {}) {
    this[_editor] = "section"._();

    const when = config.when ?? {};
    const title = config[_title] ?? "";
    const description = config.description ?? "";
    const fill = Boolean(config.fill == null ? 1 : config.fill) ? 1 : 0;
    const readonly = config[_readonly] ?? false;

    let button = config[_button] != null && typeof config[_button] === _object
      ? config[_button]
      : { [_import]: 1, [_export]: 1, [_reset]: 1 };
    button[_reset] = button[_reset] ?? 1;
    button[_import] = button[_import] ?? 1;
    button[_export] = button[_export] ?? 1;

    this.#lifecycle = new Lifecycle({
      beforeRender: when[lifecycleAction.beforeRender],
      rendered: when[lifecycleAction.rendered],
      beforeUpdate: when[lifecycleAction.beforeUpdate],
      updated: when[lifecycleAction.updated],
      beforeDestroy: when[lifecycleAction.beforeDestroy],
      destroyed: when[lifecycleAction.destroyed],
    });

    let json = await getJSON(config.file ?? config.json ?? config.path) ?? {};
    this[_children] = this.#jsonToChildren(json);

    let dom = _temp._([
      Math.max(title[_length], description[_length]) > 0
        ? "header"._([
          title[_length] > 0
            ? "strong"._(title)
            : null,
          description[_length] > 0
            ? "p"._(description)
            : null
        ])
        : null,
      this[_editor],
      "footer"._([
        _button._({
          [_title]: "Add"
        }, icon.add)._({
          [_click]: e => this.insert()
        }),
        Boolean(button[_import]) ? _button._({
          [_title]: "Open"
        }, icon.folder)._({
          [_click]: e => e[_target][_nextElementSibling][_click]()
        }) : null,
        Boolean(button[_import]) ? "input"._({
          [_type]: "file",
          accept: ".json",
          [_display]: "none"
        })._({
          change: e => this[_import](e[_target].files[0])
        }) : null,
        Boolean(button[_export]) ? _button._({
          [_title]: "Download"
        }, icon[_download])._({
          [_click]: e => {
            if (!confirm(e[_target][_title] + "?")) {
              return;
            };
            this[_export]()
          }
        }) : null,
        Boolean(button[_reset]) ? _button._({
          [_title]: "Reset"
        }, icon.clear)._({
          [_click]: e => {
            if (!confirm(e[_target][_title] + "?")) {
              return;
            };
            this[_import]({});
          }
        }) : null,
      ])
    ]);

    if (config.id == null) {
      this[_body] = (_section + "." + classNameEditor)._();
      this[_body][_appendChild](dom)
    }
    else {
      this[_body] = document.getElementById(config.id);
      this[_body].classList.add(classNameEditor)
      this[_body].replaceChildren(...dom[_children]);
    };

    this[_body][_dataset].fill = fill;

    if (this[_children][_length] < 1) {
      this.insert();
    };

    this.#lifecycle[_render](async () => {
      this[_render]();

      if (readonly) {
        this[_body][_dataset][_readonly] = 1;
        for (let e of [...this[_body][_querySelectorAll](selectorSubNodes)]) {
          e[_setAttribute](_disabled, _true);
        }
      }

      this.#isInit = true;
    });
  };

  enable() {
    this[_body][_dataset][_readonly] = 0;
    for (let e of [...this[_body][_querySelectorAll](selectorSubNodes)]) {
      e.removeAttribute(_disabled);
    }
  }

  disable() {
    this[_body][_dataset][_readonly] = 1;
    for (let e of [...this[_body][_querySelectorAll](selectorSubNodes)]) {
      e[_setAttribute](_disabled, _true);
    }
  }

  #create(childNode) {
    return childNode.render();
  };

  #jsonToChildren(data, parent = null) {
    const result = [];

    if (Array[_isArray](data)) {
      for (let e of data) {
        const type = getType(e);
        const node = new JSONEditorNode({
          [_type]: type,
          [_parent]: parent ?? this,
          [_editor]: this,
          [_lifecycle]: this.#lifecycle
        });

        // * 子物件的 type 為開頭大寫;
        if ((type === _object && e != null) || type === _array) {
          node[_children] = this.#jsonToChildren(e, node);
        }
        else {
          node[_value] = String(e);
        };

        result[_push](node);
      };
    }
    else {
      for (const [key, value] of Object.entries(data)) {
        const type = getType(value);
        const node = new JSONEditorNode({
          key: key,
          [_type]: type,
          [_parent]: parent ?? this,
          [_editor]: this,
          [_lifecycle]: this.#lifecycle
        });

        // * 子物件的 type 為開頭大寫;
        if ((type === _object && value != null) || type === _array) {
          node[_children] = this.#jsonToChildren(value, node);
        }
        else if (value === null) {
          node[_type] = _null;
          node[_value] = null;
        }
        else {
          node[_value] = String(value);
        };

        result[_push](node);
      }
    }
    return result;
  };

  render(isUpdate = false) {
    let temp = _temp._(this[_children].map(e => this.#create(e)))

    this[_editor].replaceChildren(...temp[_children]);

    if (!this.#isInit || !isUpdate) {
      return;
    };

    this.#lifecycle[_update](() => void 0);
  };

  insert() {
    this[_children][_push](new JSONEditorNode({
      [_parent]: this,
      [_editor]: this,
      [_lifecycle]: this.#lifecycle
    }));
    this[_render]()
  };

  get json() {
    const result = {};

    for (let e of this[_children]) {
      if (e.key) {
        result[e.key || 0] = e.json;
      };
    };

    return JSON.stringify(result, null, 4);
  };

  async import(file) {

    let json = await getJSON(file) ?? {};
    this[_children] = this.#jsonToChildren(json);
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

    const blob = new Blob([JSON.stringify(result, null, 4)], {
      [_type]: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = "a"._({
      href: url,
      [_download]: `NanoJSON-${Date.now()}.json`
    });
    document[_body][_appendChild](a);
    a[_click]();
    document[_body].removeChild(a);
    URL.revokeObjectURL(url);
  };
};

window.JSONEditor = JSONEditor;