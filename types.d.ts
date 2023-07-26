type Token = {
  kind: string;
  start: number;
  end: number;
  value: string;
};

type Property<T> = {
  get: () => T;
  changed: boolean;
};
type ObjectProperty<T extends object> = Property<T> & {
  object: MarkerObject<T>;
};

type Vector = {
  x: number;
  y: number;
};

type PropertyManager = {
  [key: string]: Property<any> | ObjectProperty<any>;
};

type MarkerObject<T extends object> = T & { propertyManager: PropertyManager };
