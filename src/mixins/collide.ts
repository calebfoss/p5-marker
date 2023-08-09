import { Rectangle } from "../elements/2d_shapes";
import { Vector } from "./vector";

export class Collide {
  static #unrotatedRectangles(
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
  }
  //    based on http://www.jeffreythompson.org/collision-detection/line-line.php
  static #lineLine(
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
      const isColliding = Collide.#lineLine(a_start, a_end, b_start, b_end);
      if (isColliding) return true;
    }
    return false;
  }
  //  based on http://www.jeffreythompson.org/collision-detection/poly-point.php
  static #polygonPoint(a_vertices: Vector[], b: Vector) {
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
      const isInside = Collide.#polygonPoint(a_vertices, b_start);
      if (isInside) return true;
    }
    for (const a_vertex of a_vertices) {
      if (Collide.#polygonPoint(b_vertices, a_vertex)) return true;
    }
    return false;
  }
  static rectangleRectangle(a: Rectangle, b: Rectangle) {
    const topLeftA = a.untransform(a.position);
    const topLeftB = b.untransform(b.position);
    const bottomRightA = a.untransform(
      a.position.x + a.width,
      a.position.y + a.height
    );
    const bottomRightB = b.untransform(
      b.position.x + b.width,
      b.position.y + b.height
    );
    if (a.angle === 0 && b.angle === 0) {
      return Collide.#unrotatedRectangles(
        topLeftA,
        bottomRightA,
        topLeftB,
        bottomRightB
      );
    }
    const topRightA = a.untransform(a.position.x + a.width, a.position.y);
    const bottomLeftA = a.untransform(a.position.x, a.position.y + a.height);
    const a_vertices = [topLeftA, topRightA, bottomRightA, bottomLeftA];

    const topRightB = b.untransform(b.position.x + b.width, b.position.y);
    const bottomLeftB = b.untransform(b.position.x, b.position.y + b.height);
    const b_vertices = [topLeftB, topRightB, bottomRightB, bottomLeftB];
    return Collide.#polygonPolygon(a_vertices, b_vertices);
  }
}
