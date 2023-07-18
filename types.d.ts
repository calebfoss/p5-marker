type Token = {
  kind: string;
  start: number;
  end: number;
  value: string;
};

type Property<T> = {
  value: T;
  get: () => T;
};

type Vector = {
  x: number;
  y: number;
};
