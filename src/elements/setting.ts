import { MarkerElement } from "./base";
import { position } from "../properties/position";
import { stroke, fill } from "../properties/style";

export class Setting extends position(stroke(fill(MarkerElement))) {}
