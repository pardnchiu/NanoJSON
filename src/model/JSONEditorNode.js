class JSONEditorNode {

  key = "";
  type = "string";
  value = "";
  parent;
  children = [];
  collapsed = false;
  #dom;
  #editor;
  #lifecycle;

  constructor(config = {}) {
    if (typeof config != "object") {
      printError(`Failed to load config form editor node.`);
      return;
    };

    this.id = randomKey();
    this.key = config.key ?? this.key;
    this.type = config.type ?? this.type;
    this.value = config.value ?? this.value;
    this.parent = config.parent ?? this.parent;
    this.children = config.children ?? this.children;
    this.collapsed = config.collapsed ?? this.collapsed;
    this.#editor = config.editor;
    this.#lifecycle = config.lifecycle;
  };

  render() {
    return this.create();
  };
  addChild() {
    this.#add();
  };
  updateChild() {
    this.create();
    this.#update();
  };
  setCollapsed() {
    this.collapsed = !this.collapsed;
    this.create();
  };
  get json() {
    return this.#json();
  };

  #update() {
    this.#lifecycle.update(_ => void 0);
  }

  create() {
    let newDom = createElement("section.pd-json-editor-child", [
      createElement("section.pair-wrapper", [
        createElement("section" + "#" + this.id + ".input-group", [
          // 折疊按鈕
          collapseButton(this),
          // 鍵輸入框
          keyInput(this, this.parent.children.indexOf(this), this.parent.type === "array", this.#lifecycle),
          createElement("span", ":"),
          // 類型選擇器
          typeSelect(this),
          // 值輸入框
          valueInput(this, this.#lifecycle),
          // 移除按鈕
          addEvent({
            dom: createElement("button", icon.add),
            onclick: _ => {
              // * 再次確認
              if (!$confirm(`Remove?`)) {
                return;
              };
              this.#remove();
            }
          })
        ]),
        // 子節點按鈕
        childAddButton(
          this,
          // 子節點渲染
          (e, i) => {
            let dom = e.create();
            dom.dataset.last = i === this.children.length - 1 ? 1 : 0;
            return dom;
          },
          // 按鈕點擊處理
          () => {
            this.#add();
          }
        )
      ])
    ]);

    if (this.#dom) {
      this.#dom.parentElement.replaceChild(newDom, this.#dom);
    };

    this.#dom = newDom;

    return this.#dom;
  };

  #add() {
    const childNode = new JSONEditorNode({
      parent: this,
      editor: this.#editor,
      lifecycle: this.#lifecycle
    });
    this.children.push(childNode);

    const container = this.#dom.querySelector("section.pd-json-editor-nested-child");
    if (container != null) {
      const button = container.children[container.children.length - 1];

      for (let e of button.parentElement.children) {
        e.dataset.last = 0;
      };

      const newNode = childNode.create();
      newNode.dataset.last = 1;

      // * 更新畫面並觸發更新
      container.insertBefore(newNode, button);
    };
    this.#update();
  };

  #remove() {
    if (!this.parent) {
      return;
    };

    const index = this.parent.children.indexOf(this);

    if (index === -1) {
      return;
    };

    const pre = this.#dom.previousElementSibling;
    if (this.#dom.dataset.last === "1" && pre != null) {
      pre.dataset.last = 1
    }

    // * 更新畫面並觸發更新
    this.parent.children.splice(index, 1);
    this.#dom.remove();
    this.#update();
  };

  #json() {
    if (!this.parent) {
      return
    };

    if (this.type === "array") {
      return this.children.map(e => e.#json())
    };

    if (this.type === "object") {
      const obj = {};

      for (let e of this.children) {
        if (!e.key && this.parent.type !== "array") {
          continue;
        };
        obj[e.key || $Object.keys(obj).length] = e.#json();
      };

      return obj
    };

    let value = this.value;

    if (this.type === "boolean") {
      value = value.toLowerCase() === 'true';
    }
    else if (this.type === "number") {
      value = $Number(value);
    };

    return value
  };
};