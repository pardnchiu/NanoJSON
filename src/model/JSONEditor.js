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

    this.#init(config);
  }

  async #init(config = {}) {
    this.editor = createElement("section");

    const when = config.when ?? {};
    const title = config.title ?? "";
    const description = config.description ?? "";
    const fill = $Boolean(config.fill == null ? 1 : config.fill) ? 1 : 0;

    let button = config.button != null && typeof config.button === "object"
      ? config.button
      : { import: 1, export: 1, reset: 1 };
    button.reset = button.reset ?? 1;
    button.import = button.import ?? 1;
    button.export = button.export ?? 1;

    this.#lifecycle = new Lifecycle({
      beforeRender: when[lifecycleAction.beforeRender],
      rendered: when[lifecycleAction.rendered],
      beforeUpdate: when[lifecycleAction.beforeUpdate],
      updated: when[lifecycleAction.updated],
      beforeDestroy: when[lifecycleAction.beforeDestroy],
      destroyed: when[lifecycleAction.destroyed],
    });

    let json = await getJSON(config.file ?? config.json ?? config.path);
    this.children = this.#jsonToChildren(json);

    let dom = createElement("temp", [
      Math.max(title.length, description.length) > 0
        ? createElement("header", [
          title.length > 0
            ? createElement("strong", title)
            : null,
          description.length > 0
            ? createElement("p", description)
            : null
        ])
        : null,
      this.editor,
      createElement("footer", [
        addEvent({
          dom: createElement("button", {
            title: "Add row"
          }, icon.add),
          onclick: e => this.insert()
        }),
        $Boolean(button.import) ? addEvent({
          dom: createElement("button", {
            title: "Open file"
          }, icon.folder),
          onclick: e => e.target.nextElementSibling.click()
        }) : null,
        $Boolean(button.import) ? addEvent({
          dom: createElement("input", {
            type: "file",
            accept: ".json",
            display: "none"
          }),
          onchange: e => this.import(e.target.files[0])
        }) : null,
        $Boolean(button.export) ? addEvent({
          dom: createElement("button", {
            title: "Download file"
          }, icon.download),
          onclick: e => {
            if (!$confirm("Download?")) {
              return;
            };
            this.export()
          }
        }) : null,
        $Boolean(button.reset) ? addEvent({
          dom: createElement("button", {
            title: "清空"
          }, icon.clear),
          onclick: e => {
            if (!$confirm("Reset?")) {
              return;
            };
            this.import({});
          }
        }) : null,
      ])
    ]);

    const className = "pd-json-editor";

    if (config.id == null) {
      this.body = createElement("section" + "." + className);
      this.body.appendChild(dom)
    }
    else {
      this.body = $document.getElementById(config.id);
      this.body.classList.add(className)
      this.body.replaceChildren(...dom.children);
    };

    this.body.dataset.fill = fill;

    if (this.children.length < 1) {
      this.insert();
    };

    // * 執行初始渲染
    this.#lifecycle.render(async () => {
      this.render();
      this.#isInit = true;
    });
  };

  #create(childNode) {
    return childNode.render();
  };

  #jsonToChildren(data, parent = null) {
    const result = [];

    if ($Array.isArray(data)) {
      for (let e of data) {
        const type = getType(e);
        const node = new JSONEditorNode({
          type: type,
          parent: parent ?? this,
          editor: this,
          lifecycle: this.#lifecycle
        });

        // * 子物件的 type 為開頭大寫;
        if ((type === "object" && e != null) || type === "array") {
          node.children = this.#jsonToChildren(e, node);
        }
        else {
          node.value = $String(e);
        };

        result.push(node);
      };
    }
    else {
      for (const [key, value] of $Object.entries(data)) {
        const type = getType(value);
        const node = new JSONEditorNode({
          key: key,
          type: type,
          parent: parent ?? this,
          editor: this,
          lifecycle: this.#lifecycle
        });

        // * 子物件的 type 為開頭大寫;
        if ((type === "object" && value != null) || type === "array") {
          node.children = this.#jsonToChildren(value, node);
        }
        else if (value == null) {
          node.value = "";
        }
        else {
          node.value = $String(value);
        };

        result.push(node);
      }
    }
    return result;
  };

  render(isUpdate = false) {
    let temp = createElement("temp", this.children.map(e => this.#create(e)))

    this.editor.replaceChildren(...temp.children);

    if (!this.#isInit || !isUpdate) {
      return;
    };

    this.#lifecycle.update(() => void 0);
  };

  insert() {
    this.children.push(new JSONEditorNode({
      parent: this,
      editor: this,
      lifecycle: this.#lifecycle
    }));
    this.render()
  };

  get json() {
    const result = {};

    for (let e of this.children) {
      if (e.key) {
        result[e.key || 0] = e.json;
      };
    };

    return $JSON.stringify(result, null, 4);
  };

  async import(file) {

    let json = await getJSON(file);
    this.children = this.#jsonToChildren(json);
    this.render(true);
  };

  reset() {
    this.import({});
  };

  export() {
    const result = {};

    for (let e of this.children) {
      if (e.key || this.children.length === 1) {
        result[e.key || 0] = e.json;
      }
    };

    const blob = new $Blob([$JSON.stringify(result, null, 4)], {
      type: 'application/json'
    });
    const url = $URL.createObjectURL(blob);
    const a = createElement("a", {
      href: url,
      download: `JSONEditor-${$Date.now()}.json`
    });
    $document.body.appendChild(a);
    a.click();
    $document.body.removeChild(a);
    $URL.revokeObjectURL(url);
  };
};

$window.JSONEditor = JSONEditor;