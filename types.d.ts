type Token = {
  kind: string;
  start: number;
  end: number;
  value: string;
};

type InterpreterAction = "get" | "change" | "each" | "repeat";

type Property<T> = {
  get: () => T;
  changed: boolean;
  set: (value: T) => void;
};
type ObjectProperty<T extends object> = Property<T> & {
  object: MarkerObject<T>;
};

type Vector = {
  x: number;
  y: number;
};

type PropertyManager<T> = {
  [key in keyof T]?: T[key] extends object
    ? ObjectProperty<T[key]>
    : Property<T[key]>;
};

type MarkerObject<T extends object> = T & {
  propertyManager: PropertyManager<T>;
};
