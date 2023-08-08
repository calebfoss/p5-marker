import { MarkerElement } from "../src/elements/base";

export const wrapMethod = <
  T extends MarkerElement,
  PropKey extends keyof T,
  MethodKey extends {
    [key in keyof T]: T[key] extends Function ? key : never;
  }[PropKey]
>(
  element: T,
  methodName: MethodKey,
  getWrappedMethod: (baseMethod: T[MethodKey]) => T[MethodKey]
) => {
  const baseMethod = (element[methodName] as Function).bind(element);
  element[methodName] = getWrappedMethod(baseMethod);
};
