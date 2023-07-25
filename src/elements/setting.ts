import { MarkerElement } from "./base";
import { position } from "../mixins/position";
import { stroke, fill } from "../mixins/style";

export class Setting extends position(stroke(fill(MarkerElement))) {}
customElements.define("m-setting", Setting);
