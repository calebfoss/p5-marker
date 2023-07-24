type Token = {
  kind: string;
  start: number;
  end: number;
  value: string;
};

type Property<T> = {
  get: () => T;
  changed?: true;
} & (T extends object ? { object: MarkerObject<T> } : {});

type Vector = {
  x: number;
  y: number;
};

type PropertyManager = {
  [key: string]: Property<any>;
};

type MarkerObject<T extends object> = T & { propertyManager: PropertyManager };
