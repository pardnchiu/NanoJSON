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
    this[_key] = config[_key] ?? this[_key];
    this[_type] = config[_type] ?? this[_type];
    this[_value] = config[_value] ?? this[_value];
    this[_parent] = config[_parent] ?? this[_parent];
    this[_children] = config[_children] ?? this[_children];
    this[_collapsed] = config[_collapsed] ?? this[_collapsed];
    this.#editor = config.editor;
    this.#lifecycle = config.lifecycle;
  };

  render() {
    return this.#create();
  };
  addChild() {
    this.#add();
  };
  updateChild() {
    this.#create();
    this.#update();
  };
  setCollapsed() {
    this[_collapsed] = !this[_collapsed];
    this.#create();
  };
  get json() {
    return this.#json();
  };

  #update() {
    this.#lifecycle[_update](_ => void 0);
  }

  #create() {
    let newDom = createElement("section.pd-json-editor-child", [
      createElement("section.pair-wrapper", [
        createElement(_section + "#" + this.id + ".input-group", [
          // 折疊按鈕
          collapseButton(this),
          // 鍵輸入框
          keyInput(this, this.parent.children.indexOf(this), this.parent.type === _array, this.#lifecycle),
          createElement("span", ":"),
          // 類型選擇器
          typeSelect(this),
          // 值輸入框
          valueInput(this, this.#lifecycle),
          // 移除按鈕
          addEvent({
            [_dom]: createElement(_button, icon[_add]),
            [_onclick]: _ => {
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
            let dom = e.#create();
            dom[_dataset].last = i === this.children.length - 1 ? 1 : 0;
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
      [_parent]: this,
      [_editor]: this.#editor,
      lifecycle: this.#lifecycle
    });
    this[_children][_push](childNode);

    const container = this.#dom.querySelector("section.pd-json-editor-nested-child");
    if (container != null) {
      const button = container.children[container.children.length - 1];

      for (let e of button.parentElement.children) {
        e.dataset.last = 0;
      };

      const newNode = childNode.#create();
      newNode.dataset.last = 1;

      // * 更新畫面並觸發更新
      container.insertBefore(newNode, button);
    };
    this.#update();
  };

  #remove() {
    if (!this[_parent]) {
      return;
    };

    const index = this[_parent][_children][_indexOf](this);

    if (index === -1) {
      return;
    };

    const pre = this.#dom.previousElementSibling;
    if (this.#dom.dataset.last === "1" && pre != null) {
      pre.dataset.last = 1
    }

    // * 更新畫面並觸發更新
    this[_parent][_children][_splice](index, 1);
    this.#dom[_remove]();
    this.#update();
  };

  #json() {
    if (!this[_parent]) {
      return
    };

    if (this[_type] === _array) {
      return this[_children][_map](e => e.#json())
    };

    if (this[_type] === _object) {
      const obj = {};

      for (let e of this[_children]) {
        if (!e[_key] && this[_parent][_type] !== _array) {
          continue;
        };
        obj[e[_key] || $Object[_keys](obj)[_length]] = e.#json();
      };

      return obj
    };

    let value = this[_value];

    if (this[_type] === _boolean) {
      value = value[_toLowerCase]() === 'true';
    }
    else if (this[_type] === _number) {
      value = $Number(value);
    };

    return value
  };
};