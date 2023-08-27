import { MarkerElement } from "../elements/base";
import { LinearGradient, MarkerGradient } from "./gradient";

export const defaultFill = MarkerElement.gray(255);
export const defaultStroke = MarkerElement.gray(0);

export const fill = <T extends typeof MarkerElement>(baseClass: T) =>
  class FillElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #fill: string | MarkerGradient = null;
    get fill(): string | MarkerGradient {
      if (this.#fill !== null) return this.#fill;
      return this.inherit("fill", "#ffffff");
    }
    set fill(value) {
      this.#fill = value;
      if (value instanceof MarkerGradient) {
        this.setDocumentElementStyle("background", value.toCSS);
        this.svg_collection.fillGradient = value.toSVG;
      } else {
        this.setDocumentElementStyle("background", value);
        this.setSVGStyle("fill", value);
      }
    }
    renderToCanvas(context: CanvasRenderingContext2D) {
      const { fill } = this;
      if (fill !== FillElement.NONE) {
        if (fill instanceof MarkerGradient) {
          context.fillStyle = fill.toContext(context, this.gradientCoordinates);
        } else {
          context.fillStyle = fill;
        }
        context.fill();
      }
      super.renderToCanvas(context);
    }
  };

export const stroke = <T extends typeof MarkerElement>(baseClass: T) =>
  class StrokeElement extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
    #line_cap: CanvasLineCap = null;
    get line_cap(): CanvasLineCap {
      if (this.#line_cap !== null) return this.#line_cap;
      return this.inherit("line_cap", "butt");
    }
    set line_cap(value) {
      this.#line_cap = value;
      this.setContextProperty("lineCap", value);
      this.setSVGStyle("stroke-linecap", value);
    }
    #line_join: CanvasLineJoin = null;
    get line_join(): CanvasLineJoin {
      if (this.#line_join !== null) return this.#line_join;
      return this.inherit("line_join", "miter");
    }
    set line_join(value) {
      this.#line_join = value;
      this.setContextProperty("lineJoin", value);
      this.setSVGStyle("stroke-linejoin", value);
    }
    #line_width: number = null;
    get line_width(): number {
      if (this.#line_width !== null) return this.#line_width;
      return this.inherit("line_width", 1.0);
    }
    set line_width(value) {
      this.#line_width = value;
      this.setContextProperty("lineWidth", value);
      this.setDocumentElementStyle("borderWidth", `${value}px`);
      this.setSVGStyle("stroke-width", value.toString());
    }
    renderToCanvas(context: CanvasRenderingContext2D) {
      const { stroke } = this;
      if (stroke !== StrokeElement.NONE) {
        if (stroke instanceof MarkerGradient) {
          context.strokeStyle = stroke.toContext(
            context,
            this.gradientCoordinates
          );
        } else {
          context.strokeStyle = stroke;
        }
        context.stroke();
      }
      super.renderToCanvas(context);
    }
    #stroke: string | MarkerGradient = null;
    get stroke(): string | MarkerGradient {
      if (this.#stroke !== null) return this.#stroke;
      return this.inherit("stroke", "#000000");
    }
    set stroke(value) {
      this.#stroke = value;
      if (value instanceof MarkerGradient) {
        this.setDocumentElementStyle("borderImage", `${value.toCSS} 100`);
        const collection = this.svg_collection;
        collection.strokeGradient = value.toSVG;
      } else {
        if (value === StrokeElement.NONE)
          this.setDocumentElementStyle("borderStyle", value);
        else {
          this.setDocumentElementStyle("borderStyle", "solid");
          this.setDocumentElementStyle("borderColor", value);
        }
        this.setSVGStyle("stroke", value);
      }
    }
  };
