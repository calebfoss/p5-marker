import { visible } from "../mixins/visible";
import { origin } from "../mixins/origin";
import { fill, stroke } from "../mixins/style";
import { dimensions } from "../mixins/dimensions";
import { MarkerElement } from "./base";
import { Collide, CollisionElement } from "../mixins/collide";
import { Vector } from "../classes/vector";
import { Mouse } from "../mixins/mouse";
import { Line } from "./line";

const radiusOrder = [
  "top_left",
  "top_right",
  "bottom_right",
  "bottom_left",
] as const;

export class Rectangle
  extends origin(dimensions(fill(stroke(visible(MarkerElement)))))
  implements CollisionElement
{
  colliding(other: Mouse | Vector | Line | Rectangle) {
    if (other instanceof Vector) return Collide.rectangle.vector(this, other);
    if (other instanceof Rectangle)
      return Collide.rectangle.rectangle(this, other);
    if (other instanceof Line) return Collide.rectangle.line(this, other);
    console.warn(
      `Collision detection has not been implemented between ${
        (other as HTMLElement).tagName
      } and rectangle.`
    );
    return false;
  }
  #radii: {
    [K in (typeof radiusOrder)[number]]: number;
  } = {
    top_left: 0,
    top_right: 0,
    bottom_right: 0,
    bottom_left: 0,
  };
  get corner_radius() {
    const element: Rectangle = this;
    const radii = this.#radii;
    return {
      get top_left() {
        return radii.top_left;
      },
      set top_left(value) {
        element.assertType("corner_radius.top_left", value, "number");
        radii.top_left = value;
      },
      get top_right() {
        return radii.top_right;
      },
      set top_right(value) {
        element.assertType("corner_radius.top_right", value, "number");
        radii.top_right = value;
      },
      get bottom_right() {
        return radii.bottom_right;
      },
      set bottom_right(value) {
        element.assertType("corner_radius.bottom_right", value, "number");
        radii.bottom_right = value;
      },
      get bottom_left() {
        return radii.bottom_left;
      },
      set bottom_left(value) {
        element.assertType("corner_radius.bottom_left", value, "number");
        radii.bottom_left = value;
      },
      [Symbol.iterator]() {
        let index = -1;
        const iterator = {
          next() {
            index++;
            return iterator;
          },
          get value() {
            return radii[radiusOrder[index]];
          },
          get done() {
            return index >= radiusOrder.length;
          },
        };
        return iterator;
      },
    };
  }
  set corner_radius(value) {
    if (typeof value === "number") {
      for (const key of Object.keys(this.#radii)) {
        this.corner_radius[key] = value;
      }
    } else if (typeof value === "object") {
      for (const [key, value] of Object.entries(this.#radii)) {
        this.corner_radius[key] = value;
      }
    } else {
      throw new Error(
        `Rectangle ${
          this.id.length ? `with id ${this.id}` : ""
        } corner_radius set to type ${typeof value}, but it may only be set to an object.`
      );
    }
  }
  protected get gradientCoordinates(): {
    linear: [number, number, number, number];
    radial: [number, number, number, number, number, number];
  } {
    const { origin, width, height } = this;
    const centerX = origin.x + this.width / 2;
    const centerY = origin.y + this.height / 2;
    return {
      linear: [origin.x, origin.y, origin.x + width, origin.y + height],
      radial: [centerX, centerY, 0, centerX, centerY, width / 2],
    };
  }
  renderToCanvas(context: CanvasRenderingContext2D) {
    this.transform_context(context);
    if (this.visible) {
      const corner_radius = this.#radii;
      if (Object.values(corner_radius).every((value) => value === 0))
        context.rect(this.origin.x, this.origin.y, this.width, this.height);
      else
        context.roundRect(
          this.origin.x,
          this.origin.y,
          this.width,
          this.height,
          this.corner_radius
        );
    }
    this.styleContext(context);
    super.renderToCanvas(context);
  }
  styleDocumentElement(): void {
    if (Object.values(this.#radii).some((value) => value !== 0)) {
      let radiusString = "";
      for (const key of radiusOrder) {
        radiusString += `${this.#radii[key]}px `;
      }
      this.setDocumentElementStyle("borderRadius", radiusString);
    }
    super.styleDocumentElement();
  }
  styleSVGElement(newElement?: boolean): void;
  styleSVGElement(newElement?: boolean): void {
    const radiiValues = Object.values(this.#radii);
    if (radiiValues.some((value) => value !== 0)) {
      if (
        !radiiValues.every(
          (value, index) => index === 0 || value === radiiValues[index - 1]
        )
      )
        console.warn(
          `Setting individual corner radii on rectangle has not yet been implemented`
        );
      this.setSVGElementAttribute("rx", radiiValues[0].toString());
      this.setSVGElementAttribute("ry", radiiValues[0].toString());
    }
    this.setSVGElementAttribute("width", this.width.toString());
    this.setSVGElementAttribute("height", this.height.toString());
    super.styleSVGElement(newElement);
  }
  protected svgTag: keyof SVGElementTagNameMap = "rect";
}
customElements.define("m-rectangle", Rectangle);
