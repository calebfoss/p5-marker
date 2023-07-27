import { VisibleElement } from "./visible";
import { position } from "../mixins/position";
import { stroke, fill } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";

export class Setting extends position(
  dimensions(stroke(fill(VisibleElement)))
) {}
customElements.define("m-setting", Setting);
