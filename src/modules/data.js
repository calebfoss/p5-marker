import { defineSnakeAlias } from "../utils/p5Modifiers";

defineSnakeAlias(
  "createStringDict",
  "createNumberDict",
  "matchAll",
  "splitTokens"
);
p5.prototype.storage = {};
p5.prototype.registerMethod("init", function () {
  this._setProperty(
    "storage",
    new Proxy(this, {
      get(target, prop) {
        if (prop === "clear") return target.clearStorage;
        if (prop === "remove") return target.removeItem;
        return target.getItem(prop);
      },
      set(target, prop, val) {
        target.storeItem(prop, val);
        return true;
      },
    })
  );
});
