import { camelToSnake } from "./caseConvert";

export function defineProperties(obj) {
  for (const p in obj) {
    p5.prototype[p] = {};
  }
  Object.defineProperties(p5.prototype, obj);
}

export const wrapMethod = (methodName, wrapper) =>
  (p5.prototype[methodName] = wrapper(p5.prototype[methodName]));

export const defineSnakeAlias = (...propNames) =>
  propNames.forEach(
    (propName) =>
      (p5.prototype[camelToSnake(propName)] = p5.prototype[propName])
  );

export const defineRendererGetterSetters = (...methodNames) =>
  methodNames.forEach((methodName) =>
    defineProperties({
      [camelToSnake(methodName)]: {
        get: function () {
          return this._renderer?.[`_${methodName}`];
        },
        set: function (val) {
          if (Array.isArray(val)) this[methodName](...val);
          else this[methodName](val);
        },
      },
    })
  );
