import { Line, Rectangle } from "../elements/2d_shapes";
import { MarkerElement } from "../elements/base";
import { Mouse } from "./mouse";
import { Vector } from "./vector";

export class Collide {
  static line = {
    line(a: Line, b: Line) {
      const a_start = a.untransform(a.position);
      const a_end = a.untransform(a.end);
      const b_start = b.untransform(b.position);
      const b_end = b.untransform(b.end);
      return Collide.#startEndStartEnd(a_start, a_end, b_start, b_end);
    },
    vector(line: Line, vector: Vector) {
      const lineStart = line.untransform(line.position);
      const lineEnd = line.untransform(line.end);
      const halfWidth = line.untransform(line.line_width / 2, 0).magnitude;
      const [left, right] =
        lineStart.x < lineEnd.x
          ? [lineStart.x, lineEnd.x]
          : [lineEnd.x, lineStart.x];
      const [top, bottom] =
        lineStart.y < lineEnd.y
          ? [lineStart.y, lineEnd.y]
          : [lineEnd.y, lineStart.y];
      if (
        vector.x < left - halfWidth ||
        vector.x > right + halfWidth ||
        vector.y < top - halfWidth ||
        vector.y > bottom + halfWidth
      )
        return false;
      const angleToVector = Math.atan2(
        vector.y - lineStart.y,
        vector.x - lineStart.x
      );
      const angleToEnd = Math.atan2(
        lineEnd.y - lineStart.y,
        lineEnd.x - lineStart.x
      );
      const distanceFromStartToVector = MarkerElement.distance(
        lineStart,
        vector
      );
      const angleFromLineToVector = angleToEnd - angleToVector;
      const distanceToLine = Math.abs(
        distanceFromStartToVector * Math.sin(angleFromLineToVector)
      );

      return distanceToLine < halfWidth;
    },
  };
  //    based on http://www.jeffreythompson.org/collision-detection/line-line.php
  static #startEndStartEnd(
    a_start: Vector,
    a_end: Vector,
    b_start: Vector,
    b_end: Vector
  ) {
    const denominator =
      (b_end.y - b_start.y) * (a_end.x - a_start.x) -
      (b_end.x - b_start.x) * (a_end.y - a_start.y);
    const uA =
      ((b_end.x - b_start.x) * (a_start.y - b_start.y) -
        (b_end.y - b_start.y) * (a_start.x - b_start.x)) /
      denominator;
    const uB =
      ((a_end.x - a_start.x) * (a_start.y - b_start.y) -
        (a_end.y - a_start.y) * (a_start.x - b_start.x)) /
      denominator;

    return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
  }
  //    based on http://www.jeffreythompson.org/collision-detection/poly-line.php
  static #polygonLine(a_vertices: Vector[], b_start: Vector, b_end: Vector) {
    for (let index1 = 0; index1 < a_vertices.length; index1++) {
      const index2 = (index1 + 1) % a_vertices.length;
      const a_start = a_vertices[index1];
      const a_end = a_vertices[index2];
      const isColliding = Collide.#startEndStartEnd(
        a_start,
        a_end,
        b_start,
        b_end
      );
      if (isColliding) return true;
    }
    return false;
  }
  //  based on http://www.jeffreythompson.org/collision-detection/poly-point.php
  static #polygonVector(a_vertices: Vector[], b: Vector) {
    let collision = false;
    for (let index1 = 0; index1 < a_vertices.length; index1++) {
      const index2 = (index1 + 1) % a_vertices.length;
      const a_start = a_vertices[index1];
      const a_end = a_vertices[index2];
      if (
        ((a_start.y >= b.y && a_end.y < b.y) ||
          (a_start.y < b.y && a_end.y >= b.y)) &&
        b.x <
          ((a_end.x - a_start.x) * (b.y - a_start.y)) / (a_end.y - a_start.y) +
            a_start.x
      ) {
        collision = !collision;
      }
    }
    return collision;
  }
  static #polygonPolygon(a_vertices: Vector[], b_vertices: Vector[]) {
    for (let index1 = 0; index1 < b_vertices.length; index1++) {
      const index2 = (index1 + 1) % b_vertices.length;
      const b_start = b_vertices[index1];
      const b_end = b_vertices[index2];
      const isIntersecting = Collide.#polygonLine(a_vertices, b_start, b_end);
      if (isIntersecting) return true;
      const isInside = Collide.#polygonVector(a_vertices, b_start);
      if (isInside) return true;
    }
    for (const a_vertex of a_vertices) {
      if (Collide.#polygonVector(b_vertices, a_vertex)) return true;
    }
    return false;
  }
  static rectangle = {
    line(a: Rectangle, b: Line) {
      const [rectTopLeft, rectBottomRight] =
        Collide.rectangle.topLeftBottomRight(a);
      const [rectTopRight, rectBottomLeft] =
        Collide.rectangle.topRightBottomLeft(a);
      const rectVertices = [
        rectTopLeft,
        rectTopRight,
        rectBottomRight,
        rectBottomLeft,
      ];
      return this.#polygonLine(rectVertices, b.position, b.end);
    },
    rectangle(a: Rectangle, b: Rectangle) {
      const [topLeftA, bottomRightA] = Collide.rectangle.topLeftBottomRight(a);
      const [topLeftB, bottomRightB] = Collide.rectangle.topRightBottomLeft(b);
      if (a.angle === 0 && b.angle === 0) {
        return Collide.rectangle.unrotatedRectangles(
          topLeftA,
          bottomRightA,
          topLeftB,
          bottomRightB
        );
      }
      const [topRightA, bottomLeftA] = Collide.rectangle.topRightBottomLeft(a);
      const a_vertices = [topLeftA, topRightA, bottomRightA, bottomLeftA];

      const [topRightB, bottomLeftB] = Collide.rectangle.topRightBottomLeft(b);
      const b_vertices = [topLeftB, topRightB, bottomRightB, bottomLeftB];
      return Collide.#polygonPolygon(a_vertices, b_vertices);
    },
    topLeftBottomRight(rect: Rectangle) {
      return [
        rect.untransform(rect.position),
        rect.untransform(
          rect.position.x + rect.width,
          rect.position.y + rect.height
        ),
      ];
    },
    topRightBottomLeft(rect: Rectangle) {
      return [
        rect.untransform(rect.position.x + rect.width, rect.position.y),
        rect.untransform(rect.position.x, rect.position.y + rect.height),
      ];
    },
    unrotatedRectangles(
      topLeftA: Vector,
      bottomRightA: Vector,
      topLeftB: Vector,
      bottomRightB: Vector
    ) {
      const { x: left_a, y: top_a } = topLeftA;
      const { x: left_b, y: top_b } = topLeftB;
      const { x: right_a, y: bottom_a } = bottomRightA;
      const { x: right_b, y: bottom_b } = bottomRightB;
      return (
        left_a < right_b &&
        top_a < bottom_b &&
        left_b < right_a &&
        top_b < bottom_a
      );
    },
    vector(a: Rectangle, b: Vector) {
      const [rectTopLeft, rectBottomRight] =
        Collide.rectangle.topLeftBottomRight(a);
      if (a.angle === 0) {
        return (
          b.x >= rectTopLeft.x &&
          b.x <= rectBottomRight.x &&
          b.y >= rectTopLeft.y &&
          b.y <= rectBottomRight.y
        );
      }
      const [rectTopRight, rectBottomLeft] =
        Collide.rectangle.topRightBottomLeft(a);
      const rectVertices = [
        rectTopLeft,
        rectTopRight,
        rectBottomRight,
        rectBottomLeft,
      ];
      return Collide.#polygonVector(rectVertices, b);
    },
  };
}

export interface CollisionElement {
  colliding: (other: Mouse | Vector | Line | Rectangle) => boolean;
  hovered: boolean;
  clicked: boolean;
}
