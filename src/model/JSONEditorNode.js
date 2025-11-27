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
    if (typeof config != _object) {
      console.error(`Failed to load config form editor node.`);
      return;
    };

    this.id = randomKey();
    this.key = config.key ?? this.key;
    this[_type] = config[_type] ?? this[_type];
    this[_value] = config[_value] ?? this[_value];
    this[_parent] = config[_parent] ?? this[_parent];
    this[_children] = config[_children] ?? this[_children];
    this[_collapsed] = config[_collapsed] ?? this[_collapsed];
    this.#editor = config[_editor];
    this.#lifecycle = config[_lifecycle];
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
    let newDom = "section.pd-json-editor-child"._([
      "section.pair-wrapper"._([
        ("section#" + this.id + ".input-group")._([
          // 折疊按鈕
          buttonToCollapseNode(this),
          // 鍵輸入框
          keyInput(this, this[_parent][_children].indexOf(this), this[_parent][_type] === _array, this.#editor[_body][_dataset][_readonly] === "1", this.#lifecycle),
          "span"._(":"),
          // 類型選擇器
          typeSelect(this, this.#editor[_body][_dataset][_readonly] === "1"),
          // 值輸入框
          valueInput(this, this.#lifecycle),
          // 移除按鈕
          _button._(icon.add)._({
            [_click]: _ => {
              // * 再次確認
              if (!confirm(`Remove?`)) {
                return;
              };
              this.#remove();
            }
          })
        ]),
        // 子節點按鈕
        buttonToAddSubNode(
          this,
          // 子節點渲染
          (e, i) => {
            let dom = e.#create();
            dom[_dataset].last = i === this[_children].length - 1 ? 1 : 0;
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
      [_lifecycle]: this.#lifecycle
    });
    this[_children][_push](childNode);

    const container = this.#dom.querySelector(_section + "." + classNameEditorNestedChild);
    if (container != null) {
      const button = container[_children][container[_children].length - 1];

      for (let e of button.parentElement[_children]) {
        e[_dataset].last = 0;
      };

      const newNode = childNode.#create();
      newNode[_dataset].last = 1;

      // * 更新畫面並觸發更新
      container.insertBefore(newNode, button);
    };
    this.#update();
  };

  #remove() {
    if (!this[_parent]) {
      return;
    };

    const index = this[_parent][_children].indexOf(this);

    if (index === -1) {
      return;
    };

    const pre = this.#dom.previousElementSibling;
    if (this.#dom[_dataset].last === "1" && pre != null) {
      pre[_dataset].last = 1
    }

    this[_parent][_children].splice(index, 1);
    this.#dom.remove();
    this.#update();
  };

  #json() {
    if (!this[_parent]) {
      return
    };

    if (this[_type] === _array) {
      return this[_children].map(e => e.#json())
    };

    if (this[_type] === _object) {
      const obj = {};

      for (let e of this[_children]) {
        if (!e.key && this[_parent][_type] !== _array) {
          continue;
        };
        obj[e.key || Object.keys(obj)[_length]] = e.#json();
      };

      return obj
    };

    let value = this[_value];

    if (this[_type] === _boolean) {
      value = value[_toLowerCase]() === _true;
    }
    else if (this[_type] === _number) {
      value = Number(value);
    };

    return value
  };
};