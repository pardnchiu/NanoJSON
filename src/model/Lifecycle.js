class Lifecycle {
  #beforeRenderCallback;
  #renderedCallback;
  #beforeUpdateCallback;
  #updatedCallback;
  #beforeDestroyCallback;
  #destroyedCallback;

  #startAt;
  #renderSec;
  #updateTimer;

  constructor(body = {}) {
    this.#beforeRenderCallback = body[lifecycleAction.beforeRender] || void 0;
    this.#renderedCallback = body[lifecycleAction.rendered] || void 0;
    this.#beforeUpdateCallback = body[lifecycleAction.beforeUpdate] || void 0;
    this.#updatedCallback = body[lifecycleAction.updated] || void 0;
    this.#beforeDestroyCallback = body[lifecycleAction.beforeDestroy] || void 0;
    this.#destroyedCallback = body[lifecycleAction.destroyed] || void 0;
  };

  async #beforeAction(cb) {
    return new Promise((res, _) => {
      res(cb() === false ? false : true);
    });
  };

  #afterAction(cb) {
    cb(false);
  };

  async render(cb) {
    this.#startAt = Date.now();

    if (
      this.#beforeRenderCallback != null &&
      await this.#beforeAction(this.#beforeRenderCallback) === false
    ) {
      return;
    };

    await cb();

    this.#renderSec = Date.now() - this.#startAt;

    console.log(`Rendered in ${this.#renderSec}ms.`);

    if (this.#renderedCallback == null) {
      return;
    };

    this.#afterAction(this.#renderedCallback);
  };

  async update(cb) {
    clearTimeout(this.#updateTimer);

    this.#updateTimer = setTimeout(async () => {
      this.#startAt = Date.now();

      if (
        this.#beforeUpdateCallback != null &&
        await this.#beforeAction(this.#beforeUpdateCallback) === false
      ) {
        return;
      };

      await cb();

      this.#renderSec = Date.now() - this.#startAt;

      console.log(`Updated in ${this.#renderSec}ms.`);

      if (this.#updatedCallback == null) {
        return
      };

      this.#afterAction(this.#updatedCallback);
    }, 300);
  };

  async destroy(cb) {
    this.#startAt = Date.now();

    if (
      this.#beforeDestroyCallback != null &&
      await this.#beforeAction(this.#beforeDestroyCallback) === false
    ) {
      return;
    };

    await cb();

    this.#renderSec = Date.now() - this.#startAt;


    console.log(`Destroyed in ${this.#renderSec}ms.`);

    if (this.#destroyedCallback == null) {
      return;
    };

    this.#afterAction(this.#destroyedCallback);
  };
};
