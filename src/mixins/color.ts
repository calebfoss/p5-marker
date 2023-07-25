import { Base } from "../elements/base";

export const color = <T extends typeof Base>(baseClass: T) =>
  class extends baseClass {
    gray(value: number, alpha?: number): string {
      return this.rgb(value, value, value, alpha);
    }
    hsb(h: number, s: number, b: number, a?: number) {
      const l = b * (1 - s / 200);
      const sl =
        l === 0 || l === 100 ? 0 : ((b - l) / Math.min(l, 100 - l)) * 100;
      if (typeof a !== "undefined") return this.hsl(h, sl, l, a);
      return this.hsl(h, sl, l);
    }
    hsl(h: number, s: number, l: number, a?: number) {
      if (typeof a !== "undefined") return `hsl(${h} ${s}% ${l}% / ${a})`;
      return `hsl(${h} ${s}% ${l}%)`;
    }
    rgb(r: number, g: number, b: number, a?: number): string {
      if (typeof a !== "undefined") return `rgb(${r} ${g} ${b} / ${a})`;
      return `rgb(${r} ${g} ${b})`;
    }
  };
