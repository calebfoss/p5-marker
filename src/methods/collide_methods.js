/*
These methods are adapted from:
Repo: https://github.com/bmoren/p5.collide2D/
Created by http://benmoren.com
Some functions and code modified version from http://www.jeffreythompson.org/collision-detection
Version v0.7.3 | June 22, 2020
CC BY-NC-SA 4.0
*/
class Collide {
  static collider_type = {
    point: "point",
    circle: "circle",
    ellipse: "ellipse",
    rect: "rect",
    line: "line",
    arc: "arc",
    triangle: "triangle",
    poly: "poly",
  };
  #debug = false;
  #element;
  constructor(element) {
    this.#element = element;
  }
  get #pInst() {
    return this.#element.pInst;
  }
  get debug() {
    return this.#debug;
  }
  set debug(val) {
    this.#debug = val;
  }
  elements(elementA, elementB) {
    const { collider: colliderA } = elementA;
    const { collider: colliderB } = elementB;
    const argsA = elementA.collision_args;
    const argsB = elementB.collision_args;
    const fnNameForward = `${colliderA}_${colliderB}`;
    if (fnNameForward in this) return this[fnNameForward](...argsA, ...argsB);
    const fnNameBackward = `${colliderB}_${colliderA}`;
    if (fnNameBackward in this) return this[fnNameBackward](...argsB, ...argsA);
    console.warn(
      `Collision check between ${colliderA} and ${colliderB} has not been implemented`
    );
    return false;
  }

  /*~++~+~+~++~+~++~++~+~+~ 2D ~+~+~++~+~++~+~+~+~+~+~+~+~+~+~+*/

  rect_rect(x, y, w, h, x2, y2, w2, h2) {
    //2d
    //add in a thing to detect rectMode CENTER
    if (
      x + w >= x2 && // r1 right edge past r2 left
      x <= x2 + w2 && // r1 left edge past r2 right
      y + h >= y2 && // r1 top edge past r2 bottom
      y <= y2 + h2
    ) {
      // r1 bottom edge past r2 top
      return true;
    }
    return false;
  }

  // p5.vector version of collideRectRect
  rect_rect_vector(p1, sz, p2, sz2) {
    return this.rect_rect(p1.x, p1.y, sz.x, sz.y, p2.x, p2.y, sz2.x, sz2.y);
  }

  rect_circle(rx, ry, rw, rh, cx, cy, diameter) {
    //2d
    // temporary variables to set edges for testing
    var testX = cx;
    var testY = cy;

    // which edge is closest?
    if (cx < rx) {
      testX = rx; // left edge
    } else if (cx > rx + rw) {
      testX = rx + rw;
    } // right edge

    if (cy < ry) {
      testY = ry; // top edge
    } else if (cy > ry + rh) {
      testY = ry + rh;
    } // bottom edge

    // // get distance from closest edges
    var distance = this.#pInst.dist(cx, cy, testX, testY);

    // if the distance is less than the radius, collision!
    if (distance <= diameter / 2) {
      return true;
    }
    return false;
  }

  // p5.vector version of collideRectCircle
  rect_circle_vector(r, sz, c, diameter) {
    return this.rect_circle(r.x, r.y, sz.x, sz.y, c.x, c.y, diameter);
  }

  circle_circle(x, y, d, x2, y2, d2) {
    //2d
    if (this.#pInst.dist(x, y, x2, y2) <= d / 2 + d2 / 2) {
      return true;
    }
    return false;
  }

  // p5.vector version of collideCircleCircle
  circle_circle_vector(p1, d, p2, d2) {
    return this.circle_circle(p1.x, p1.y, d, p2.x, p2.y, d2);
  }

  point_circle(x, y, cx, cy, d) {
    //2d
    if (this.#pInst.dist(x, y, cx, cy) <= d / 2) {
      return true;
    }
    return false;
  }

  // p5.vector version of collidePointCircle
  point_circle_vector(p, c, d) {
    return this.point_circle(p.x, p.y, c.x, c.y, d);
  }

  point_ellipse(x, y, cx, cy, dx, dy) {
    //2d
    var rx = dx / 2,
      ry = dy / 2;
    // Discarding the points outside the bounding box
    if (x > cx + rx || x < cx - rx || y > cy + ry || y < cy - ry) {
      return false;
    }
    // Compare the point to its equivalent on the ellipse
    var xx = x - cx,
      yy = y - cy;
    var eyy = (ry * this.#pInst.sqrt(this.#pInst.abs(rx * rx - xx * xx))) / rx;
    return yy <= eyy && yy >= -eyy;
  }

  // p5.vector version of collidePointEllipse
  point_ellipse_vector(p, c, d) {
    return this.point_ellipse(p.x, p.y, c.x, c.y, d.x, d.y);
  }

  point_rect(pointX, pointY, x, y, xW, yW) {
    //2d
    if (
      pointX >= x && // right of the left edge AND
      pointX <= x + xW && // left of the right edge AND
      pointY >= y && // below the top AND
      pointY <= y + yW
    ) {
      // above the bottom
      return true;
    }
    return false;
  }

  // p5.vector version of collidePointRect
  point_rect_vector(point, p1, sz) {
    return this.point_rect(point.x, point.y, p1.x, p1.y, sz.x, sz.y);
  }
  //  TODO - Accommodate lines with higher stroke_weight
  point_line(px, py, x1, y1, x2, y2, buffer) {
    // get distance from the point to the two ends of the line
    var d1 = this.#pInst.dist(px, py, x1, y1);
    var d2 = this.#pInst.dist(px, py, x2, y2);

    // get the length of the line
    var lineLen = this.#pInst.dist(x1, y1, x2, y2);

    // since floats are so minutely accurate, add a little buffer zone that will give collision
    if (buffer === undefined) {
      buffer = 0.1;
    } // higher # = less accurate

    // if the two distances are equal to the line's length, the point is on the line!
    // note we use the buffer here to give a range, rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
      return true;
    }
    return false;
  }

  // p5.vector version of collidePointLine
  point_line_vector(point, p1, p2, buffer) {
    return this.point_line(point.x, point.y, p1.x, p1.y, p2.x, p2.y, buffer);
  }

  line_circle(x1, y1, x2, y2, cx, cy, diameter) {
    // is either end INSIDE the circle?
    // if so, return true immediately
    var inside1 = this.point_circle(x1, y1, cx, cy, diameter);
    var inside2 = this.point_circle(x2, y2, cx, cy, diameter);
    if (inside1 || inside2) return true;

    // get length of the line
    var distX = x1 - x2;
    var distY = y1 - y2;
    var len = this.#pInst.sqrt(distX * distX + distY * distY);

    // get dot product of the line and circle
    var dot =
      ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / this.#pInst.pow(len, 2);

    // find the closest point on the line
    var closestX = x1 + dot * (x2 - x1);
    var closestY = y1 + dot * (y2 - y1);

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    var onSegment = this.point_line(closestX, closestY, x1, y1, x2, y2);
    if (!onSegment) return false;

    // draw a debug circle at the closest point on the line
    if (this.#debug) {
      this.#pInst.ellipse(closestX, closestY, 10, 10);
    }

    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    var distance = this.#pInst.sqrt(distX * distX + distY * distY);

    if (distance <= diameter / 2) {
      return true;
    }
    return false;
  }

  // p5.vector version of collideLineCircle
  line_circle_vector(p1, p2, c, diameter) {
    return this.line_circle(p1.x, p1.y, p2.x, p2.y, c.x, c.y, diameter);
  }
  line_line(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
    var intersection;

    // calculate the distance to intersection point
    var uA =
      ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
      ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var uB =
      ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
      ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      if (this.#debug || calcIntersection) {
        // calc the point where the lines meet
        var intersectionX = x1 + uA * (x2 - x1);
        var intersectionY = y1 + uA * (y2 - y1);
      }

      if (this.#debug) {
        this.#pInst.ellipse(intersectionX, intersectionY, 10, 10);
      }

      if (calcIntersection) {
        intersection = {
          x: intersectionX,
          y: intersectionY,
        };
        return intersection;
      } else {
        return true;
      }
    }
    if (calcIntersection) {
      intersection = {
        x: false,
        y: false,
      };
      return intersection;
    }
    return false;
  }

  // p5.vector version of collideLineLine
  line_line_vector(p1, p2, p3, p4, calcIntersection) {
    return this.line_line(
      p1.x,
      p1.y,
      p2.x,
      p2.y,
      p3.x,
      p3.y,
      p4.x,
      p4.y,
      calcIntersection
    );
  }

  line_rect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
    // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
    var left, right, top, bottom, intersection;

    if (calcIntersection) {
      left = this.line_line(x1, y1, x2, y2, rx, ry, rx, ry + rh, true);
      right = this.line_line(
        x1,
        y1,
        x2,
        y2,
        rx + rw,
        ry,
        rx + rw,
        ry + rh,
        true
      );
      top = this.line_line(x1, y1, x2, y2, rx, ry, rx + rw, ry, true);
      bottom = this.line_line(
        x1,
        y1,
        x2,
        y2,
        rx,
        ry + rh,
        rx + rw,
        ry + rh,
        true
      );
      intersection = {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
      };
    } else {
      //return booleans
      left = this.line_line(x1, y1, x2, y2, rx, ry, rx, ry + rh);
      right = this.line_line(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
      top = this.line_line(x1, y1, x2, y2, rx, ry, rx + rw, ry);
      bottom = this.line_line(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);
    }

    // if ANY of the above are true, the line has hit the rectangle
    if (left || right || top || bottom) {
      if (calcIntersection) {
        return intersection;
      }
      return true;
    }
    return false;
  }

  // p5.vector version of collideLineRect
  line_rect_vector(p1, p2, r, rsz, calcIntersection) {
    return this.line_rect(
      p1.x,
      p1.y,
      p2.x,
      p2.y,
      r.x,
      r.y,
      rsz.x,
      rsz.y,
      calcIntersection
    );
  }

  point_poly(px, py, vertices) {
    var collision = false;

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position this makes our if statement a little cleaner
      var vc = vertices[current]; // c for "current"
      var vn = vertices[next]; // n for "next"

      // compare position, flip 'collision' variable back and forth
      if (
        ((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
        px < ((vn.x - vc.x) * (py - vc.y)) / (vn.y - vc.y) + vc.x
      ) {
        collision = !collision;
      }
    }
    return collision;
  }

  // p5.vector version of collidePointPoly
  point_poly_vector(p1, vertices) {
    return this.point_poly(p1.x, p1.y, vertices);
  }

  // POLYGON/CIRCLE
  circle_poly(cx, cy, diameter, vertices, interior) {
    if (interior === undefined) {
      interior = false;
    }

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position this makes our if statement a little cleaner
      var vc = vertices[current]; // c for "current"
      var vn = vertices[next]; // n for "next"

      // check for collision between the circle and a line formed between the two vertices
      var collision = this.line_circle(
        vc.x,
        vc.y,
        vn.x,
        vn.y,
        cx,
        cy,
        diameter
      );
      if (collision) return true;
    }

    // test if the center of the circle is inside the polygon
    if (interior === true) {
      var centerInside = this.point_poly(cx, cy, vertices);
      if (centerInside) return true;
    }

    // otherwise, after all that, return false
    return false;
  }

  // p5.vector version of collideCirclePoly
  circle_poly_vector(c, diameter, vertices, interior) {
    return this.circle_poly(c.x, c.y, diameter, vertices, interior);
  }

  rect_poly(rx, ry, rw, rh, vertices, interior) {
    if (interior == undefined) {
      interior = false;
    }

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position this makes our if statement a little cleaner
      var vc = vertices[current]; // c for "current"
      var vn = vertices[next]; // n for "next"

      // check against all four sides of the rectangle
      var collision = this.line_rect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
      if (collision) return true;

      // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
      if (interior === true) {
        var inside = this.point_poly(rx, ry, vertices);
        if (inside) return true;
      }
    }

    return false;
  }

  // p5.vector version of collideRectPoly
  rect_poly_vector(r, rsz, vertices, interior) {
    return this.rect_poly(r.x, r.y, rsz.x, rsz.y, vertices, interior);
  }

  line_poly(x1, y1, x2, y2, vertices) {
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position extract X/Y coordinates from each
      var x3 = vertices[current].x;
      var y3 = vertices[current].y;
      var x4 = vertices[next].x;
      var y4 = vertices[next].y;

      // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
      var hit = this.line_line(x1, y1, x2, y2, x3, y3, x4, y4);
      if (hit) {
        return true;
      }
    }
    // never got a hit
    return false;
  }

  // p5.vector version of collideLinePoly
  line_poly_vector(p1, p2, vertice) {
    return this.line_poly(p1.x, p1.y, p2.x, p2.y, vertice);
  }

  poly_poly(p1, p2, interior) {
    if (interior === undefined) {
      interior = false;
    }

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < p1.length; current++) {
      // get next vertex in list, if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === p1.length) next = 0;

      // get the PVectors at our current position this makes our if statement a little cleaner
      var vc = p1[current]; // c for "current"
      var vn = p1[next]; // n for "next"

      //use these two points (a line) to compare to the other polygon's vertices using polyLine()
      var collision = this.line_poly(vc.x, vc.y, vn.x, vn.y, p2);
      if (collision) return true;

      //check if the either polygon is INSIDE the other
      if (interior === true) {
        collision = this.point_poly(p2[0].x, p2[0].y, p1);
        if (collision) return true;
        collision = this.point_poly(p1[0].x, p1[0].y, p2);
        if (collision) return true;
      }
    }

    return false;
  }

  poly_poly_vector(p1, p2, interior) {
    return this.poly_poly(p1, p2, interior);
  }

  point_triangle(px, py, x1, y1, x2, y2, x3, y3) {
    // get the area of the triangle
    var areaOrig = this.#pInst.abs(
      (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
    );

    // get the area of 3 triangles made between the point and the corners of the triangle
    var area1 = this.#pInst.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
    var area2 = this.#pInst.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
    var area3 = this.#pInst.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));

    // if the sum of the three areas equals the original, we're inside the triangle!
    if (area1 + area2 + area3 === areaOrig) {
      return true;
    }
    return false;
  }

  // p5.vector version of collidePointTriangle
  point_triangle_vector(p, p1, p2, p3) {
    return this.point_triangle(p.x, p.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }

  point_point(x, y, x2, y2, buffer) {
    if (buffer === undefined) {
      buffer = 0;
    }

    if (this.#pInst.dist(x, y, x2, y2) <= buffer) {
      return true;
    }

    return false;
  }

  // p5.vector version of collidePointPoint
  point_point_vector(p1, p2, buffer) {
    return this.point_point(p1.x, p1.y, p2.x, p2.y, buffer);
  }
  //  TODO - accommodate arcs with unequal width and height
  point_arc(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {
    if (buffer === undefined) {
      buffer = 0;
    }
    // point
    var point = this.#pInst.createVector(px, py);
    // arc center point
    var arcPos = this.#pInst.createVector(ax, ay);
    // arc radius vector
    var radius = this.#pInst.createVector(arcRadius, 0).rotate(arcHeading);

    var pointToArc = point.copy().sub(arcPos);

    if (point.dist(arcPos) <= arcRadius + buffer) {
      var dot = radius.dot(pointToArc);
      var angle = radius.angleBetween(pointToArc);
      if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
        return true;
      }
    }
    return false;
  }

  // p5.vector version of collidePointArc
  point_arc_vector(p1, a, arcRadius, arcHeading, arcAngle, buffer) {
    return this.point_arc(
      p1.x,
      p1.y,
      a.x,
      a.y,
      arcRadius,
      arcHeading,
      arcAngle,
      buffer
    );
  }
}
export const { collider_type } = Collide;
export const addCollide = (baseClass) =>
  class extends baseClass {
    /**
     * The collide object provides collision detection methods for different
     * shapes. These methods are adapted from
     * <a href="https://github.com/bmoren">Ben Moren's</a>
     * <a href="https://github.com/bmoren/p5.collide2D">Collide2D library</a>.
     * These links are written how these methods would be called in Marker, and
     * they link to the documentation for their corresponding Collide2D
     * function, which has the same parameters:
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointpoint">
     * collide.point_point()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointcircle">
     * collide.point_circle()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointellipse">
     * collide.point_ellipse()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointrect">
     * collide.point_rect()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointline">
     * collide.point_line()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointarc">
     * collide.point_arc()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#colliderectrect">
     * collide.rect_rect()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidecirclecircle">
     * collide.circle_circle()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#colliderectcircle">
     * collide.rect_circle()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidelineline">
     * collide.line_line()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidelinecircle">
     * collide.line_circle()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidelinerect">
     * collide.line_rect()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointpoly">
     * collide.point_poly()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidecirclepoly">
     * collide.circle_poly()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#colliderectpoly">
     * collide.rect_poly()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidelinepoly">
     * collide.line_poly()</a>
     *- <a href="https://github.com/bmoren/p5.collide2D#collidepolypoly">
     * collide.poly_poly()</a>
     * - <a href="https://github.com/bmoren/p5.collide2D#collidepointtriangle">
     * collide.point_triangle()</a>
     */
    collide = new Collide(this);
    /**
     * Checks if this element is colliding with the provided other element.
     * @method colliding_with
     * @param {P5Element} el - other element to check
     * @returns {boolean} true if elements are colliding
     */
    colliding_with(el) {
      return this.collide.elements(this, el);
    }
  };
