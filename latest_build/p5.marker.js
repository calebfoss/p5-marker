// p5-marker v0.2.0 Tue Feb 21 2023 https://github.com/calebfoss/p5-marker.git
const $7a53813bc2528edd$var$upperCaseChar = /([A-Z])/g;
const $7a53813bc2528edd$var$upperCaseCharAfterFirst = /(?<!^)[A-Z]/g;
//  js string replace 2nd param
const $7a53813bc2528edd$var$prependMatch = (char)=>char + "$&";
const $7a53813bc2528edd$export$f38e744fd7a17882 = (camelStr)=>camelStr.replace($7a53813bc2528edd$var$upperCaseCharAfterFirst, $7a53813bc2528edd$var$prependMatch("-")).toLowerCase();
const $7a53813bc2528edd$export$e12f55f9c91df96a = (camelStr)=>camelStr.replace($7a53813bc2528edd$var$upperCaseCharAfterFirst, $7a53813bc2528edd$var$prependMatch("_")).toLowerCase();
const $7a53813bc2528edd$export$fd546b5ffd1f6a92 = (kebabStr)=>kebabStr.replace(/-./g, (s)=>s[1].toUpperCase());
const $7a53813bc2528edd$export$1e3da36a069282b8 = (pascalStr)=>pascalStr.slice(0, 1).toLowerCase() + pascalStr.slice(1);
const $7a53813bc2528edd$export$b797531657428303 = (pascalStr)=>$7a53813bc2528edd$export$1e3da36a069282b8(pascalStr).replaceAll($7a53813bc2528edd$var$upperCaseChar, (c)=>"-" + c.toLowerCase());
const $7a53813bc2528edd$export$c41e01cfc9033fe7 = (pascalStr)=>$7a53813bc2528edd$export$1e3da36a069282b8(pascalStr).replaceAll($7a53813bc2528edd$var$upperCaseChar, (c)=>"_" + c.toLowerCase());
const $7a53813bc2528edd$export$b70dcce1c70696bf = (snakeStr)=>snakeStr.split("_").map((s, i)=>i > 0 ? s.slice(0, 1).toUpperCase() + s.slice(1) : s).join("");



function $1b3618ac1b6555cf$export$b61bda4fbca264f2(obj) {
    for(const p in obj)p5.prototype[p] = {};
    Object.defineProperties(p5.prototype, obj);
}
const $1b3618ac1b6555cf$export$e00416b3cd122575 = (methodName, wrapper)=>p5.prototype[methodName] = wrapper(p5.prototype[methodName]);
const $1b3618ac1b6555cf$export$49218a2feaa1d459 = (...propNames)=>propNames.forEach((propName)=>p5.prototype[(0, $7a53813bc2528edd$export$e12f55f9c91df96a)(propName)] = p5.prototype[propName]);
const $1b3618ac1b6555cf$export$44f806bc073ff27e = (...methodNames)=>methodNames.forEach((methodName)=>$1b3618ac1b6555cf$export$b61bda4fbca264f2({
            [(0, $7a53813bc2528edd$export$e12f55f9c91df96a)(methodName)]: {
                get: function() {
                    return this._renderer?.[`_${methodName}`];
                },
                set: function(val) {
                    if (Array.isArray(val)) this[methodName](...val);
                    else this[methodName](val);
                }
            }
        }));


const $03bbbf8eda9a336e$export$f5ddaad6515de8cc = (baseClass)=>class extends baseClass {
        /**
     * Creates a new <a href="#/p5.Camera">p5.Camera</a> object and sets it
     * as the current (active) camera.
     *
     * The new camera is initialized with a default position
     * (see camera property)
     * and a default perspective projection
     * (see <a href="#/p5.Camera/perspective">perspective()</a>).
     * Its properties can be controlled with the <a href="#/p5.Camera">p5.Camera</a>
     * methods.
     *
     * Note: Every 3D sketch starts with a default camera initialized.
     * This camera can be controlled with the canvas properties
     * camera,
     * perspective, ortho,
     * and frustum if it is the only camera
     * in the scene.
     * @method create_camera
     * @return {p5.Camera} The newly created camera object.
     */ create_camera() {
            this.pInst.createCamera();
        }
        /**
     * Creates a new <a href="#/p5.Shader">p5.Shader</a> object
     * from the provided vertex and fragment shader code.
     *
     * Note, shaders can only be used in WEBGL mode.
     * @method create_shader
     * @param {String} vertSrc source code for the vertex shader
     * @param {String} fragSrc source code for the fragment shader
     * @returns {p5.Shader} a shader object created from the provided
     */ create_shader() {
            this.pInst.createShader(...arguments);
        }
    };


const $dfaf816c8f7968eb$export$df7182d31779a5d2 = (baseClass)=>class extends baseClass {
        lerp_color() {
            return this.pInst.lerpColor(...arguments);
        }
    };


const $74cf9122b1ef1f14$export$89e97ff02600e0c0 = (baseClass)=>class extends baseClass {
        /**
     * The storage property allows data to be saved in local storage on
     * the device displaying the sketch. This data will remain until the
     * user clears local storage, so you can use this to remember something
     * between uses, such as the high score of a game.
     *
     * To store something, simply add a custom property to storage:
     * ```xml
     * <_ storage.my_property="123" />
     * ```
     * Any element can reference that property.
     * ```xml
     * <square x="storage.my_property" />
     * ```
     * To clear the storage, call the clear method on storage.
     * ```xml
     * <_ _="storage.clear()" />
     * ```
     * To remove a property, call the remove method and pass in the name
     * of the property as a string.
     * ```xml
     * <_ _="storage.remove('my_property')" />
     * ```
     * @type {Proxy}
     */ get storage() {
            return new Proxy(this.pInst, {
                get (target, prop) {
                    if (prop === "clear") return target.clearStorage;
                    if (prop === "remove") return target.removeItem;
                    return target.getItem(prop);
                },
                set (target, prop, val) {
                    target.storeItem(prop, val);
                    return true;
                }
            });
        }
    };


const $36d0bcbd88d70227$export$480a8cd27449d6bd = (baseClass)=>class extends baseClass {
        /**
     *
     * Creates a new instance of p5.StringDict using the key-value pair
     * or the object you provide.
     *
     * @method create_string_dict
     * @param {String} key
     * @param {String} value
     * @returns {p5.StringDict}
     * @method create_string_dict
     * @param {Object} object - key-value pairs
     * @return {p5.StringDict}
     */ create_string_dict() {
            return this.pInst.createStringDict(...arguments);
        }
        /**
     *
     * Creates a new instance of <a href="#/p5.NumberDict">p5.NumberDict</a> using the key-value pair
     * or object you provide.
     *
     * @method create_number_dict
     * @param {Number} key
     * @param {Number} value
     * @return {p5.NumberDict}
     *
     */ /**
     * @method create_number_dict
     * @param {Object} object - key-value pairs
     * @return {p5.NumberDict}
     */ create_number_dict() {
            return this.pInst.createNumberDict(...arguments);
        }
    };


/*
These methods are adapted from:
Repo: https://github.com/bmoren/p5.collide2D/
Created by http://benmoren.com
Some functions and code modified version from http://www.jeffreythompson.org/collision-detection
Version v0.7.3 | June 22, 2020
CC BY-NC-SA 4.0
*/ class $16ac526ed636526d$var$Collide {
    static collider_type = {
        point: "point",
        circle: "circle",
        ellipse: "ellipse",
        rect: "rect",
        line: "line",
        arc: "arc",
        triangle: "triangle",
        poly: "poly"
    };
    #debug = false;
    #element;
    constructor(element){
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
        const { collider: colliderA  } = elementA;
        const { collider: colliderB  } = elementB;
        const argsA = elementA.collision_args;
        const argsB = elementB.collision_args;
        const fnNameForward = `${colliderA}_${colliderB}`;
        if (fnNameForward in this) return this[fnNameForward](...argsA, ...argsB);
        const fnNameBackward = `${colliderB}_${colliderA}`;
        if (fnNameBackward in this) return this[fnNameBackward](...argsB, ...argsA);
        console.warn(`Collision check between ${colliderA} and ${colliderB} has not been implemented`);
        return false;
    }
    /*~++~+~+~++~+~++~++~+~+~ 2D ~+~+~++~+~++~+~+~+~+~+~+~+~+~+~+*/ rect_rect(x, y, w, h, x2, y2, w2, h2) {
        //2d
        //add in a thing to detect rectMode CENTER
        if (x + w >= x2 && x <= x2 + w2 && y + h >= y2 && y <= y2 + h2) // r1 bottom edge past r2 top
        return true;
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
        if (cx < rx) testX = rx; // left edge
        else if (cx > rx + rw) testX = rx + rw;
         // right edge
        if (cy < ry) testY = ry; // top edge
        else if (cy > ry + rh) testY = ry + rh;
         // bottom edge
        // // get distance from closest edges
        var distance = this.#pInst.dist(cx, cy, testX, testY);
        // if the distance is less than the radius, collision!
        if (distance <= diameter / 2) return true;
        return false;
    }
    // p5.vector version of collideRectCircle
    rect_circle_vector(r, sz, c, diameter) {
        return this.rect_circle(r.x, r.y, sz.x, sz.y, c.x, c.y, diameter);
    }
    circle_circle(x, y, d, x2, y2, d2) {
        //2d
        if (this.#pInst.dist(x, y, x2, y2) <= d / 2 + d2 / 2) return true;
        return false;
    }
    // p5.vector version of collideCircleCircle
    circle_circle_vector(p1, d, p2, d2) {
        return this.circle_circle(p1.x, p1.y, d, p2.x, p2.y, d2);
    }
    point_circle(x, y, cx, cy, d) {
        //2d
        if (this.#pInst.dist(x, y, cx, cy) <= d / 2) return true;
        return false;
    }
    // p5.vector version of collidePointCircle
    point_circle_vector(p, c, d) {
        return this.point_circle(p.x, p.y, c.x, c.y, d);
    }
    point_ellipse(x, y, cx, cy, dx, dy) {
        //2d
        var rx = dx / 2, ry = dy / 2;
        // Discarding the points outside the bounding box
        if (x > cx + rx || x < cx - rx || y > cy + ry || y < cy - ry) return false;
        // Compare the point to its equivalent on the ellipse
        var xx = x - cx, yy = y - cy;
        var eyy = ry * this.#pInst.sqrt(this.#pInst.abs(rx * rx - xx * xx)) / rx;
        return yy <= eyy && yy >= -eyy;
    }
    // p5.vector version of collidePointEllipse
    point_ellipse_vector(p, c, d) {
        return this.point_ellipse(p.x, p.y, c.x, c.y, d.x, d.y);
    }
    point_rect(pointX, pointY, x, y, xW, yW) {
        //2d
        if (pointX >= x && pointX <= x + xW && pointY >= y && pointY <= y + yW) // above the bottom
        return true;
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
        if (buffer === undefined) buffer = 0.1;
         // higher # = less accurate
        // if the two distances are equal to the line's length, the point is on the line!
        // note we use the buffer here to give a range, rather than one #
        if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) return true;
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
        var dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / this.#pInst.pow(len, 2);
        // find the closest point on the line
        var closestX = x1 + dot * (x2 - x1);
        var closestY = y1 + dot * (y2 - y1);
        // is this point actually on the line segment?
        // if so keep going, but if not, return false
        var onSegment = this.point_line(closestX, closestY, x1, y1, x2, y2);
        if (!onSegment) return false;
        // draw a debug circle at the closest point on the line
        if (this.#debug) this.#pInst.ellipse(closestX, closestY, 10, 10);
        // get distance to closest point
        distX = closestX - cx;
        distY = closestY - cy;
        var distance = this.#pInst.sqrt(distX * distX + distY * distY);
        if (distance <= diameter / 2) return true;
        return false;
    }
    // p5.vector version of collideLineCircle
    line_circle_vector(p1, p2, c, diameter) {
        return this.line_circle(p1.x, p1.y, p2.x, p2.y, c.x, c.y, diameter);
    }
    line_line(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
        var intersection;
        // calculate the distance to intersection point
        var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            if (this.#debug || calcIntersection) {
                // calc the point where the lines meet
                var intersectionX = x1 + uA * (x2 - x1);
                var intersectionY = y1 + uA * (y2 - y1);
            }
            if (this.#debug) this.#pInst.ellipse(intersectionX, intersectionY, 10, 10);
            if (calcIntersection) {
                intersection = {
                    x: intersectionX,
                    y: intersectionY
                };
                return intersection;
            } else return true;
        }
        if (calcIntersection) {
            intersection = {
                x: false,
                y: false
            };
            return intersection;
        }
        return false;
    }
    // p5.vector version of collideLineLine
    line_line_vector(p1, p2, p3, p4, calcIntersection) {
        return this.line_line(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, calcIntersection);
    }
    line_rect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
        // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
        var left, right, top, bottom, intersection;
        if (calcIntersection) {
            left = this.line_line(x1, y1, x2, y2, rx, ry, rx, ry + rh, true);
            right = this.line_line(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, true);
            top = this.line_line(x1, y1, x2, y2, rx, ry, rx + rw, ry, true);
            bottom = this.line_line(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, true);
            intersection = {
                left: left,
                right: right,
                top: top,
                bottom: bottom
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
            if (calcIntersection) return intersection;
            return true;
        }
        return false;
    }
    // p5.vector version of collideLineRect
    line_rect_vector(p1, p2, r, rsz, calcIntersection) {
        return this.line_rect(p1.x, p1.y, p2.x, p2.y, r.x, r.y, rsz.x, rsz.y, calcIntersection);
    }
    point_poly(px, py, vertices) {
        var collision = false;
        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for(var current = 0; current < vertices.length; current++){
            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next === vertices.length) next = 0;
            // get the PVectors at our current position this makes our if statement a little cleaner
            var vc = vertices[current]; // c for "current"
            var vn = vertices[next]; // n for "next"
            // compare position, flip 'collision' variable back and forth
            if ((vc.y >= py && vn.y < py || vc.y < py && vn.y >= py) && px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x) collision = !collision;
        }
        return collision;
    }
    // p5.vector version of collidePointPoly
    point_poly_vector(p1, vertices) {
        return this.point_poly(p1.x, p1.y, vertices);
    }
    // POLYGON/CIRCLE
    circle_poly(cx, cy, diameter, vertices, interior) {
        if (interior === undefined) interior = false;
        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for(var current = 0; current < vertices.length; current++){
            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next === vertices.length) next = 0;
            // get the PVectors at our current position this makes our if statement a little cleaner
            var vc = vertices[current]; // c for "current"
            var vn = vertices[next]; // n for "next"
            // check for collision between the circle and a line formed between the two vertices
            var collision = this.line_circle(vc.x, vc.y, vn.x, vn.y, cx, cy, diameter);
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
        if (interior == undefined) interior = false;
        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for(var current = 0; current < vertices.length; current++){
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
        for(var current = 0; current < vertices.length; current++){
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
            if (hit) return true;
        }
        // never got a hit
        return false;
    }
    // p5.vector version of collideLinePoly
    line_poly_vector(p1, p2, vertice) {
        return this.line_poly(p1.x, p1.y, p2.x, p2.y, vertice);
    }
    poly_poly(p1, p2, interior) {
        if (interior === undefined) interior = false;
        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for(var current = 0; current < p1.length; current++){
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
        var areaOrig = this.#pInst.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
        // get the area of 3 triangles made between the point and the corners of the triangle
        var area1 = this.#pInst.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
        var area2 = this.#pInst.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
        var area3 = this.#pInst.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));
        // if the sum of the three areas equals the original, we're inside the triangle!
        if (area1 + area2 + area3 === areaOrig) return true;
        return false;
    }
    // p5.vector version of collidePointTriangle
    point_triangle_vector(p, p1, p2, p3) {
        return this.point_triangle(p.x, p.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    }
    point_point(x, y, x2, y2, buffer) {
        if (buffer === undefined) buffer = 0;
        if (this.#pInst.dist(x, y, x2, y2) <= buffer) return true;
        return false;
    }
    // p5.vector version of collidePointPoint
    point_point_vector(p1, p2, buffer) {
        return this.point_point(p1.x, p1.y, p2.x, p2.y, buffer);
    }
    //  TODO - accommodate arcs with unequal width and height
    point_arc(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {
        if (buffer === undefined) buffer = 0;
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
            if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) return true;
        }
        return false;
    }
    // p5.vector version of collidePointArc
    point_arc_vector(p1, a, arcRadius, arcHeading, arcAngle, buffer) {
        return this.point_arc(p1.x, p1.y, a.x, a.y, arcRadius, arcHeading, arcAngle, buffer);
    }
}
const { collider_type: $16ac526ed636526d$export$c8dddae6889b41c4  } = $16ac526ed636526d$var$Collide;
const $16ac526ed636526d$export$b46a7ea7c25c5e6d = (baseClass)=>class extends baseClass {
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
     */ collide = new $16ac526ed636526d$var$Collide(this);
        /**
     * Checks if this element is colliding with the provided other element.
     * @method colliding_with
     * @param {P5Element} el - other element to check
     * @returns {boolean} true if elements are colliding
     */ colliding_with(el) {
            return this.collide.elements(this, el);
        }
    };


const $0c9e79e2e9aa197e$export$1a988e7317c65621 = {
    NONE: "none",
    CORNER: "corner",
    CORNERS: "corners",
    CENTER: "center"
};


const $2127f1fec3724162$var$singleCharTokens = new Set("(),:?[]{}");
const $2127f1fec3724162$export$2b7f80a2c1376e05 = {
    number: "number",
    property: "property",
    member: "member",
    boolean: "boolean",
    additive: "additive",
    multiplicative: "multiplicative",
    not: "not",
    comparison: "comparison",
    equality: "equality",
    string: "string",
    constant: "constant",
    logical: "logical",
    until: "until",
    end: "end"
};
const $2127f1fec3724162$var$token = (kind, start, end, value)=>({
        kind: kind,
        start: start,
        end: end,
        value: value
    });
const $2127f1fec3724162$export$2362472f718c8625 = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.end, -1, -1, "END");
const $2127f1fec3724162$export$19b172c586f937c9 = (str)=>{
    const getTokens = (start = 0, tokens = [])=>{
        if (start === str.length) return tokens;
        const strFromStart = str.slice(start);
        const leadingWhitespace = strFromStart.match(/^\s+/);
        if (leadingWhitespace) {
            const end = start + leadingWhitespace[0].length;
            return getTokens(end, tokens);
        }
        if ($2127f1fec3724162$var$singleCharTokens.has(strFromStart[0])) {
            const end1 = start + 1;
            const singleCharToken = $2127f1fec3724162$var$token(strFromStart[0], start, end1, strFromStart[0]);
            return getTokens(end1, tokens.concat(singleCharToken));
        }
        const numberMatch = strFromStart.match(/^-?\d+(?:\.\d+)?/);
        if (numberMatch) {
            const end2 = start + numberMatch[0].length;
            const numberToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.number, start, end2, numberMatch[0]);
            return getTokens(end2, tokens.concat(numberToken));
        }
        const additiveMatch = strFromStart.match(/^[+-]/);
        if (additiveMatch) {
            const end3 = start + additiveMatch[0].length;
            const addToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.additive, start, end3, additiveMatch[0]);
            return getTokens(end3, tokens.concat(addToken));
        }
        const multiplicativeMatch = strFromStart.match(/^[*\/%]/);
        if (multiplicativeMatch) {
            const end4 = start + multiplicativeMatch[0].length;
            const multiplicativeToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.multiplicative, start, end4, multiplicativeMatch[0]);
            return getTokens(end4, tokens.concat(multiplicativeToken));
        }
        const booleanMatch = strFromStart.match(/^(?:true|false)/);
        if (booleanMatch) {
            const end5 = start + booleanMatch[0].length;
            const booleanToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.boolean, start, end5, booleanMatch[0]);
            return getTokens(end5, tokens.concat(booleanToken));
        }
        const notMatch = strFromStart.match(/^not/);
        if (notMatch) {
            const end6 = start + notMatch[0].length;
            const notToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.not, start, end6, notMatch[0]);
            return getTokens(end6, tokens.concat(notToken));
        }
        const comparisonMatch = strFromStart.match(/^(?:(?:is\s)?\s*less\s+than|(?:is\s)?\s*greater\s+than|(?:is\s)?\s*no\s+more\s+than|(?:is\s)?\s*at\s+least)/);
        if (comparisonMatch) {
            const end7 = start + comparisonMatch[0].length;
            //  Remove "is" at beginning and replace multiple spaces with single
            const val = comparisonMatch[0].replace(/is\s+/, "").replace(/\s+/g, " ");
            const comparisonToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.comparison, start, end7, val);
            return getTokens(end7, tokens.concat(comparisonToken));
        }
        const equalityMatch = strFromStart.match(/^(?:is\s+not|is)/);
        if (equalityMatch) {
            const end8 = start + equalityMatch[0].length;
            const equalityToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.equality, start, end8, equalityMatch[0]);
            return getTokens(end8, tokens.concat(equalityToken));
        }
        const logicalMatch = strFromStart.match(/^(?:and|or)/);
        if (logicalMatch) {
            const end9 = start + logicalMatch[0].length;
            const logicalToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.logical, start, end9, logicalMatch[0]);
            return getTokens(end9, tokens.concat(logicalToken));
        }
        const untilMatch = strFromStart.match(/^until/);
        if (untilMatch) {
            const end10 = start + untilMatch[0].length;
            const untilToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.until, start, end10, untilMatch[0]);
            return getTokens(end10, tokens.concat(untilToken));
        }
        const memberMatch = strFromStart.match(/^\.[a-zA-Z]\w*/);
        if (memberMatch) {
            const end11 = start + memberMatch[0].length;
            const memberToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.member, start, end11, memberMatch[0].slice(1));
            return getTokens(end11, tokens.concat(memberToken));
        }
        const constantMatch = Object.entries((0, $0c9e79e2e9aa197e$export$1a988e7317c65621)).find(([key])=>key === strFromStart.slice(0, key.length));
        if (constantMatch) {
            const end12 = start + constantMatch[0].length;
            const constantToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.constant, start, end12, constantMatch[1]);
            return getTokens(end12, tokens.concat(constantToken));
        }
        const propertyMatch = strFromStart.match(/^[a-zA-Z]\w*/);
        if (propertyMatch) {
            const end13 = start + propertyMatch[0].length;
            const propertyToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.property, start, end13, propertyMatch[0]);
            return getTokens(end13, tokens.concat(propertyToken));
        }
        const stringMatch = strFromStart.match(/^;.*?(?<!\\);/);
        if (stringMatch) {
            const end14 = start + stringMatch[0].length;
            const stringToken = $2127f1fec3724162$var$token($2127f1fec3724162$export$2b7f80a2c1376e05.string, start, end14, stringMatch[0].slice(1, -1).replace(/\\\;/g, ";"));
            return getTokens(end14, tokens.concat(stringToken));
        }
        console.error(`Unexpected token: ${strFromStart}`);
    };
    return getTokens();
};



const $c3f51faaa3dc8b2a$var$isArray = (tokens, parenthesesDepth = 0)=>{
    const [token, ...remainder] = tokens;
    if (typeof token === "undefined") return false;
    switch(token.kind){
        case "(":
            return $c3f51faaa3dc8b2a$var$isArray(remainder, parenthesesDepth + 1);
        case ")":
            return $c3f51faaa3dc8b2a$var$isArray(remainder, parenthesesDepth - 1);
        case ",":
            if (parenthesesDepth === 0) return true;
        default:
            return $c3f51faaa3dc8b2a$var$isArray(remainder, parenthesesDepth);
    }
};
const $c3f51faaa3dc8b2a$var$commaSeparateSections = (tokens, parenthesesDepth = 0, squareBracketDepth = 0, curlyBracketDepth = 0, sections = [
    []
])=>{
    const [token, ...remainder] = tokens;
    if (typeof token === "undefined") return sections;
    const lastSectionIndex = sections.length - 1;
    const lastSectionConcatenated = sections[lastSectionIndex].concat(token);
    const sectionsConcatenated = [
        ...sections.slice(0, lastSectionIndex),
        lastSectionConcatenated, 
    ];
    switch(token.kind){
        case "(":
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth + 1, squareBracketDepth, curlyBracketDepth, sectionsConcatenated);
        case ")":
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth - 1, squareBracketDepth, curlyBracketDepth, sectionsConcatenated);
        case "[":
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth, squareBracketDepth + 1, curlyBracketDepth, sectionsConcatenated);
        case "]":
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth, squareBracketDepth - 1, curlyBracketDepth, sectionsConcatenated);
        case "{":
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth, squareBracketDepth, curlyBracketDepth + 1, sectionsConcatenated);
        case "}":
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth, squareBracketDepth, curlyBracketDepth - 1, sectionsConcatenated);
        case ",":
            if (parenthesesDepth === 0 && squareBracketDepth === 0 && curlyBracketDepth === 0) return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth, squareBracketDepth, curlyBracketDepth, sections.concat([
                []
            ]));
        default:
            return $c3f51faaa3dc8b2a$var$commaSeparateSections(remainder, parenthesesDepth, squareBracketDepth, curlyBracketDepth, sectionsConcatenated);
    }
};
const $c3f51faaa3dc8b2a$var$hasColonOutsideTernaryAndParentheses = (tokens)=>{
    const sections = $c3f51faaa3dc8b2a$var$commaSeparateSections(tokens);
    for (const section of sections){
        const colonIndex = section.findIndex((token)=>token.kind === ":");
        if (colonIndex === -1) continue;
        const questionIndex = section.findIndex((token)=>token.kind === "?");
        if (questionIndex === -1 || colonIndex < questionIndex) return true;
    }
    return false;
};
const $c3f51faaa3dc8b2a$var$getRightParenthesisIndex = (tokens, index = 0, depth = 0)=>{
    const [token, ...remainder] = tokens;
    if (token.kind === "(") return $c3f51faaa3dc8b2a$var$getRightParenthesisIndex(remainder, index + 1, depth + 1);
    if (token.kind !== ")") return $c3f51faaa3dc8b2a$var$getRightParenthesisIndex(remainder, index + 1, depth);
    if (depth === 0) return index;
    return $c3f51faaa3dc8b2a$var$getRightParenthesisIndex(remainder, index + 1, depth - 1);
};
const $c3f51faaa3dc8b2a$export$98e6a39c04603d36 = (element, attrName, fullListOfTokens, debug = false)=>{
    const parentheses = (tokensAfterLeftParenthesis)=>{
        const rightParenthesisIndex = $c3f51faaa3dc8b2a$var$getRightParenthesisIndex(tokensAfterLeftParenthesis);
        if (rightParenthesisIndex < 0) {
            console.error("Found a left parenthesis ( without a matching right parenthesis )");
            return [
                ()=>{},
                tokensAfterLeftParenthesis
            ];
        }
        const tokensBetweenParentheses = tokensAfterLeftParenthesis.slice(0, rightParenthesisIndex);
        const getInnerValue = parseAndAutoEnclose(tokensBetweenParentheses);
        const tokensAfterParentheses = tokensAfterLeftParenthesis.slice(rightParenthesisIndex + 1);
        return [
            getInnerValue,
            tokensAfterParentheses
        ];
    };
    const objectLiteral = (tokensBetweenBrackets)=>{
        if (debug) console.log("OBJECT LITERAL");
        const sections = $c3f51faaa3dc8b2a$var$commaSeparateSections(tokensBetweenBrackets);
        const keyValuePairs = sections.map((sectionTokens, i)=>{
            const colonIndex = sectionTokens.findIndex((token)=>token.kind === ":");
            if (colonIndex < 0) {
                if (sectionTokens.length > 1) console.error("Couldn't figure out what to do with these:", sectionTokens);
                const propName = sectionTokens[0].value;
                const getValue = parseExpression(sectionTokens);
                return ()=>[
                        propName,
                        getValue()
                    ];
            }
            if (colonIndex === 0) {
                console.error("FOUND COLON AT BEGINNING OF SECTION");
                return ()=>[];
            }
            if (colonIndex === 1) {
                const propName1 = sectionTokens[0].value;
                const tokensAfterColon = sectionTokens.slice(2);
                const getValue1 = parseExpression(tokensAfterColon);
                return ()=>[
                        propName1,
                        getValue1()
                    ];
            }
            const getPropName = parseExpression(sectionTokens.slice(0, colonIndex));
            const getValue2 = parseAndAutoEnclose(sectionTokens.slice(colonIndex));
            return ()=>[
                    getPropName(),
                    getValue2()
                ];
        });
        return ()=>Object.fromEntries(keyValuePairs.map((fn)=>fn()));
    };
    const array = (tokensBetweenBrackets)=>{
        const sections = $c3f51faaa3dc8b2a$var$commaSeparateSections(tokensBetweenBrackets);
        const getSectionExpressions = sections.map((s)=>parseExpression(s));
        const getArray = ()=>getSectionExpressions.map((s)=>s());
        return getArray;
    };
    const getObjectWithProperty = (propertyToken)=>{
        const propName = propertyToken.value;
        const obj = element instanceof HTMLCanvasElement || attrName === "repeat" || attrName === "change" || propName === "above_sibling" || propName === "parent" || propName === "canvas" || propName === "above_siblings_off" ? element : element.parentElement;
        if (propName in obj === false) {
            if (propName in element.pInst) return [
                ()=>element.pInst,
                propName
            ];
            console.error(`On ${element.tagName}'s ${attrName}, couldn't find ${propName}`);
        }
        return [
            ()=>obj,
            propName
        ];
    };
    const member = (getObj, getPreviousMemberName, afterPreviousMember)=>{
        const [nextToken, ...remainder] = afterPreviousMember;
        if (nextToken.kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).member) return [
            getObj,
            getPreviousMemberName,
            afterPreviousMember
        ];
        return member(()=>getObj()[getPreviousMemberName()], ()=>nextToken.value, remainder);
    };
    const computedMember = (getBaseObj, firstMemberName, afterPreviousMember)=>{
        const getFirstMemberName = ()=>firstMemberName;
        const [getObj, getNextMemberName, afterNextMember] = member(getBaseObj, getFirstMemberName, afterPreviousMember);
        if (debug) console.log(`AFTER member, member name: ${getNextMemberName()} remaining tokens ${afterNextMember.map((t)=>t.value).join(" ")}`);
        const [nextToken, ...afterNext] = afterNextMember;
        if (nextToken.kind !== "[") return [
            getObj,
            getNextMemberName,
            afterNextMember
        ];
        const rightSquareBracketIndex = afterNext.findIndex((t)=>t.kind === "]");
        const tokensBetweenBrackets = afterNext.slice(0, rightSquareBracketIndex);
        const getComputedMemberName = parseExpression(tokensBetweenBrackets);
        const tokensAfterBrackets = afterNext.slice(rightSquareBracketIndex + 1);
        return member(()=>getObj()[getNextMemberName()], getComputedMemberName, tokensAfterBrackets);
    };
    const call = (getBaseObj, firstMemberName, afterFirstMember)=>{
        const [getObj, getLastMemberName, afterLastMember] = computedMember(getBaseObj, firstMemberName, afterFirstMember);
        if (debug) console.log(`AFTER computed member, member name: ${getLastMemberName()} remaining tokens ${afterLastMember.map((t)=>t.value).join(" ")}`);
        const [nextToken, ...afterNextToken] = afterLastMember;
        if (nextToken.kind !== "(") return [
            ()=>getObj()[getLastMemberName()],
            afterLastMember
        ];
        const rightParenthesisIndex = $c3f51faaa3dc8b2a$var$getRightParenthesisIndex(afterNextToken);
        afterNextToken.findIndex((t)=>t.kind === ")");
        const getArguments = array(afterNextToken.slice(0, rightParenthesisIndex));
        const tokensAfterParentheses = afterNextToken.slice(rightParenthesisIndex + 1);
        return [
            ()=>getObj()[getLastMemberName()](...getArguments()),
            tokensAfterParentheses, 
        ];
    };
    const property = (propertyToken, remainder)=>{
        const [getObj, memberName] = getObjectWithProperty(propertyToken);
        if (debug) console.log(`AFTER getObjectWithProperty propName: ${memberName} remaining tokens: ${remainder.map((t)=>t.value).join(" ")}`);
        return call(getObj, memberName, remainder);
    };
    const primary = (tokens)=>{
        const [token, ...remainder] = tokens;
        switch(token.kind){
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).string:
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).constant:
                return [
                    ()=>token.value,
                    remainder
                ];
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).number:
                const numberStringVal = token.value;
                return [
                    ()=>Number(numberStringVal),
                    remainder
                ];
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).boolean:
                const booleanValue = token.value === "true";
                return [
                    ()=>booleanValue,
                    remainder
                ];
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).not:
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).until:
                const rightOfNot = parseExpression(remainder.slice(0, -1));
                return [
                    ()=>!rightOfNot(),
                    remainder.slice(-1)
                ];
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).property:
                return property(token, remainder);
            case "(":
                return parentheses(remainder);
            case "[":
                const rightSquareBracketIndex = remainder.findIndex((t)=>t.kind === "]");
                if (rightSquareBracketIndex < 0) console.error(`On ${element.tagName}'s ${attrName}, found a [ left square bracket without matching right square bracket]`);
                return [
                    array(remainder.slice(0, rightSquareBracketIndex)),
                    remainder.slice(rightSquareBracketIndex + 1), 
                ];
            case "{":
                const rightCurlyBracketIndex = remainder.findIndex((t)=>t.kind === "}");
                if (rightCurlyBracketIndex < 0) console.error(`On ${element.tagName}'s ${attrName}, found a { left curly bracket without matching right curly bracket}`);
                return [
                    objectLiteral(remainder.slice(0, rightCurlyBracketIndex)),
                    remainder.slice(rightCurlyBracketIndex + 1), 
                ];
            case (0, $2127f1fec3724162$export$2b7f80a2c1376e05).additive:
                return [
                    ()=>0,
                    tokens
                ];
            default:
                console.error(`Parser failed on ${tokens.map((t)=>t.value).join(" ")}`);
                return [
                    ()=>undefined,
                    remainder
                ];
        }
    };
    const multiplicative = (tokens)=>{
        const [left, afterLeft] = primary(tokens);
        if (debug) console.log("AFTER PRIMARY", afterLeft.map((t)=>t.value).join(" "));
        const [operator, ...rightTokens] = afterLeft;
        if (operator.kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).multiplicative) return [
            left,
            afterLeft
        ];
        const [right, remainder] = multiplicative(rightTokens);
        if (operator.value === "*") return [
            ()=>left() * right(),
            remainder
        ];
        if (operator.value === "%") return [
            ()=>left() % right(),
            remainder
        ];
        return [
            ()=>left() / right(),
            remainder
        ];
    };
    const additive = (tokens)=>{
        const [left, afterLeft] = multiplicative(tokens);
        if (debug) console.log("AFTER MULT LEFT", afterLeft.map((t)=>t.value).join(" "));
        const [operator, ...rightTokens] = afterLeft;
        if (operator.kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).additive) return [
            left,
            afterLeft
        ];
        const [right, remainder] = additive(rightTokens);
        if (operator.value === "+") return [
            ()=>left() + right(),
            remainder
        ];
        return [
            ()=>left() - right(),
            remainder
        ];
    };
    const comparison = (tokens)=>{
        const [left, afterLeft] = additive(tokens);
        if (debug) console.log("AFTER ADDITIVE", afterLeft.map((t)=>t.value).join(" "));
        const [operator, ...rightTokens] = afterLeft;
        if (operator.kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).comparison) return [
            left,
            afterLeft
        ];
        const [right, remainder] = comparison(rightTokens);
        const getCompareFn = ()=>{
            switch(operator.value){
                case "less than":
                    return ()=>left() < right();
                case "no more than":
                    return ()=>left() <= right();
                case "at least":
                    return ()=>left() >= right();
                case "greater than":
                    return ()=>left() > right();
                default:
                    console.error(`On ${element.tagName}'s ${attrName}, comparison token was found with value '${operator.value}', but this value could not be matched with a function.`);
            }
        };
        return [
            getCompareFn(),
            remainder
        ];
    };
    const equality = (tokens)=>{
        const [left, afterLeft] = comparison(tokens);
        if (debug) console.log("AFTER COMPARE", afterLeft.map((t)=>t.value).join(" "));
        const [operator, ...rightTokens] = afterLeft;
        if (operator.kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).equality) return [
            left,
            afterLeft
        ];
        const [right, remainder] = equality(rightTokens);
        if (operator.value === "is") return [
            ()=>Object.is(left(), right()),
            remainder
        ];
        return [
            ()=>!Object.is(left(), right()),
            remainder
        ];
    };
    const logical = (tokens)=>{
        const [left, afterLeft] = equality(tokens);
        if (debug) console.log("AFTER EQUALITY", afterLeft.map((t)=>t.value).join(" "));
        const [operator, ...rightTokens] = afterLeft;
        if (operator.kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).logical) return [
            left,
            afterLeft
        ];
        const [right, remainder] = logical(rightTokens);
        if (operator.value === "and") return [
            ()=>left() && right(),
            remainder
        ];
        return [
            ()=>left() || right(),
            remainder
        ];
    };
    const ternary = (tokens)=>{
        const [left, afterLeft] = logical(tokens);
        if (debug) console.log("AFTER LOGICAL", afterLeft.map((t)=>t.value).join(" "));
        const [nextToken, ...afterNextToken] = afterLeft;
        if (nextToken.kind !== "?") return [
            left,
            afterLeft
        ];
        const colonIndex = afterNextToken.findIndex((token)=>token.kind === ":");
        const middle = parseAndAutoEnclose(afterNextToken.slice(0, colonIndex));
        const [right, afterRight] = ternary(afterNextToken.slice(colonIndex + 1));
        return [
            ()=>left() ? middle() : right(),
            afterRight
        ];
    };
    const end = (tokens)=>{
        if (tokens[0].kind === (0, $2127f1fec3724162$export$2b7f80a2c1376e05).end) return ()=>{};
        const [getExpression, afterExpression] = ternary(tokens);
        if (afterExpression.length === 0 || afterExpression.length === 1 && afterExpression[0].kind !== (0, $2127f1fec3724162$export$2b7f80a2c1376e05).end) console.error(`On ${element.tagName}'s ${attrName}, reached end of expression without an end token`);
        else if (afterExpression.length > 1) console.error(`On ${element.tagName}'s ${attrName}, reached end of expression and found remaining tokens: ${afterExpression.map((t)=>t.value).join(" ")}`);
        return getExpression;
    };
    const parseExpression = (tokens)=>{
        if (debug) console.log(`%cParsing ${tokens.map((t)=>t.value).join(" ")}`, "background: yellow; color: black; padding: 10px;");
        return end(tokens.concat((0, $2127f1fec3724162$export$2362472f718c8625)));
    };
    const parseAndAutoEnclose = (tokens)=>{
        if (debug) console.log(`%cAuto enclosing ${tokens.map((t)=>t.value).join(" ")}`, "background: lightblue; color: black; padding: 10px;");
        if ($c3f51faaa3dc8b2a$var$hasColonOutsideTernaryAndParentheses(tokens)) return objectLiteral(tokens);
        if ($c3f51faaa3dc8b2a$var$isArray(tokens)) return array(tokens);
        return parseExpression(tokens);
    };
    return parseAndAutoEnclose(fullListOfTokens);
};


const $a2ba0be321a8c9b5$export$67beed298888a38b = (element, attrName, attrValue)=>{
    const tokens = (0, $2127f1fec3724162$export$19b172c586f937c9)(attrValue);
    const getValue = (0, $c3f51faaa3dc8b2a$export$98e6a39c04603d36)(element, attrName, tokens);
    return getValue;
};


const $109b9a5ca7a37440$export$a00e2346eabbdbef = (el)=>{
    const name = (0, $a2ba0be321a8c9b5$export$67beed298888a38b)(el, "name", el.getAttribute("name"))();
    //  Trick custom-elements-manifest into ignoring this
    customElements["define"](`p-${name}`, class extends el.constructor {
        renderFunctionName = el.renderFunctionName;
        constructor(){
            super();
        }
        /**
       * Sets the default values for this element's attributes.
       */ setDefaults() {
            Array.from(el.attributes).forEach((a)=>this.hasAttribute(a.name) === false && this.setAttribute(a.name, a.value));
            const childClones = Array.from(el.children).map((child)=>child.cloneNode(true));
            this.prepend(...childClones);
        }
        renderToCanvas = null;
    });
};
/**
 * This HTML element loads an XML sketch file. This should be added to the
 * index.html file as a `<link>` element with the attributes is="p-sketch" and
 * href="[PATH TO XML FILE]".
 * @element p-sketch
 * @example Add a sketch to html
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <head>
 *   <script src="p5.js"></script>
 *   <script src="p5.marker.js" defer></script>
 *   <link rel="stylesheet" type="text/css" href="style.css" />
 *   <link href="sketch.xml" is="p-sketch" />
 *   <meta charset="utf-8" />
 * </head>
 * <body></body>
 * </html>
 * ```
 */ class $109b9a5ca7a37440$var$Sketch extends HTMLLinkElement {
    static elementName = "p-sketch";
    constructor(){
        super();
        this.#loadXML(this.href);
    }
     #convertElement(xmlEl) {
        const xmlTag = xmlEl.tagName;
        const createElementArguments = this.#xmlTagToCreateElementArguments(xmlTag);
        const pEl = document.createElement(...createElementArguments);
        this.#copyAttributes(xmlEl, pEl);
        for (const childNode of xmlEl.childNodes)if (childNode.nodeType === 1) pEl.appendChild(this.#convertElement(childNode));
        else pEl.appendChild(childNode.cloneNode());
        if (pEl.hasAttribute("name")) $109b9a5ca7a37440$export$a00e2346eabbdbef(pEl);
        return pEl;
    }
     #convertXML(e) {
        const xml = e.target.response.documentElement;
        document.body.appendChild(this.#convertElement(xml));
        document.querySelectorAll("canvas").forEach((canvas)=>canvas.runCode());
    }
     #copyAttributes(orig, copy) {
        const attrs = orig.attributes;
        for(let i = 0; i < attrs.length; i++){
            const attr = attrs[i];
            copy.setAttribute(attr.name, attr.value);
        }
    }
     #loadXML(path) {
        if (!path) return console.error("p-sketch element is missing required path attribute");
        const request = new XMLHttpRequest();
        request.open("GET", path);
        request.responseType = "document";
        request.overrideMimeType("text/xml");
        request.addEventListener("load", this.#convertXML.bind(this));
        request.send();
    }
     #xmlTagToCreateElementArguments(xmlTag1) {
        if (xmlTag1.slice(0, 2) === "p-") return [
            xmlTag1
        ];
        if (xmlTag1 === "canvas") return [
            xmlTag1,
            {
                is: "p-canvas"
            }
        ];
        if (xmlTag1 === "canvas-3d") return [
            "canvas",
            {
                is: "p-canvas-3d"
            }
        ];
        return [
            "p-" + xmlTag1
        ];
    }
}
customElements.define("p-sketch", $109b9a5ca7a37440$var$Sketch, {
    extends: "link"
});
class $109b9a5ca7a37440$var$Asset extends HTMLElement {
    static elementName = "p-asset";
    constructor(){
        super();
    }
    static loadFns = {
        image: "loadImage",
        font: "loadFont",
        json: "loadJSON",
        strings: "loadStrings",
        table: "loadTable",
        xml: "loadXML",
        bytes: "loadBytes",
        get: "httpGet",
        shader: "loadShader"
    };
    async load(pInst) {
        if (this.data) return this.data;
        const loadFn = $109b9a5ca7a37440$var$Asset.loadFns[this.getAttribute("type").toLowerCase()];
        const path = this.getAttribute("path");
        this.data = await pInst[loadFn](path);
        return this.data;
    }
}
customElements.define("p-asset", $109b9a5ca7a37440$var$Asset);


const $bd52bf81ac7b5a81$export$9f9bf41e917f10e = (baseClass)=>class extends baseClass {
        #angle_mode = p5.RADIANS;
        #perlin_octaves = 4;
        #perlin_amp_falloff = 0.5;
        #noise_seed;
        #random_seed;
        get angle_mode() {
            return this.#angle_mode;
        }
        set angle_mode(mode) {
            this.pInst.angleMode(mode);
            this.#angle_mode = this.pInst._angleMode;
        }
        /**
     * math provides access to the built-in Math object available on browsers.
     * The reference for the Math object is available at
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math.
     */ get math() {
            return Math;
        }
        /**
     * Adjusts the character and level of detail produced by the Perlin noise
     * method. This must be set to a comma-separated list of 2 numbers:
     * 1. lod: number of octaves to be used by the noise
     * 2. falloff:  falloff factor for each octave
     *
     * Similar to harmonics in physics, noise is computed over
     * several octaves. Lower octaves contribute more to the output signal and
     * as such define the overall intensity of the noise, whereas higher octaves
     * create finer-grained details in the noise sequence.
     *
     * By default, noise is computed over 4 octaves with each octave contributing
     * exactly half as much as its predecessor, starting at 50% strength for the 1st
     * octave. This falloff amount can be changed by adding an additional function
     * parameter. Eg. a falloff factor of 0.75 means each octave will now have
     * 75% impact (25% less) of the previous lower octave. Any value between
     * 0.0 and 1.0 is valid, however, note that values greater than 0.5 might
     * result in greater than 1.0 values returned by noise().
     *
     * By changing these values, the signal created by the noise()
     * method can be adapted to fit very specific needs and characteristics.
     * @type {[number, number]}
     */ get noise_detail() {
            return [
                this.#perlin_octaves,
                this.#perlin_amp_falloff
            ];
        }
        set noise_detail(val) {
            this.pInst.noiseDetail(...val);
        }
        /**
     * Sets the seed value for noise(). By default,
     * noise() produces different results each time
     * the program is run. Set the `seed` value to a constant to return
     * the same pseudo-random numbers each time the software is run.
     * If a seed has not been set, noise_seed will be undefined.
     * @type {number}
     */ get noise_seed() {
            return this.#noise_seed;
        }
        set noise_seed(val) {
            this.pInst.noiseSeed(val);
        }
        /**
     * Sets the seed value for random().
     *
     * By default, random() produces different results each time the program
     * is run. Set random_seed to a constant to return the same
     * pseudo-random numbers each time the software is run. If a seed has not
     * been set, random_seed will be undefined.
     * @type {number}
     */ get random_seed() {
            return this.#random_seed;
        }
        set random_seed(val) {
            this.pInst.randomSeed(val);
            this.#random_seed = val;
        }
    };


const $9b76c1f65c019db4$export$ee3de0a7dd131a91 = (baseClass)=>class extends baseClass {
        /**
     * Creates a new <a href="#/p5.Vector">p5.Vector</a> (the datatype for storing vectors). This provides a
     * two or three-dimensional vector, specifically a Euclidean (also known as
     * geometric) vector. A vector is an entity that has both magnitude and
     * direction.
     * @param {Number} [x] x component of the vector
     * @param {Number} [y] y component of the vector
     * @param {Number} [z] z component of the vector
     * @return {p5.Vector}
     */ vector() {
            return this.pInst.createVector(...arguments);
        }
    };


const $78e88c2be3b82581$export$a58b47d028f9234f = (baseClass)=>class extends baseClass {
        /**
     * The mouse object contains infromation about the current position
     * and movement of the mouse:
     * - mouse.x - x-coordinate relative to upper left of canvas
     * - mouse.y - y-coordinate relative to upper left of canvas
     * - mouse.previous.x - x-coordinate in previous frame
     * - mouse.previous.y - y-coordinate in previous frame
     * - mouse.window.x - x-coordinate relative to upper left of window
     * - mouse.window.y - y-coordinate relative to upper left of window
     * - mouse.window.previous.x - window x-coordinate in previous frame
     * - mouse.window.previous.y - window y-coordinate in previous frame
     * - mouse.moved.x - horizontal movement of the mouse since last frame
     * - mouse.moved.y - vertical movement of the mouse since last frame
     * - mouse.pressed - boolean that is true while the mouse button is held down
     * - mouse.dragging - boolean that true while the mouse is pressed and moving
     * - mouse.button - which mouse button is currently pressed: LEFT, RIGHT, CENTER,
     *    or 0 for none.
     *
     * @type {Object}
     */ get mouse() {
            const { pInst: pInst  } = this;
            return {
                x: pInst.mouseX,
                y: pInst.mouseY,
                previous: {
                    x: pInst.pmouseX,
                    y: pInst.pmouseY
                },
                window: {
                    x: pInst.winMouseX,
                    y: pInst.winMouseY,
                    previous: {
                        x: pInst.pwinMouseX,
                        y: pInst.pwinMouseY
                    }
                },
                moved: {
                    x: pInst.movedX,
                    y: pInst.movedY
                },
                pressed: pInst.mouseIsPressed,
                button: pInst.mouseButton,
                dragging: pInst.mouseIsPressed && (pInst.movedX !== 0 || pInst.movedY !== 0)
            };
        }
        get acceleration() {
            const { pInst: pInst  } = this;
            return {
                x: pInst.accelerationX,
                y: pInst.accelerationY,
                z: pInst.accelerationZ,
                previous: {
                    x: pInst.pAccelerationX,
                    y: pInst.pAccelerationY,
                    z: pInst.pAccelerationZ
                }
            };
        }
        get device_rotation() {
            const { pInst: pInst  } = this;
            return {
                x: pInst.rotationX,
                y: pInst.rotationY,
                z: pInst.rotationZ,
                previous: {
                    x: pInst.pRotationX,
                    y: pInst.pRotationY,
                    z: pInst.pRotationZ
                }
            };
        }
    };



const $2097739565d80955$var$addAnchor = (baseClass)=>class extends baseClass {
        #anchor = new p5.Vector();
        /**
     * This element and its children are positioned and transformed relative to
     * the anchor position.
     *
     * Setting anchor to one or more comma-separated numbers will result in the
     * values being passed into create_vector and anchor being set to the
     * resulting vector.
     * @type {p5.Vector}
     */ get anchor() {
            return this.#anchor;
        }
        set anchor(val) {
            const { pInst: pInst  } = this;
            if (val instanceof p5.Vector) this.#anchor = val;
            else if (Array.isArray(val)) this.#anchor = pInst.createVector(...val);
            else if (typeof val === "object") {
                const x = val.x || 0;
                const y = val.y || 0;
                const z = val.z || 0;
                this.#anchor = pInst.createVector(x, y, z);
            } else this.#anchor = pInst.createVector(val);
        }
    };
const $2097739565d80955$var$add2DAngle = (baseClass)=>class extends baseClass {
        #angle = 0;
        /**
     * The angle of rotation for the element and its children. The unit for
     * angles may be set with angle_mode.
     * @type {number}
     */ get angle() {
            return this.#angle;
        }
        set angle(val) {
            this.#angle = val;
        }
    };
const $2097739565d80955$var$addScale = (baseClass)=>class extends baseClass {
        #scale = new p5.Vector(1, 1, 1);
        /**
     * Increases or decreases the size of an element by expanding or contracting
     * vertices. Objects always scale from their anchor point. Scale values are
     * specified as decimal percentages.
     * For example, the setting scale="2.0" increases the dimension of a
     * shape by 200%.
     *
     * Transformations apply to this element and its children. Children's
     * scale will multiply the effect. For example, setting scale="2.0"
     * and then setting scale="1.5" on the child will cause the child to be 3x
     * its size.
     *
     * Setting this to a comma-separated list of numbers will result in those
     * values being passed into create_vector and the resulting vector being set
     * as the scale. Setting this to a single number will set the scale vector
     * to that value in the x, y, and z direction.
     *  @type {p5.Vector}
     */ get scale() {
            return this.#scale;
        }
        set scale(val) {
            if (val instanceof p5.Vector) this.#scale = val;
            else if (Array.isArray(val)) this.#scale = new p5.Vector(...val);
            else this.#scale = new p5.Vector(val, val, val);
        }
    };
const $2097739565d80955$var$addShear = (baseClass)=>class extends baseClass {
        #shear_x = 0;
        #shear_y = 0;
        get shear_x() {
            return this.#shear_x;
        }
        set shear_x(val) {
            this.#shear_x = val;
        }
        get shear_y() {
            return this.#shear_y;
        }
        set shear_y(val) {
            this.#shear_y = val;
        }
    };
const $2097739565d80955$var$addMatrixProps = (baseClass)=>class extends baseClass {
        #apply_matrix = new DOMMatrix();
        #reset_transform = false;
        /**
     * Multiplies the current matrix by the one specified through the values.
     * This is a powerful operation that can perform the equivalent of translate,
     * scale, shear and rotate all at once. You can learn more about transformation
     * matrices on <a href="https://en.wikipedia.org/wiki/Transformation_matrix">
     * Wikipedia</a>.
     *
     * If set to a comma-separated list of numbers, these number will first be
     * passed into the
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix">
     * DOMMatrix</a> constructor.
     * @type {DOMMatrix}
     */ get apply_transform() {
            return this.#apply_matrix;
        }
        set apply_transform(val) {
            if (val instanceof DOMMatrix) this.#apply_matrix = val;
            else this.#apply_matrix = new DOMMatrix(val);
        }
        /**
     * If set to true, this resets the transformations applied to this element,
     * its children, and the siblings below this element. This overrides
     * transformation properties such as anchor, angle, scale, and shear.
     */ get reset_transform() {
            return this.#reset_transform;
        }
        set reset_transform(val) {
            this.#reset_transform = val;
        }
    };
const $2097739565d80955$export$cd9f7ba93ec6c49f = (baseClass)=>class extends $2097739565d80955$var$addAnchor($2097739565d80955$var$add2DAngle($2097739565d80955$var$addScale($2097739565d80955$var$addShear($2097739565d80955$var$addMatrixProps(baseClass))))) {
    };
const $2097739565d80955$var$add3DAngle = (baseClass)=>class extends baseClass {
        #angle_x = 0;
        #angle_y = 0;
        #angle_z = 0;
        /**
     * The angle of rotation along the x-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */ get angle_x() {
            return this.#angle_x;
        }
        set angle_x(val) {
            this.#angle_x = val;
        }
        /**
     * The angle of rotation along the y-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */ get angle_y() {
            return this.#angle_y;
        }
        set angle_y(val) {
            this.#angle_y = val;
        }
        /**
     * The angle of rotation along the z-axis for the element and its children.
     * The unit for angles may be set with angle_mode.
     * @type {number}
     */ get angle_z() {
            return this.#angle_z;
        }
        set angle_z(val) {
            this.#angle_z = val;
        }
    };
const $2097739565d80955$export$7d759072b2be4e22 = (baseClass)=>class extends $2097739565d80955$var$addAnchor($2097739565d80955$var$add3DAngle($2097739565d80955$var$addScale($2097739565d80955$var$addShear(baseClass)))) {
    };


const $3a08fcf437e8d724$var$addPositionConverters = (baseClass)=>class extends baseClass {
        /**
     * Converts a position on the canvas to a position in
     * this element's transformed space.
     * @param {p5.Vector} canvas_position
     * @returns {p5.Vector} local_position
     */ canvas_to_local_position(x = 0, y = 0, z = 0) {
            if (arguments[0] instanceof p5.Vector) {
                const { x: vx , y: vy , z: vz  } = arguments[0];
                x = vx;
                y = vy;
                z = vz;
            }
            const canvas_position = new DOMPoint(x, y, z);
            const inverted_matrix = this.transform_matrix.inverse();
            const scaled_matrix = inverted_matrix.scale(1 / this.pInst.pixelDensity());
            const canvas_point = scaled_matrix.transformPoint(canvas_position);
            return this.pInst.createVector(canvas_point.x, canvas_point.y, canvas_point.z);
        }
        /**
     * Converts a position in this element's transformed space to a
     * position on the canvas.
     * @param {p5.Vector} local_position
     * @returns {p5.Vector} canvas_position
     */ local_to_canvas_position(x = 0, y = 0, z = 0) {
            if (arguments[0] instanceof p5.Vector) {
                const { x: vx , y: vy , z: vz  } = arguments[0];
                x = vx;
                y = vy;
                z = vz;
            }
            const local_position = new DOMPoint(x, y, z);
            const scaled_matrix = this.transform_matrix.scale(1 / this.pInst.pixelDensity());
            const local_point = scaled_matrix.transformPoint(local_position);
            return this.pInst.createVector(local_point.x, local_point.y, local_point.z);
        }
    };
const $3a08fcf437e8d724$export$c0049cef078ecb01 = (baseClass)=>class extends $3a08fcf437e8d724$var$addPositionConverters(baseClass) {
        #transform_matrix = new DOMMatrix();
        /**
     * transform_matrix stores the result of all the transformation
     * properties applied to this element. (read-only)
     * @type {DOMMatrix}
     * @readonly
     */ get transform_matrix() {
            return this.#transform_matrix;
        }
        /**
     * @private
     */ transform() {
            if (this.reset_transform) this.pInst.resetMatrix();
            else {
                const shear_x_rads = this.pInst._toRadians(this.shear_x);
                const shear_y_rads = this.pInst._toRadians(this.shear_y);
                const shear_x_matrix = new DOMMatrix([
                    1,
                    0,
                    Math.tan(shear_x_rads),
                    1,
                    0,
                    0, 
                ]);
                const shear_y_matrix = new DOMMatrix([
                    1,
                    Math.tan(shear_y_rads),
                    0,
                    1,
                    0,
                    0, 
                ]);
                const transform_matrix = new DOMMatrix().translate(this.anchor.x, this.anchor.y).scale(this.scale.x, this.scale.y).rotate(this.angle).multiply(shear_x_matrix).multiply(shear_y_matrix).multiply(this.apply_transform);
                const { a: a , b: b , c: c , d: d , e: e , f: f  } = transform_matrix;
                this.pInst.drawingContext.transform(a, b, c, d, e, f);
            }
            this.#transform_matrix = this.pInst.drawingContext.getTransform();
        }
    };
const $3a08fcf437e8d724$export$bc17fd552ac7bdac = (baseClass)=>class extends $3a08fcf437e8d724$var$addPositionConverters(baseClass) {
        transform() {
            this.pInst.translate(this.anchor.x, this.anchor.y, this.anchor.z);
            this.pInst.scale(this.scale.x, this.scale.y, this.scale.z);
            this.pInst.rotateX(this.angle_x);
            this.pInst.rotateY(this.angle_y);
            this.pInst.rotateZ(this.angle_z);
            this.pInst.shearX(this.shear_x);
            this.pInst.shearY(this.shear_y);
        }
    };


(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_createFriendlyGlobalFunctionBinder", (base)=>function(options = {}) {
        return (prop, value)=>{
            const descriptor = Object.getOwnPropertyDescriptor(p5.prototype, prop);
            const globalObject = options.globalObject || window;
            if (typeof descriptor === "undefined" || descriptor.writable) return base.call(this, options)(prop, value);
            return Object.defineProperty(globalObject, prop, descriptor);
        };
    });
p5.prototype.assignCanvas = function(c, r) {
    this.noCanvas();
    const mainDiv = document.querySelector("main");
    let index = 0;
    if (typeof c.id === "undefined") while(document.querySelector(`p5MarkerCanvas${index}`))index++;
    c.id = `p5MarkerCanvas${index}`;
    if (mainDiv.children.length === 0) mainDiv.remove();
    if (r === this.WEBGL) this._setProperty("_renderer", new p5.RendererGL(c, this, true));
    else //P2D mode
    this._setProperty("_renderer", new p5.Renderer2D(c, this, true));
    this._renderer._applyDefaults();
    this._setProperty("_elements", [
        this._renderer
    ]);
};
p5.prototype.assets = {};
p5.prototype.loadAssets = async function() {
    const assetElements = Array.from(document.querySelectorAll("p-asset"));
    const pInst = this;
    const promises = assetElements.map((el)=>el.load(pInst));
    const results = await Promise.all(promises);
    results.forEach((result, i)=>this.assets[assetElements[i].getAttribute("name")] = result);
    this._decrementPreload();
};
p5.prototype.registerPreloadMethod("loadAssets", p5.prototype);
p5.prototype._debug_attributes = true;
p5.prototype.create_canvas_element = function(elementName) {
    const createdElement = document.createElement(elementName);
    this.canvas.appendChild(createdElement);
    createdElement.setup(this, this.canvas);
    return createdElement.this_element;
};
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    object_assign: {
        set: function([target, ...sources]) {
            Object.assign(target, ...sources);
        }
    },
    debug_attributes: {
        get: function() {
            return this._debug_attributes;
        },
        set: function(val) {
            const valType = typeof val;
            if (typeof val === "boolean") this._debug_attributes = val;
            else console.error(`debug_attributes was set to a value of type ${valType} but may only be set to a boolean true/false value.`);
        }
    }
});
const $79ce0e365a23b6d5$var$attributePriorities = [
    "debug_attributes",
    "_default",
    "repeat",
    "change", 
];
const $79ce0e365a23b6d5$export$a11dc51f2ecd743e = (baseClass)=>class P5Extension extends (0, $dfaf816c8f7968eb$export$df7182d31779a5d2)((0, $03bbbf8eda9a336e$export$f5ddaad6515de8cc)((0, $78e88c2be3b82581$export$a58b47d028f9234f)((0, $16ac526ed636526d$export$b46a7ea7c25c5e6d)((0, $9b76c1f65c019db4$export$ee3de0a7dd131a91)((0, $bd52bf81ac7b5a81$export$9f9bf41e917f10e)((0, $74cf9122b1ef1f14$export$89e97ff02600e0c0)((0, $36d0bcbd88d70227$export$480a8cd27449d6bd)(baseClass)))))))) {
        /**
     * This element's parent canvas.
     * @private
     */ #canvas;
        #frame_created;
        /**
     * @private
     */ #pInst;
        /**
     * @private
     */ #proxy = new Proxy(this, {
            get (target, prop) {
                return target[prop];
            },
            has (target, prop) {
                return prop in target;
            },
            set (target, prop, val) {
                return target.set(prop, val);
            }
        });
        /**
     * @private
     */ #state = {};
        /**
     * @private
     */ #updateFunctions = new Map();
        #name;
        #on = true;
        #repeat = false;
        #change = {};
        constructor(){
            super();
            if (this.hasAttribute("name")) (0, $109b9a5ca7a37440$export$a00e2346eabbdbef)(this);
        }
        /**
     * The on property determines whether this element and its children
     * are updated and rendered.
     */ get on() {
            return this.#on;
        }
        set on(val) {
            this.#on = val;
        }
        /**
     * Proxy for the sibling element above this element with access to its
     * properties, methods, and attributes.
     * @type {proxy}
     */ get above_sibling() {
            return this.previousElementSibling.this_element;
        }
        /**
     * True if siblings directly above this element with an "on" attribute have
     * "on" set to false. This can be used to switch between elements based on
     * conditions, similar to if/else.
     * @type {boolean}
     */ get above_siblings_off() {
            if (this === this.parentElement.firstElementChild) return true;
            const { above_sibling: above_sibling  } = this;
            if (above_sibling.on) return false;
            return above_sibling.above_siblings_off;
        }
        /**
     * @method applyChange
     * @private
     */  #applyChange() {
            const { change: change  } = this;
            let changed = false;
            const assignProp = (obj, prop)=>{
                if (prop in obj) {
                    const changeVal = change[prop];
                    changed ||= obj[prop] !== changeVal;
                    obj[prop] = changeVal;
                    if (this.pInst.debug_attributes) this.setAttribute(prop, changeVal);
                    return true;
                }
                return false;
            };
            for(const prop in change){
                assignProp(this, prop) || assignProp(this.#state, prop) || assignProp(this.pInst, prop) || console.error(`${this.constructor.elementName}'s change attribute has a prop called ${prop} that is unknown`);
                this.#state[prop] = change[prop];
            }
            return changed;
        }
        /**
     * Checks if the provided attribute name belongs to a parent element. If
     * the attribute refers to an object property, this will check for an
     * attribute with a name that matches the object.
     * @param {string} attributeName - name of the attribute to check
     * @returns {boolean} true
     */ attributeInherited(attributeName) {
            const [obj, ...props] = attributeName.split(".");
            if (props.length) return this.attributeInherited(obj);
            if (this.parentElement.hasAttribute(attributeName)) return true;
            if (this.parentElement.attributeInherited) return this.parentElement.attributeInherited(attributeName);
            return false;
        }
        /**
     * Blends the pixels in the display window according to the defined mode.
     * There is a choice of the following modes to blend the source pixels (A)
     * with the ones of pixels already in the display window (B):
     * <ul>
     * <li><code>BLEND</code> - linear interpolation of colours: C =
     * A*factor + B. <b>This is the default blending mode.</b></li>
     * <li><code>ADD</code> - sum of A and B</li>
     * <li><code>DARKEST</code> - only the darkest colour succeeds: C =
     * min(A*factor, B).</li>
     * <li><code>LIGHTEST</code> - only the lightest colour succeeds: C =
     * max(A*factor, B).</li>
     * <li><code>DIFFERENCE</code> - subtract colors from underlying image.
     * <em>(2D)</em></li>
     * <li><code>EXCLUSION</code> - similar to <code>DIFFERENCE</code>, but less
     * extreme.</li>
     * <li><code>MULTIPLY</code> - multiply the colors, result will always be
     * darker.</li>
     * <li><code>SCREEN</code> - opposite multiply, uses inverse values of the
     * colors.</li>
     * <li><code>REPLACE</code> - the pixels entirely replace the others and
     * don't utilize alpha (transparency) values.</li>
     * <li><code>REMOVE</code> - removes pixels from B with the alpha strength of A.</li>
     * <li><code>OVERLAY</code> - mix of <code>MULTIPLY</code> and <code>SCREEN
     * </code>. Multiplies dark values, and screens light values. <em>(2D)</em></li>
     * <li><code>HARD_LIGHT</code> - <code>SCREEN</code> when greater than 50%
     * gray, <code>MULTIPLY</code> when lower. <em>(2D)</em></li>
     * <li><code>SOFT_LIGHT</code> - mix of <code>DARKEST</code> and
     * <code>LIGHTEST</code>. Works like <code>OVERLAY</code>, but not as harsh. <em>(2D)</em>
     * </li>
     * <li><code>DODGE</code> - lightens light tones and increases contrast,
     * ignores darks. <em>(2D)</em></li>
     * <li><code>BURN</code> - darker areas are applied, increasing contrast,
     * ignores lights. <em>(2D)</em></li>
     * <li><code>SUBTRACT</code> - remainder of A and B <em>(3D)</em></li>
     * </ul>
     *
     * <em>(2D)</em> indicates that this blend mode <b>only</b> works in the 2D renderer.<br>
     * <em>(3D)</em> indicates that this blend mode <b>only</b> works in the WEBGL renderer.
     * @type {BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|
     * REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT}
     */ get blend_mode() {
            if (this.pInst._renderer.isP3D) return this.curBlendMode;
            return this.pInst.drawingContext.globalCompositeOperation;
        }
        set blend_mode(val) {
            this.pInst.blendMode(val);
        }
        /**
     * @private
     */  #callAttributeUpdater(attrName) {
            if (this.#updateFunctions.has(attrName)) {
                const updateFn = this.#updateFunctions.get(attrName);
                return updateFn.call(this);
            }
            if (attrName in this.pInst) return this.pInst[attrName];
            return;
        }
        /**
     * The parent canvas for this element
     * @type {HTMLCanvasElement}
     */ get canvas() {
            return this.#canvas.this_element;
        }
        get change() {
            return this.#change;
        }
        set change(obj) {
            this.#change = obj;
        }
        /**
     * color_mode changes the way p5.js interprets
     * color data. By default, fill,
     * <a href="https://p5js.org/reference/#/p5/color">color()</a> are defined
     * by values between 0 and 255 using the RGB color model. This is equivalent
     * to setting color_mode="RGB, 255".
     * Setting color_mode="HSB" lets you use the HSB system instead. By default,
     * this is color_mode="HSB, 360, 100, 100, 1". You can also use HSL.
     *
     * Note: existing color objects remember the mode that they were created in,
     * so you can change modes as you like without affecting their appearance.
     *
     * @type {RGB|HSB|HSL}
     */ get color_mode() {
            return this.pInst._colorMode;
        }
        set color_mode(val) {
            this.pInst.colorMode(val);
        }
        /**
     * @private
     */ get #comments() {
            return this.#html.split(/(?:\r\n|\r|\n)/).map((line)=>line.match(/.{1,80}/g)).flat().map((line)=>"//	" + line);
        }
        /**
     * The text content of the element and its children. If a $ is followed by
     * the name of a property (such as $blend_mode), it will be replaced by the
     * value of the property.
     */ get content() {
            const getInherited = (owner, prop)=>{
                if (prop in owner) return owner[prop];
                if (owner.parentElement) return getInherited(owner.parentElement, prop);
                return `$${prop}`;
            };
            const textNodes = Array.from(this.childNodes).filter(({ nodeType: nodeType  })=>nodeType === 3);
            const text = textNodes.map(({ nodeValue: nodeValue  })=>nodeValue).join("").replace(/\$(\w*)/g, (_, prop)=>getInherited(this, prop)).replace(/\\n/g, "\n").trim();
            return text;
        }
        set content(s) {
            if (this.content === s) return;
            for (const node of this.childNodes)if (node.nodeType === 3) this.removeChild(node);
            this.insertBefore(document.createTextNode(s), this.firstChild);
        }
        /**
     * Updates the element's attribute values, renders it to the canvas, and
     * calls the draw method on its children.
     * @method draw
     * @param {object} inherited - object containing attribute values passed
     * down from parent element
     */ draw() {
            if (this.hasAttribute("on")) {
                this.#updateAttribute("on");
                if (!this.on) return;
            }
            this.pInst.push();
            this.updateState();
            const { content: description  } = this;
            if (description.length) {
                if (this instanceof HTMLCanvasElement) this.pInst.describe(description);
                else this.pInst.describeElement(this.name, description);
            }
            let repeat = true;
            while(repeat){
                this.transform?.();
                this.render?.();
                for (const child of this.children)child.draw?.(this.#state);
                repeat = this.repeat;
                const { change: change  } = this;
                if (repeat) {
                    this.pInst.pop();
                    this.pInst.push();
                    const changed = this.#applyChange();
                    const updaters = this.#updateFunctions.entries();
                    for (const [attrName, updater] of updaters)if (attrName in change === false) this.#state[attrName] = this.#updateAttribute(attrName);
                    if (!changed) repeat = false;
                }
                this.endRender?.();
            }
            this.pInst.pop();
        }
        /**
     * The p5.js API provides a lot of functionality for creating graphics, but
     * there is some native HTML5 Canvas functionality that is not exposed by
     * p5.
     *
     * You can still assign to
     * it directly using the property `drawing_context`. This is
     * the equivalent of calling `canvas.getContext('2d');` or
     * `canvas.getContext('webgl');` and then calling Object.assign on the
     * result.
     * See this
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">
     * reference for the native canvas API</a> for possible drawing functions
     * you can call.
     *
     * ```xml
     * <_ drawing_context="shadowOffsetX: 5, shadowOffsetY: -5, shadowBlur: 10,
     * shadowColor: 'black'" />
     * ```
     * @type {Object}
     */ get drawing_context() {
            return this.pInst.drawingContext;
        }
        set drawing_context(obj) {
            Object.assign(this.pInst.drawingContext, obj);
        }
        /**
     * Name of the HTML element generated from this class.
     * @type {string}
     */ static get elementName() {
            return `p-${(0, $7a53813bc2528edd$export$b797531657428303)(this.name)}`;
        }
        /**
     * With erase="true", this element and all elements rendered after it will
     * subtract from the canvas. Erased areas will reveal the web page
     * underneath the canvas. This may be canceled with erase="false"
     *
     * Arguments for the optional parameters to
     * <a href="https://p5js.org/reference/#/p5/erase">erase()</a>
     * may also be provided as a comma separated list.
     *
     * ```<p-image>``` elements will not erase the canvas but works as usual.
     * @type {boolean}
     */ get erase() {
            return this.pInst._renderer._isErasing;
        }
        set erase(val) {
            if (val === true) this.pInst.erase();
            else if (val === false) this.pInst.noErase();
            else if (Array.isArray(val)) this.pInst.erase(...val);
            else console.error(`${this.tagName}'s erase property was set using type ${typeof val}, but erase may only be set to a boolean or array.`);
        }
        /**
     * first_frame is true if the element was just created.
     * This can be used for setup. For example,
     * ```xml
     * <_ rand_ball="this_element">
     *  <_ on="first_frame"
     *     rand_ball.x="random(canvas.width)"
     *     rand_ball.y="random(canvas.height)"></_>
     *   <circle></circle>
     * </_>
     * ```
     * Sets the ```<_>```'s x-coordinate to a random position along the
     * canvas when it is first created. The value then stays the same.
     * As a result, the circle is played at that random position.
     * (read-only)
     * @type {boolean}
     */ get first_frame() {
            return this.frame_count === 1;
        }
        /**
     * frame_count counts the number of frames this element has been
     * rendered. The first time this element is rendered, frame_count
     * with be 1. (read-only)
     * @type {number}
     */ get frame_count() {
            return this.pInst.frameCount - this.#frame_created;
        }
        /**
     * @private
     */ get #html() {
            return this.outerHTML.replace(this.innerHTML, "");
        }
        get name() {
            if (this.#name) return this.#name;
            const elementName = this.tagName.slice(2).toLowerCase();
            const otherDescribedElementsWithThisName = Array.from(document.querySelectorAll(this.tagName)).filter((el)=>el !== this && el.content.length);
            if (otherDescribedElementsWithThisName.length) this.#name = `${elementName} ${otherDescribedElementsWithThisName.length}`;
            else this.#name = elementName;
            return this.#name;
        }
        set name(val) {
            this.#name = val;
        }
        /**
     * List of attribute names in the order in which they will be evaluated.
     * Element attributes are not guaranteed to be in the order in which they
     * are written. Transformation attributes are prioritized before others
     * and use this order: anchor, angle, scale_factor, shear.
     * @type {Array}
     */ get orderedAttributeNames() {
            const ordered = Array.from(this.attributes).sort(({ name: a  }, { name: b  })=>($79ce0e365a23b6d5$var$attributePriorities.indexOf(a) + 1 || $79ce0e365a23b6d5$var$attributePriorities.indexOf("_default")) - ($79ce0e365a23b6d5$var$attributePriorities.indexOf(b) + 1 || $79ce0e365a23b6d5$var$attributePriorities.indexOf("_default"))).map(({ name: name  })=>name);
            return ordered;
        }
        /**
     * Proxy for this element's parent element with access to its properties,
     * methods, and attributes.
     * @type {proxy}
     */ get parent() {
            return this.parentElement.this_element;
        }
        /**
     * This element's p5 instance.
     * @type {object}
     */ get pInst() {
            return this.#pInst;
        }
        render() {}
        get repeat() {
            return this.#repeat;
        }
        set repeat(val) {
            this.#repeat = val;
        }
        /**
     * Sets an attribute's value on this element.
     * @param {string} attributeName
     * @param {*} value
     */ set(attributeName, value) {
            if (attributeName in this) {
                this.#updateFunctions.set(attributeName, ()=>this[attributeName] = value);
                this[attributeName] = value;
                return true;
            } else if (attributeName in this.pInst) {
                this.#updateFunctions.set(attributeName, ()=>this.pInst[attributeName] = value);
                return true;
            }
            console.error(`${this.tagName}'s ${attributeName} is being set to ${value} by another element, but it doesn't have a property by that name.`);
            return false;
        }
        /**
     * Sets this element up with a p5 instance and sets up its children.
     * @param {p5} pInst
     */ setup(pInst, canvas) {
            this.#pInst = pInst;
            this.#frame_created = pInst.frameCount;
            this.#canvas = canvas;
            this.setDefaults?.();
            this.#setupEvalFns();
            this.setupRenderFunction?.();
            for (const child of this.children)child.setup(pInst, canvas);
        }
        /**
     * @private
     */  #setupEvalFn(attr) {
            const getAssignPropRef = (str, obj = this)=>{
                //  If string isn't already an array, split it on '.' characters
                const [beforeDot, ...afterDot] = Array.isArray(str) ? str : str.split(".");
                if (afterDot.length === 0) return [
                    obj,
                    beforeDot
                ];
                return getAssignPropRef(afterDot, obj[beforeDot]);
            };
            const [assignObj, assignPropName] = getAssignPropRef(attr.name);
            const interpretation = (0, $a2ba0be321a8c9b5$export$67beed298888a38b)(this, attr.name, attr.value);
            this.#updateFunctions.set(attr.name, ()=>assignObj[assignPropName] = interpretation());
            if (assignObj === this && attr.name in this === false) {
                this.#state[attr.name] = interpretation();
                Object.defineProperty(this, attr.name, {
                    get: function() {
                        return this.#state[attr.name];
                    },
                    set: function(val) {
                        this.#state[attr.name] = val;
                    }
                });
            }
            try {
                console.log(this.tagName, attr.name, interpretation());
            } catch (err) {
                console.warn(err);
            }
        }
        /**
     * @private
     */  #setupEvalFns() {
            if (this.hasAttribute("repeat") && !this.hasAttribute("change")) {
                console.error(`It looks like a ${this.constructor.elementName} has a repeat attribute ` + "but does not have a change attribute. The change attribute is required to " + "prevent infinite loops.");
                this.removeAttribute("repeat");
            }
            const inheritedAttributes = new Set();
            let obj = this.parent;
            while(obj){
                for (const { name: name  } of obj.attributes)inheritedAttributes.add(name);
                if (obj.parent && obj.parent !== obj) obj = obj.parent;
                else break;
            }
            for (const propName of inheritedAttributes){
                if (this.hasAttribute(propName)) continue;
                if ([
                    "anchor",
                    "scale",
                    "angle",
                    "shear_x",
                    "shear_y"
                ].includes(propName)) continue;
                if (propName in this) this.#updateFunctions.set(propName, ()=>{
                    return this[propName] = this.parent[propName];
                });
                else Object.defineProperty(this, propName, {
                    get: function() {
                        if (typeof this.#state[propName] === "undefined") return this.parent[propName];
                        return this.#state[propName];
                    },
                    set: function(val) {
                        this.#state[propName] = val;
                    }
                });
            }
            const { orderedAttributeNames: orderedAttributeNames  } = this;
            for(let i = 0; i < orderedAttributeNames.length; i++)this.#setupEvalFn(this.attributes[orderedAttributeNames[i]]);
        }
         #customAttributeToProperty(propName1) {
            Object.defineProperty(this, propName1, {
                get: function() {
                    return this.#state[propName1];
                },
                set: function(val) {
                    this.#state[propName1] = val;
                }
            });
        }
        /**
     * This element's proxy with access to properties, methods, and attributes.
     */ get this_element() {
            return this.#proxy;
        }
        /**
     * @private
     * @param {*} inherited
     * @param {*} attrName
     * @param {*} thisArg
     * @returns
     */  #updateAttribute(attrName1) {
            const val = this.#callAttributeUpdater(attrName1);
            //  Setting canvas width or height resets the drawing context
            //  Only set the attribute if it's not one of those
            if (this.pInst.debug_attributes === false) return val;
            if (this instanceof HTMLCanvasElement && (attrName1 === "width" || attrName1 === "height")) return val;
            //  Brackets will throw a 'not a valid attribute name' error
            if (attrName1.match(/[\[\]]/)) return val;
            const valToString = (v)=>{
                if (v instanceof p5.Color) return v.toString(this.pInst.color_mode);
                if (typeof v?.toString === "undefined") return v;
                return v.toString();
            };
            this.setAttribute(attrName1, valToString(val));
            return val;
        }
        /**
     * Updates the values of all attributes using the provided expressions.
     * @param {Object} inherited - object
     * @returns
     */ updateState() {
            const updaters = this.#updateFunctions.entries();
            for (const [attrName, updateFunction] of updaters)this.#updateAttribute(attrName);
            return this.#state;
        }
        /**
     * Set attributes for the WebGL Drawing context.
     * This is a way of adjusting how the WebGL
     * renderer works to fine-tune the display and performance.
     *
     * Note that this will reinitialize the drawing context
     * if set after the WebGL canvas is made.
     *
     * If webgl_attributes is set to an object, all attributes
     * not declared in the object will be set to defaults.
     *
     * The available attributes are:
     * <br>
     * alpha - indicates if the canvas contains an alpha buffer
     * default is false
     *
     * depth - indicates whether the drawing buffer has a depth buffer
     * of at least 16 bits - default is true
     *
     * stencil - indicates whether the drawing buffer has a stencil buffer
     * of at least 8 bits
     *
     * antialias - indicates whether or not to perform anti-aliasing
     * default is false (true in Safari)
     *
     * premultipliedAlpha - indicates that the page compositor will assume
     * the drawing buffer contains colors with pre-multiplied alpha
     * default is false
     *
     * preserveDrawingBuffer - if true the buffers will not be cleared and
     * and will preserve their values until cleared or overwritten by author
     * (note that p5 clears automatically on draw loop)
     * default is true
     *
     * perPixelLighting - if true, per-pixel lighting will be used in the
     * lighting shader otherwise per-vertex lighting is used.
     * default is true.
     *
     * @type {Object}
     */ get webgl_attributes() {
            return this.pInst._glAttributes;
        }
        set webgl_attributes(val) {
            this.pInst.setAttributes(val);
        }
    };
class $79ce0e365a23b6d5$export$82fefa1d40d42487 extends $79ce0e365a23b6d5$export$a11dc51f2ecd743e(HTMLElement) {
}
class $79ce0e365a23b6d5$export$66cca51e2e9c1a33 extends $79ce0e365a23b6d5$export$82fefa1d40d42487 {
    static overloads = [
        ""
    ];
    constructor(){
        super();
        /**
     * @private
     */ this.renderFunctionName ||= (0, $7a53813bc2528edd$export$fd546b5ffd1f6a92)(this.tagName.toLowerCase().slice(2));
    }
    /**
   * Sets the parameters used to call this element's render function based
   * on the overloads for that function and this element's attributes.
   * @private
   */  #getArgumentsFromOverloads() {
        const { overloads: overloads  } = this.constructor;
        //  Check every required parameter has an attribute
        const isOptional = (param)=>param.match(/^\[.*\]$/);
        let overloadMatch = false;
        //  Split the parameters and start with overloads with most parameters
        const overloadsSplitSorted = overloads.map((o)=>o.split(",").map((p)=>p.trim())).sort((a, b)=>a.length - b.length);
        //  If there aren't any overloads, return an empty array
        if (overloadsSplitSorted.length === 0) return [];
        for(let i = 0; i < overloadsSplitSorted.length; i++){
            const overloadParams = overloadsSplitSorted[i].map((param)=>({
                    name: param.replaceAll(/\[|\]/g, ""),
                    optional: isOptional(param)
                }));
            overloadMatch = i === overloadsSplitSorted.length - 1 || overloadParams.every(({ name: name , optional: optional  })=>optional || this.hasAttribute(name) || this.attributeInherited(name) || name === "");
            //  If matched overload found
            if (overloadMatch) {
                const lastParamWithAttribute = overloadParams.findLastIndex(({ name: name , optional: optional  })=>this.hasAttribute(name) || !optional);
                const filteredParams = overloadParams.slice(0, lastParamWithAttribute + 1).map(({ name: name  })=>name);
                return filteredParams;
            }
        }
        console.error(`Element ${this.tagName} does not have the required attributes to render and will be removed from the sketch`);
        this.remove();
    }
    /**
   * @private
   */ setupRenderFunction() {
        const args = this.#getArgumentsFromOverloads();
        this.render = function() {
            this.pInst[this.renderFunctionName](...args.map((param)=>this[param]));
        };
    }
}
/**
 * The blank `<_>` element renders nothing to the canvas. This is useful
 * for adjusting attributes for child elements.
 * @element _
 */ class $79ce0e365a23b6d5$var$_ extends (0, $2097739565d80955$export$cd9f7ba93ec6c49f)((0, $3a08fcf437e8d724$export$c0049cef078ecb01)($79ce0e365a23b6d5$export$82fefa1d40d42487)) {
    constructor(){
        super();
    }
}
customElements.define("p-_", $79ce0e365a23b6d5$var$_);
class $79ce0e365a23b6d5$var$_3D extends (0, $2097739565d80955$export$7d759072b2be4e22)((0, $3a08fcf437e8d724$export$bc17fd552ac7bdac)($79ce0e365a23b6d5$export$82fefa1d40d42487)) {
}
customElements.define("p-_-3d", $79ce0e365a23b6d5$var$_3D);




const $60cbc2b134970376$export$bf2e82bce1545c45 = (baseClass)=>class extends baseClass {
        #background;
        /**
     * The background property sets the color or image used
     * for the background of the p5.js canvas. The default background is transparent.
     * A <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object can be provided to set the background color.
     *
     * A <a href="https://p5js.org/reference/#/p5.Image">p5.Image</a> can also be provided to set the background image.
     *
     * The arguments to <a href="https://p5js.org/reference/#/p5/color">color()</a> can also be provided,
     * separated by commas.
     * @type {p5.Color|p5.Image}
     */ get background() {
            return this.#background;
        }
        set background(c) {
            if (c instanceof p5.Color || c instanceof p5.Image) this.#background = c;
            else if (c === (0, $0c9e79e2e9aa197e$export$1a988e7317c65621).NONE) this.#background = this.pInst.color(0, 0);
            else this.#background = this.pInst.color(c);
        }
        /**
     * Sets the cursor when hovering over the canvas.
     *
     * You can set cursor to any of the following constants:
     * ARROW, CROSS, HAND, MOVE, TEXT and WAIT
     *
     * You may also set cursor to the URL of an image file. The recommended size
     * is 16x16 or 32x32 pixels. (Allowed File extensions: .cur, .gif, .jpg, .jpeg, .png)
     *
     * For more information on Native CSS cursors and url visit:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
     *
     * You may also set cursor to "type, x, y", where type is one of the types above,
     * x is the horizontal active spot of the cursor (must be less than 32)
     * and
     * y is the vertical active spot of the cursor (must be less than 32)
     * @type {string}
     */ get cursor() {
            return this.style.cursor;
        }
        set cursor(val) {
            const { pInst: pInst  } = this;
            if (val === this.NONE) pInst.noCursor();
            else if (Array.isArray(val)) pInst.cursor(...val);
            else pInst.cursor(val);
        }
        /**
     * The height of the canvas in pixels.
     * @type {number}
     */ get height() {
            return this.pInst.height;
        }
        set height(val) {
            if (val === this.height || isNaN(val)) return;
            this.#resize(this.width, val);
        }
        get orderedAttributeNames() {
            //  Remove 'is' and 'style' from attrNames
            return super.orderedAttributeNames.filter((v)=>v !== "is" && v != "style");
        }
        /**
     * Array containing the values for all the pixels in the display window.
     * These values are numbers. This array is the size (include an appropriate
     * factor for pixel_density) of the display window x4,
     * representing the R, G, B, A values in order for each pixel, moving from
     * left to right across each row, then down each column. Retina and other
     * high density displays may have more pixels (by a factor of
     * pixel_density^2).
     * For example, if the image is 100×100 pixels, there will be 40,000. With
     * pixel_density = 2, there will be 160,000. The first four values
     * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
     * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
     * values of the pixel at (1, 0).
     * @type {number[]}
     */ get pixels() {
            this.pInst.loadPixels();
            return this.pInst.pixels;
        }
        set pixels(px) {
            this.pInst.pixels = px;
            this.pInst.updatePixels();
        }
        set loop(val) {
            if (val) this.pInst.loop();
            else this.pInst.noLoop();
        }
         #resize(w, h) {
            if (w === this.width && h === this.height) return;
            const { pInst: pInst  } = this;
            const props = {};
            for(const key in pInst.drawingContext){
                const val = pInst.drawingContext[key];
                if (typeof val !== "object" && typeof val !== "function") props[key] = val;
            }
            pInst.width = pInst._renderer.width = w;
            pInst.height = pInst._renderer.height = h;
            this.setAttribute("width", w * pInst._pixelDensity);
            this.setAttribute("height", h * pInst._pixelDensity);
            this.style.width = `${w}px`;
            this.style.height = `${h}px`;
            for(const savedKey in props)try {
                pInst.drawingContext[savedKey] = props[savedKey];
            } catch (err) {}
            pInst.redraw();
        }
        /**
     * The width of the canvas in pixels.
     * @type {number}
     */ get width() {
            return this.pInst.width;
        }
        set width(val) {
            if (val === this.width || isNaN(val)) return;
            this.#resize(val, this.height);
        }
    };


const $76bd26c91fab8e7c$export$5eb092502585022b = (baseClass)=>class extends baseClass {
        attributeInherited(attributeName) {
            if (this.hasAttribute(attributeName)) return true;
            return super.attributeInherited(attributeName);
        }
        runCode() {
            const canvas = this;
            const sketch = (pInst)=>{
                pInst.preload = ()=>pInst.loadAssets();
                pInst.setup = function() {
                    canvas.setup(pInst, canvas);
                    //  Set default background to light gray
                    canvas.background = pInst.color(220);
                    pInst.assignCanvas(canvas, canvas.constructor.renderer);
                    // Set default dimensions (100, 100)
                    canvas.width = 100;
                    canvas.height = 100;
                };
                pInst.draw = function() {
                    if (canvas.orbit_control) canvas.pInst.orbitControl();
                    canvas.draw();
                };
            };
            new p5(sketch);
        }
        render() {
            this.pInst.background(this.background);
        }
    };



p5.prototype.window_resized = false;
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onresize", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("window_resized", true);
    });
p5.prototype.registerMethod("post", function() {
    this._setProperty("window_resized", false);
});
class $db244738e3d6357d$var$Window {
    #element;
    constructor(element){
        this.#element = element;
    }
    get #pInst() {
        return this.#element.pInst;
    }
    /**
   * window_resized is true if the window was resized since the last frame
   * and false if not (read-only)
   * @type {boolean}
   * @readonly
   */ get resized() {
        return this.#pInst.window_resized;
    }
    get width() {
        return this.#pInst.windowWidth;
    }
    get height() {
        return this.#pInst.windowHeight;
    }
}
const $db244738e3d6357d$export$a9e2f2714159e1ff = (baseClass)=>class extends baseClass {
        get fullscreen() {
            return this.pInst.fullscreen();
        }
        set fullscreen(val) {
            this.pInst.fullscreen(val);
        }
        /**
     * frame_rate specifies the number of frames to be displayed every second.
     * For example,
     * frame_rate="30" will attempt to refresh 30 times a second.
     * If the processor is not fast enough to maintain the specified rate, the
     * frame rate will not be achieved. The default frame rate is
     * based on the frame rate of the display (here also called "refresh rate"),
     * which is set to 60 frames per second on most computers.
     * A frame rate of 24
     * frames per second (usual for movies) or above will be enough for smooth
     * animations.
     *
     * The canvas must be rendered at least once for frame_rate to have a
     * value.
     * @type {number}
     */ get frame_rate() {
            return this.pInst._frameRate;
        }
        set frame_rate(val) {
            this.pInst.frameRate(val);
        }
        /**
     * pixel_density specifies the pixel scaling for high pixel density displays.
     * By default pixel density is set to match display density, set pixel_density="1"
     * to turn this off.
     * @type {number}
     */ get pixel_density() {
            return this.pInst.pixelDensity();
        }
        set pixel_density(val) {
            this.pInst.pixelDensity(val);
        }
        /**
     * The pixel density of the current display the sketch is running on. (read-only)
     * @type {number}
     * @readonly
     */ get display_density() {
            return this.pInst.displayDensity();
        }
        /**
     * The delta_time property contains the time
     * difference between the beginning of the previous frame and the beginning
     * of the current frame in milliseconds.
     *
     * This variable is useful for creating time sensitive animation or physics
     * calculation that should stay constant regardless of frame rate.
     * (read-only)
     * @readonly
     * @type {number}
     */ get delta_time() {
            return this.pInst.deltaTime;
        }
        /**
     * screen stores information about the screen displaying the canvas.
     * To get the dimensions of the screen, use:
     * ```
     * screen.width
     * screen.height
     * ```
     * screen is available in any browser and is not specific to this
     * library.
     * The full documentation is here:
     * https://developer.mozilla.org/en-US/docs/Web/API/Screen
     * (read-only)
     * @readonly
     */ get screen() {
            return screen;
        }
        /**
     * The window object provides information about the window containing the
     * canvas.
     * - window.width   - number: width of the window
     * - window.height  - number: height of the window
     * - window.resized - boolean: true if the window was resized since last
     * frame
     * @type {Object}
     */ get window() {
            return this.#window;
        }
        #window = new $db244738e3d6357d$var$Window(this);
        /**
     * grid_output lays out the
     * content of the canvas in the form of a grid (html table) based
     * on the spatial location of each shape. A brief
     * description of the canvas is available before the table output.
     * This description includes: color of the background, size of the canvas,
     * number of objects, and object types (example: "lavender blue canvas is
     * 200 by 200 and contains 4 objects - 3 ellipses 1 rectangle"). The grid
     * describes the content spatially, each element is placed on a cell of the
     * table depending on its position. Within each cell an element the color
     * and type of shape of that element are available (example: "orange ellipse").
     * These descriptions can be selected individually to get more details.
     * A list of elements where shape, color, location, and area are described
     * (example: "orange ellipse location=top left area=1%") is also available.
     *
     * grid_output="true" and grid_output="FALLBACK"
     * make the output available in
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
     * a sub DOM inside the canvas element</a> which is accessible to screen readers.
     * grid_output="LABEL" creates an
     * additional div with the output adjacent to the canvas, this is useful
     * for non-screen reader users that might want to display the output outside
     * of the canvas' sub DOM as they code. However, using LABEL will create
     * unnecessary redundancy for screen reader users. We recommend using LABEL
     * only as part of the development process of a sketch and removing it before
     * publishing or sharing with screen reader users.
     * @type {true|LABEL|FALLBACK}
     */ get grid_output() {
            return this._accessibleOutputs.grid;
        }
        set grid_output(val) {
            if (val === true) this.pInst.gridOutput();
            else this.pInst.gridOutput(val);
        }
    };




/**
 * The `<canvas>` element is a rectangular area of the window for rendering
 * imagery. All child elements are rendered to the canvas.
 *
 * This canvas will render 2D elements only. For a 3D canvas, use
 * ```<canvas-3d>```.
 */ class $a7d17c9282527449$var$Canvas extends (0, $76bd26c91fab8e7c$export$5eb092502585022b)((0, $60cbc2b134970376$export$bf2e82bce1545c45)((0, $79ce0e365a23b6d5$export$a11dc51f2ecd743e)((0, $db244738e3d6357d$export$a9e2f2714159e1ff)((0, $2097739565d80955$export$cd9f7ba93ec6c49f)((0, $3a08fcf437e8d724$export$c0049cef078ecb01)(HTMLCanvasElement)))))) {
    static renderer = "p2d";
    constructor(){
        super();
        window.addEventListener("customElementsDefined", this.runCode.bind(this));
    }
}
customElements.define("p-canvas", $a7d17c9282527449$var$Canvas, {
    extends: "canvas"
});
/**
 * The ```<canvas-3d>``` element is a ```<canvas>``` element
 * for rendering 3D elements.
 */ class $a7d17c9282527449$var$WebGLCanvas extends (0, $76bd26c91fab8e7c$export$5eb092502585022b)((0, $60cbc2b134970376$export$bf2e82bce1545c45)((0, $79ce0e365a23b6d5$export$a11dc51f2ecd743e)((0, $db244738e3d6357d$export$a9e2f2714159e1ff)((0, $2097739565d80955$export$7d759072b2be4e22)((0, $3a08fcf437e8d724$export$bc17fd552ac7bdac)(HTMLCanvasElement)))))) {
    #bezier_detail;
    #curve_detail;
    #debug_mode;
    #orbit_control;
    static renderer = "webgl";
    constructor(){
        super();
        window.addEventListener("customElementsDefined", this.runCode.bind(this));
    }
    /**
   * Sets the resolution at which Bezier's curve is displayed. The default value is 20.
   * @type {number}
   */ get bezier_detail() {
        return this.#bezier_detail;
    }
    set bezier_detail(val) {
        this.pInst.bezierDetail(val);
        this.#bezier_detail = this.pInst._bezierDetail;
    }
    /**
   * Sets the current (active) camera of a 3D sketch.
   * Allows for switching between multiple cameras.
   *
   * Comma-separated arguments for
   * <a href="https://p5js.org/reference/#/p5/camera">camera()</a>
   * may also be provided to adjust the current camera.
   *
   * @type {p5.Camera}
   * */ get camera() {
        return this.pInst._renderer._curCamera;
    }
    set camera(val) {
        const { pInst: pInst  } = this;
        if (val instanceof p5.Camera) pInst.setCamera(val);
        else if (Array.isArray(val)) pInst.camera(...val);
        else pInst.camera(val);
    }
    /**
   * Sets the resolution at which curves display. The default value is 20 while
   * the minimum value is 3.
   * @type {number}
   */ get curve_detail() {
        return this.#curve_detail;
    }
    set curve_detail(val) {
        this.pInst.curveDetail(val);
        this.#curve_detail = this.pInst._curveDetail;
    }
    /**
   * debug_mode helps visualize 3D space by adding a grid to indicate where the
   * ‘ground’ is in a sketch and an axes icon which indicates the +X, +Y, and +Z
   * directions. This property can be set to "true" to create a
   * default grid and axes icon, or it can be set to a comma-separated list
   * of values to pass into
   * <a href="https://p5js.org/reference/#/p5/debugMode">debugMode()</a>.
   *
   * By default, the grid will run through the origin (0,0,0) of the sketch
   * along the XZ plane
   * and the axes icon will be offset from the origin.  Both the grid and axes
   * icon will be sized according to the current canvas size.
   * Note that because the
   * grid runs parallel to the default camera view, it is often helpful to use
   * debug_mode along with orbit_control to allow full view of the grid.
   * @type {boolean}
   */ get debug_mode() {
        return this.#debug_mode;
    }
    set debug_mode(val) {
        const { pInst: pInst  } = this;
        if (val === false) {
            pInst.noDebugMode();
            this.#debug_mode = false;
            return;
        } else if (val === true) pInst.debugMode();
        else if (Array.isArray(val)) pInst.debugMode(...val);
        else pInst.debugMode(val);
        this.#debug_mode = true;
    }
    /**
   * Allows movement around a 3D sketch using a mouse or trackpad.
   * Left-clicking and dragging will rotate the camera position about the
   * center of the sketch,
   * right-clicking and dragging will pan the camera position without rotation,
   * and using the mouse wheel (scrolling) will move the camera closer or
   * further
   * from the center of the sketch. This property can be set with parameters
   * dictating sensitivity to mouse movement along the X, Y, and Z axes.
   * Setting orbit_control="true" is equivalent to setting
   * orbit_control="1, 1".
   * To reverse direction of movement in either axis, enter a negative number
   * for sensitivity.
   * @type {boolean}
   * */ get orbit_control() {
        return this.#orbit_control;
    }
    set orbit_control(val) {
        this.#orbit_control = val;
    }
    /**
   * Sets an orthographic projection for the current camera in a 3D sketch
   * and defines a box-shaped viewing frustum within which objects are seen.
   * In this projection, all objects with the same dimension appear the same
   * size, regardless of whether they are near or far from the camera.
   *
   * This may be set to a comma-separated list of arguments to
   * <a href="https://p5js.org/reference/#/p5/ortho">ortho()</a>
   *
   * If set to "true", the following default is used:
   * ortho(-width/2, width/2, -height/2, height/2).
   *
   * @type {boolean}
   */ set ortho(val) {
        if (val === true) this.pInst.ortho();
        else if (Array.isArray(val)) this.pInst.ortho(...val);
        else if (val !== false) this.pInst.ortho(val);
    }
}
customElements.define("p-canvas-3d", $a7d17c9282527449$var$WebGLCanvas, {
    extends: "canvas"
});



const $c3262cadfa7b9b02$export$a4b143f4d85e7bf7 = (baseClass)=>class extends baseClass {
        /**
     * Evaluates the position on the bezier at t. t is the
     * resultant point which is given between 0 (start of Bezier) and 1 (end of Bezier).
     *
     * @param {number} t - value between 0 and 1
     * @returns {p5.Vector} - position on Bezier at t
     */ point_at(t) {
            const x = this.pInst.bezierPoint(this.x1, this.x2, this.x3, this.x4, t);
            const y = this.pInst.bezierPoint(this.y1, this.y2, this.y3, this.y4, t);
            return this.pInst.createVector(x, y);
        }
        /**
     * Evaluates the tangent to the Bezier at position t.
     * t is between 0 (start of Bezier) and 1 (end of Bezier).
     * @param {number} t - value between 0 and 1
     * @returns {p5.Vector} - tangent of Bezier at t
     */ tangent_at(t) {
            const x = this.pInst.bezierTangent(this.x1, this.x2, this.x3, this.x4, t);
            const y = this.pInst.bezierTangent(this.y1, this.y2, this.y3, this.y4, t);
            return this.pInst.createVector(x, y);
        }
    };
const $c3262cadfa7b9b02$export$f9e88d76da73025c = (baseClass)=>class extends baseClass {
        /**
     * Evaluates the position on the curve at t.
     * t is between 0 (start of curve) and 1 (end of curve).
     *
     * @param {number} t - value between 0 and 1
     * @returns {p5.Vector} - position on curve at t
     */ point_at(t) {
            const x = this.pInst.curvePoint(this.x1, this.x2, this.x3, this.x4, t);
            const y = this.pInst.curvePoint(this.y1, this.y2, this.y3, this.y4, t);
            return this.pInst.createVector(x, y);
        }
        /**
     * Evaluates the tangent to the curve at t.
     * t is between 0 (start of curve) and 1 (end of curve).
     *
     * @param {number} t - value between 0 and 1
     * @returns {p5.Vector} - tangent of curve at t
     */ tangent_at(t) {
            const x = this.pInst.curveTangent(this.x1, this.x2, this.x3, this.x4, t);
            const y = this.pInst.curveTangent(this.y1, this.y2, this.y3, this.y4, t);
            return this.pInst.createVector(x, y);
        }
    };



const $063b9c440f4a940f$export$b2e29383819ac3c4 = (baseClass)=>class extends baseClass {
        #stroke = "#000";
        #stroke_weight;
        /**
     * Sets the color used to draw lines and borders around shapes. This color
     * is either a <a href="#/p5.Color">p5.Color</a> object or a comma
     * separated list of values to pass into
     * <a href="https://p5js.org/reference/#/p5/color">color()</a>.
     * @type {p5.Color}
     */ get stroke() {
            return this.#stroke;
        }
        set stroke(val) {
            const { pInst: pInst  } = this;
            if (val === (0, $0c9e79e2e9aa197e$export$1a988e7317c65621).NONE) {
                pInst.noStroke();
                this.#stroke = pInst.color(0, 0);
            } else {
                pInst.stroke(val);
                this.#stroke = pInst.color(pInst._renderer.isP3D ? pInst._renderer.curStrokeColor : pInst.drawingContext.strokeStyle);
            }
        }
        /**
     * Sets the width of the stroke used for lines, points and the border around
     * shapes. All widths are set in units of pixels.
     *
     * Note that it is affected by any transformation or scaling that has
     * been applied previously.
     * @type {number}
     */ get stroke_weight() {
            return this.#stroke_weight;
        }
        set stroke_weight(val) {
            this.pInst.strokeWeight(val);
            this.#stroke_weight = this.pInst._renderer.isP3D ? this.pInst._renderer.curStrokeWeight : this.pInst.drawingContext.lineWidth;
        }
    };
const $063b9c440f4a940f$export$2a83b8e39b618423 = (baseClass)=>class extends baseClass {
        #fill = "#fff";
        /**
     * Sets the color used to fill shapes. This may be a
     * <a href="https://p5js.org/reference/#/p5.Color">p5.Color</a> object or
     * a comma separated list of values to pass into
     * <a href="https://p5js.org/reference/#/p5/color">color()</a>.
     * @type {p5.Color}
     */ get fill() {
            return this.#fill;
        }
        set fill(val) {
            const { pInst: pInst  } = this;
            if (val === (0, $0c9e79e2e9aa197e$export$1a988e7317c65621).NONE) {
                pInst.noFill();
                this.#fill = pInst.color(0, 0);
            } else {
                pInst.fill(val);
                this.#fill = pInst.color(pInst._renderer.isP3D ? pInst._renderer.curFillColor : pInst.drawingContext.fillStyle);
            }
        }
    };
const $063b9c440f4a940f$export$306219eb761ac4c2 = (baseClass)=>class extends $063b9c440f4a940f$export$2a83b8e39b618423($063b9c440f4a940f$export$b2e29383819ac3c4(baseClass)) {
    };
const $063b9c440f4a940f$export$1c730bb33b0db09f = (baseClass)=>class extends baseClass {
        #v1;
        #v2;
        #v3;
        /**
     * red or hue value using current color_mode
     * @type {number}
     */ get v1() {
            return this.#v1;
        }
        set v1(val) {
            this.#v1 = val;
        }
        /**
     * green or saturation value using current color_mode
     * @type {number}
     */ get v2() {
            return this.#v2;
        }
        set v2(val) {
            this.#v2 = val;
        }
        /**
     * blue, brightness, or lightness value using current color_mode
     * @type {number}
     */ get v3() {
            return this.#v3;
        }
        set v3(val) {
            this.#v3 = val;
        }
    };


const $f2731110a32ba8b7$export$5f4909ba2c08017a = (baseClass)=>class extends baseClass {
        #width;
        #height;
        /**
     * The width of the element in pixels.
     * @type {number}
     */ get width() {
            return this.#width;
        }
        set width(val) {
            if (!isNaN(val)) this.#width = Number(val);
            else console.error(`${this.tagName}'s width is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The height of the element in pixels.
     * @type {number}
     */ get height() {
            return this.#height;
        }
        set height(val) {
            if (!isNaN(val)) this.#height = Number(val);
            else console.error(`${this.tagName}'s height is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$767c784c12981b7a = (baseClass)=>class extends baseClass {
        #x = 0;
        #y = 0;
        /**
     * The x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x() {
            return this.#x;
        }
        set x(val) {
            if (!isNaN(val)) this.#x = Number(val);
            else console.error(`${this.tagName}'s x property is being set to ${val}, but it may only be set to a number`);
        }
        /**
     * The y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y() {
            return this.#y;
        }
        set y(val) {
            if (!isNaN(val)) this.#y = Number(val);
            else console.error(`${this.tagName}'s y property is being set to ${val}, but it may only be set to a number`);
        }
    };
const $f2731110a32ba8b7$var$addZ = (baseClass)=>class extends baseClass {
        #z = 0;
        /**
     * The z-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get z() {
            return this.#z;
        }
        set z(val) {
            if (!isNaN(val)) this.#z = Number(val);
            else console.error(`${this.tagName}'s z property is being set to ${val}, but it may only be set to a number`);
        }
    };
const $f2731110a32ba8b7$export$339b9be62e060004 = (baseClass)=>class extends $f2731110a32ba8b7$export$767c784c12981b7a($f2731110a32ba8b7$var$addZ(baseClass)) {
    };
const $f2731110a32ba8b7$var$addXY1 = (baseClass)=>class extends baseClass {
        #x1 = 0;
        #y1 = 0;
        /**
     * The first x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x1() {
            return this.#x1;
        }
        set x1(val) {
            if (!isNaN(val)) this.#x1 = val;
            else console.error(`${this.tagName}'s x1 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The first y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y1() {
            return this.#y1;
        }
        set y1(val) {
            if (!isNaN(val)) this.#y1 = val;
            else console.error(`${this.tagName}'s y1 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$var$addXY2 = (baseClass)=>class extends baseClass {
        #x2 = 0;
        #y2 = 100;
        /**
     * The second x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x2() {
            return this.#x2;
        }
        set x2(val) {
            if (!isNaN(val)) this.#x2 = val;
            else console.error(`${this.tagName}'s x2 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The second y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y2() {
            return this.#y2;
        }
        set y2(val) {
            if (!isNaN(val)) this.#y2 = val;
            else console.error(`${this.tagName}'s y2 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$d38590504f301641 = (baseClass)=>class extends $f2731110a32ba8b7$var$addXY1($f2731110a32ba8b7$var$addXY2(baseClass)) {
    };
const $f2731110a32ba8b7$export$3b9f5e1deb5b3f70 = (baseClass)=>class extends baseClass {
        #x3 = 100;
        #y3 = 0;
        /**
     * The third x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x3() {
            return this.#x3;
        }
        set x3(val) {
            if (!isNaN(val)) this.#x3 = val;
            else console.error(`${this.tagName}'s x3 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The third y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y3() {
            return this.#y3;
        }
        set y3(val) {
            if (!isNaN(val)) this.#y3 = val;
            else console.error(`${this.tagName}'s y3 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$var$addXY123 = (baseClass)=>class extends $f2731110a32ba8b7$export$d38590504f301641($f2731110a32ba8b7$export$3b9f5e1deb5b3f70(baseClass)) {
    };
const $f2731110a32ba8b7$var$addZ1 = (baseClass)=>class extends baseClass {
        #z1 = 0;
        /**
     * The first z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */ get z1() {
            return this.#z1;
        }
        set z1(val) {
            if (!isNaN(val)) this.#z1 = val;
            else console.error(`${this.tagName}'s z1 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$604ef710b341881f = (baseClass)=>class extends $f2731110a32ba8b7$var$addXY1($f2731110a32ba8b7$var$addZ1(baseClass)) {
    };
const $f2731110a32ba8b7$var$addZ2 = (baseClass)=>class extends baseClass {
        #z2 = 100;
        /**
     * The second z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */ get z2() {
            return this.#z2;
        }
        set z2(val) {
            if (!isNaN(val)) this.#z2 = val;
            else console.error(`${this.tagName}'s z2 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$81fbedce0d6f2624 = (baseClass)=>class extends $f2731110a32ba8b7$var$addXY2($f2731110a32ba8b7$var$addZ2(baseClass)) {
    };
const $f2731110a32ba8b7$var$addXYZ12 = (baseClass)=>class extends $f2731110a32ba8b7$export$604ef710b341881f($f2731110a32ba8b7$export$81fbedce0d6f2624(baseClass)) {
    };
const $f2731110a32ba8b7$export$6945b0bfc23861d6 = (baseClass)=>class extends $f2731110a32ba8b7$var$addXY123(baseClass) {
        #x4 = 0;
        #y4 = 100;
        /**
     * The fourth x-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get x4() {
            return this.#x4;
        }
        set x4(val) {
            if (!isNaN(val)) this.#x4 = val;
            else console.error(`${this.tagName}'s x4 is being set to ${val}, but it may only be set to a number.`);
        }
        /**
     * The fourth y-coordinate of the element relative to the current anchor.
     * @type {number}
     */ get y4() {
            return this.#y4;
        }
        set y4(val) {
            if (!isNaN(val)) this.#y4 = val;
            else console.error(`${this.tagName}'s y4 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$f37ee723107c34f2 = (baseClass)=>class extends baseClass {
        #z3 = 100;
        /**
     * The third z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */ get z3() {
            return this.#z3;
        }
        set z3(val) {
            if (!isNaN(val)) this.#z3 = val;
            else console.error(`${this.tagName}'s z3 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$fae99258cbe6a26a = (baseClass)=>class extends $f2731110a32ba8b7$export$3b9f5e1deb5b3f70($f2731110a32ba8b7$export$f37ee723107c34f2(baseClass)) {
    };
const $f2731110a32ba8b7$export$e288c2fcfc4db9f1 = (baseClass)=>class extends $f2731110a32ba8b7$var$addXYZ12($f2731110a32ba8b7$export$3b9f5e1deb5b3f70($f2731110a32ba8b7$export$f37ee723107c34f2(baseClass))) {
    };
const $f2731110a32ba8b7$export$3cfeb607d06c2291 = (baseClass)=>class extends baseClass {
        #z4 = 0;
        /**
     * The fourth z-coordinate of the element relative to the current anchor. |
     * @type {number}
     */ get z4() {
            return this.#z4;
        }
        set z4(val) {
            if (!isNaN(val)) this.#z4 = val;
            else console.error(`${this.tagName}'s z4 is being set to ${val}, but it may only be set to a number.`);
        }
    };
const $f2731110a32ba8b7$export$e267bc9e857642fc = (baseClass)=>class extends $f2731110a32ba8b7$export$6945b0bfc23861d6($f2731110a32ba8b7$export$3cfeb607d06c2291(baseClass)) {
    };
const $f2731110a32ba8b7$export$7757a7d90505b04a = (baseClass)=>class extends baseClass {
        #rect_mode = "corner";
        /**
     * Modifies the location from which rectangles are drawn by changing the way
     * in which x and y coordinates are interpreted.
     *
     * The default mode is CORNER, which interprets the x and y as the
     * upper-left corner of the shape.
     *
     * rect_mode="CORNERS" interprets x and y as the location of
     * one of the corners, and width and height as the location of
     * the diagonally opposite corner. Note, the rectangle is drawn between the
     * coordinates, so it is not necessary that the first corner be the upper left
     * corner.
     *
     * rect_mode="CENTER" interprets x and y as the shape's center
     * point.
     *
     * rect_mode="RADIUS" also uses x and y as the shape's
     * center
     * point, but uses width and height to specify half of the shape's
     * width and height respectively.
     *
     * The value to this property must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     *
     * @type {CORNER|CORNERS|CENTER|RADIUS}
     */ get rect_mode() {
            return this.#rect_mode;
        }
        set rect_mode(mode) {
            this.pInst.rectMode(mode);
            this.#rect_mode = this.pInst._renderer._rectMode;
        }
    };
const $f2731110a32ba8b7$export$1caa28391933d750 = (baseClass)=>class extends baseClass {
        #smooth = true;
        #stroke_cap = "round";
        #stroke_join = "miter";
        /**
     * smooth="true" draws all geometry with smooth (anti-aliased) edges. smooth="true" will also
     * improve image quality of resized images. smooth is true by
     * default on a 2D canvas. smooth="false" can be used to disable smoothing of geometry,
     * images, and fonts.
     * @type {boolean}
     */ get smooth() {
            return this.#smooth;
        }
        set smooth(val) {
            if (typeof val !== "boolean") return console.error(`${this.tagName}'s smooth property is being set to ${val}, but it may only be set to true or false.`);
            if (val) this.pInst.smooth();
            else this.pInst.noSmooth();
            this.#smooth = val;
        }
        /**
     * Sets the style for rendering line endings. These ends are either rounded,
     * squared or extended, each of which specified with the corresponding
     * parameters: ROUND, SQUARE and PROJECT. The default cap is ROUND.
     *
     * The value on this property must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     * @type {ROUND|SQUARE|PROJECT}
     */ get stroke_cap() {
            return this.#stroke_cap;
        }
        set stroke_cap(val) {
            this.pInst.strokeCap(val);
            this.#stroke_cap = this.pInst.drawingContext.lineCap;
        }
        /**
     * Sets the style of the joints which connect line segments. These joints
     * are either mitered, beveled or rounded and specified with the
     * corresponding parameters MITER, BEVEL and ROUND. The default joint is
     * MITER.
     *
     * The parameter to this method must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     * @type {MITER|BEVEL|ROUND}
     */ get stroke_join() {
            return this.#stroke_join;
        }
        set stroke_join(val) {
            this.pInst.strokeJoin(val);
            this.#stroke_join = this.pInst.drawingContext.lineJoin;
        }
    };
const $f2731110a32ba8b7$export$99f537b5fba70e67 = (baseClass)=>class extends baseClass {
        #tightness = 0;
        /**
     * Modifies the quality of the curve. The amount
     * determines how the curve fits to the vertex points. The value 0.0 is the
     * default value (this value defines the curves to be Catmull-Rom
     * splines) and the value 1.0 connects all the points with straight lines.
     * Values within the range -5.0 and 5.0 will deform the curves but will leave
     * them recognizable and as values increase in magnitude, they will continue to deform.
     * @type {number}
     */ get tightness() {
            return this.#tightness;
        }
        set tightness(val) {
            this.#tightness = val;
        }
    };
const $f2731110a32ba8b7$export$ef4fa9024d8dc750 = (baseClass)=>class extends baseClass {
        #cx;
        #cy;
        get cx() {
            return this.#cx;
        }
        set cx(val) {
            this.#cx = val;
        }
        get cy() {
            return this.#cy;
        }
        set cy(val) {
            this.#cy = val;
        }
    };
const $f2731110a32ba8b7$export$6a6520d1fb36b10e = (baseClass)=>class extends baseClass {
        #cz;
        get cz() {
            return this.#cz;
        }
        set cz(val) {
            this.#cz = val;
        }
    };





const $f83208cc1173e373$var$add2DStroke = (baseClass)=>(0, $063b9c440f4a940f$export$b2e29383819ac3c4)((0, $f2731110a32ba8b7$export$1caa28391933d750)(baseClass));
const $f83208cc1173e373$var$add2DFillStroke = (baseClass)=>(0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $f2731110a32ba8b7$export$1caa28391933d750)(baseClass));
const $f83208cc1173e373$var$transformVertexFn = (el)=>(v)=>{
        const { x: x , y: y  } = el.local_to_canvas_position(v.x, v.y);
        return el.pInst.createVector(x, y);
    };
class $f83208cc1173e373$var$Transformed2DElement extends (0, $2097739565d80955$export$cd9f7ba93ec6c49f)((0, $3a08fcf437e8d724$export$c0049cef078ecb01)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
}
const $f83208cc1173e373$export$761535d4bf6998ba = (baseClass)=>class extends baseClass {
        #start_angle = 0;
        #stop_angle = Math.PI;
        #mode;
        get mouse_over() {
            const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(mouseX, mouseY);
            const { x: x , y: y , width: width , height: height , start_angle: start_angle , stop_angle: stop_angle  } = this;
            console.assert(width === height, "mouse_over currently only works for arc's with equal width and height.");
            const arcRadius = width / 2;
            const arcAngle = stop_angle - start_angle;
            const arcRotation = start_angle + arcAngle / 2;
            return this.collide.point_arc(local_mouse_x, local_mouse_y, x, y, arcRadius, arcRotation, arcAngle);
        }
        /**
     * Angle to start the arc. Units are radians by default but may be changed
     * to degrees with the degree_mode property.
     * @type {number}
     */ get start_angle() {
            return this.#start_angle;
        }
        set start_angle(val) {
            this.#start_angle = val;
        }
        /**
     * Angle to stop the arc. Units are radians by default but may be changed
     * to degrees with the degree_mode property.
     * @type {number}
     */ get stop_angle() {
            return this.#stop_angle;
        }
        set stop_angle(val) {
            this.#stop_angle = val;
        }
        /**
     * determines the way of drawing the arc:
     * - OPEN - like an open semi-circle
     * - CHORD - closed semi-circle
     * - PIE - closed pie segment
     * @type {CHORD|PIE|OPEN}
     */ get mode() {
            return this.#mode;
        }
        set mode(val) {
            this.#mode = val;
        }
    };
/**
 * Draws an arc to the screen.
 * The origin may be changed with the ellipse_mode property.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever
 * stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
 * does not change where they fall. If both start and stop fall at the same
 * place, a full ellipse will be drawn. Be aware that the y-axis increases in
 * the downward direction, therefore angles are measured clockwise from the
 * positive x-direction ("3 o'clock").
 * @element arc
 */ class $f83208cc1173e373$var$Arc extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)($f83208cc1173e373$export$761535d4bf6998ba($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$Transformed2DElement)))) {
    static overloads = [
        "x, y, width, height, start_angle, stop_angle, [mode]"
    ];
}
customElements.define("p-arc", $f83208cc1173e373$var$Arc);
const $f83208cc1173e373$var$addEllipse2DCollisionProps = (baseClass)=>class extends baseClass {
        collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).ellipse;
        get collision_args() {
            const { x: x , y: y  } = this.local_to_canvas_position(this.x, this.y);
            const { pixel_density: pixel_density  } = this.canvas;
            const { w: w  } = this.width * pixel_density;
            const { h: h  } = this.height * pixel_density || w;
            return [
                x,
                y,
                w,
                h
            ];
        }
        get mouse_over() {
            const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(mouseX, mouseY);
            const { x: x , y: y , width: width , height: height  } = this.this_element;
            return this.collide.point_ellipse(local_mouse_x, local_mouse_y, x, y, width, height);
        }
    };
/**
 * Draws an ellipse (oval) to a 3D canvas. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse
 */ class $f83208cc1173e373$var$Ellipse extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)($f83208cc1173e373$var$addEllipse2DCollisionProps($f83208cc1173e373$var$Transformed2DElement)))) {
    static overloads = [
        "x, y, width, [height]"
    ];
}
customElements.define("p-ellipse", $f83208cc1173e373$var$Ellipse);
const $f83208cc1173e373$var$addCircle2DCollisionProps = (baseClass)=>class extends baseClass {
        constructor(){
            super([
                "x, y, d"
            ]);
        }
        collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).circle;
        get collision_args() {
            const { x: x , y: y  } = this.local_to_canvas_position(this.x, this.y);
            const scaledDiameter = this.diameter * this.pInst.pow(this.canvas.pixel_density, 2);
            return [
                x,
                y,
                scaledDiameter
            ];
        }
        get mouse_over() {
            const { mouseX: mouseX1 , mouseY: mouseY1  } = this.pInst;
            const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(mouseX1, mouseY1);
            const { x: x , y: y , diameter: diameter  } = this;
            return this.collide.point_circle(local_mouse_x, local_mouse_y, x, y, diameter);
        }
    };
const $f83208cc1173e373$export$115022717b09ec84 = (baseClass)=>class extends baseClass {
        #diameter = 100;
        get diameter() {
            return this.#diameter;
        }
        set diameter(val) {
            this.#diameter = val;
        }
    };
/**
 * Draws a circle to the screen. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 */ class $f83208cc1173e373$var$Circle extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)($f83208cc1173e373$export$115022717b09ec84($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$addCircle2DCollisionProps($f83208cc1173e373$var$Transformed2DElement)))) {
    static overloads = [
        "x, y, diameter"
    ];
}
customElements.define("p-circle", $f83208cc1173e373$var$Circle);
const $f83208cc1173e373$var$addLine2DCollisionProps = (baseClass)=>class extends baseClass {
        collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).line;
        get collision_args() {
            const { x: x1 , y: y1  } = this.local_to_canvas_position(this.x1, this.y1);
            const { x: x2 , y: y2  } = this.local_to_canvas_position(this.x2, this.y2);
            return [
                x1,
                y1,
                x2,
                y2
            ];
        }
        get mouse_over() {
            const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(mouseX, mouseY);
            const { x1: x1 , y1: y1 , x2: x2 , y2: y2  } = this;
            return this.collide.point_line(local_mouse_x, local_mouse_y, x1, y1, x2, y2);
        }
    };
/**
 * Draws a line (a direct path between two points) to the screen. Its width
 * can be modified by using the stroke_weight property. A line cannot be
 * filled, therefore the fill_color property will not affect the color of a
 * line. So to color a line, use the stroke property.
 * @element line
 */ class $f83208cc1173e373$var$Line extends (0, $f2731110a32ba8b7$export$d38590504f301641)($f83208cc1173e373$var$add2DStroke($f83208cc1173e373$var$addLine2DCollisionProps($f83208cc1173e373$var$Transformed2DElement))) {
    static overloads = [
        "x1, y1, x2, y2"
    ];
}
customElements.define("p-line", $f83208cc1173e373$var$Line);
const $f83208cc1173e373$var$addPointCollisionProps = (baseClass)=>class extends baseClass {
        collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).circle;
        get collision_args() {
            const { x: x , y: y  } = this.local_to_canvas_position(this.x, this.y);
            const { stroke_weight: stroke_weight  } = this;
            const { pixel_density: pixel_density  } = this.canvas;
            const d = stroke_weight * this.pInst.pow(pixel_density, 2);
            return [
                x,
                y,
                d
            ];
        }
        get mouse_over() {
            const { x: x , y: y , stroke_weight: stroke_weight  } = this;
            const { pixel_density: pixel_density  } = this.canvas;
            const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(this.pInst.mouseX, this.pInst.mouseY);
            const d = stroke_weight * this.pInst.pow(pixel_density, 2);
            return this.collide.point_circle(local_mouse_x, local_mouse_y, x, y, d);
        }
    };
/**
 * Draws a point, a coordinate in space at the dimension of one pixel. The
 * color of the point is changed with the stroke property. The size of
 * the point can be changed with the stroke_weight property.
 * @element point
 */ class $f83208cc1173e373$var$Point extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)($f83208cc1173e373$var$add2DStroke($f83208cc1173e373$var$addPointCollisionProps($f83208cc1173e373$var$Transformed2DElement))) {
    static overloads = [
        "x, y"
    ];
}
customElements.define("p-point", $f83208cc1173e373$var$Point);
const $f83208cc1173e373$var$addQuad2DCollisionProps = (baseClass)=>class extends baseClass {
        collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).poly;
        get collision_args() {
            return [
                this.vertices.map($f83208cc1173e373$var$transformVertexFn(this))
            ];
        }
        get mouse_over() {
            const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(this.pInst.mouseX, this.pInst.mouseY);
            return this.collide.point_poly(local_mouse_x, local_mouse_y, this.vertices);
        }
        get vertices() {
            const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3 , x4: x4 , y4: y4  } = this;
            return [
                this.pInst.createVector(x1, y1),
                this.pInst.createVector(x2, y2),
                this.pInst.createVector(x3, y3),
                this.pInst.createVector(x4, y4), 
            ];
        }
    };
/**
 * Draws a quad on the canvas. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 properties set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape.
 * @element quad
 */ class $f83208cc1173e373$var$Quad extends (0, $f2731110a32ba8b7$export$d38590504f301641)((0, $f2731110a32ba8b7$export$3b9f5e1deb5b3f70)((0, $f2731110a32ba8b7$export$6945b0bfc23861d6)($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$addQuad2DCollisionProps($f83208cc1173e373$var$Transformed2DElement))))) {
    static overloads = [
        "x1, y1, x2, y2, x3, y3, x4, y4"
    ];
}
customElements.define("p-quad", $f83208cc1173e373$var$Quad);
const $f83208cc1173e373$var$addCornerRadius = (baseClass)=>class extends baseClass {
        #top_left_radius = 0;
        #top_right_radius = 0;
        #bottom_left_radius = 0;
        #bottom_right_radius = 0;
        /**
     * radius of top-left corner
     * @type {number}
     */ get top_left_radius() {
            return this.#top_left_radius;
        }
        set top_left_radius(val) {
            this.#top_left_radius = val;
        }
        /**
     * radius of top-right corner
     * @type {number}
     */ get top_right_radius() {
            return this.#top_right_radius;
        }
        set top_right_radius(val) {
            this.#top_right_radius = val;
        }
        /**
     * radius of bottom-left corner
     * @type {number}
     */ get bottom_left_radius() {
            return this.#bottom_left_radius;
        }
        set bottom_left_radius(val) {
            this.#bottom_left_radius = val;
        }
        /**
     * radius of bottom-right corner
     * @type {number}
     */ get bottom_right_radius() {
            return this.#bottom_right_radius;
        }
        set bottom_right_radius(val) {
            this.#bottom_right_radius = val;
        }
    };
/**
 * Draws a rectangle on the canvas. A rectangle is a four-sided closed shape
 * with every angle at ninety degrees. By default, the x and y properties
 * set the location of the upper-left corner, w sets the width, and h sets
 * the height. The way these properties are interpreted may be changed with
 * the rect_mode property.
 * @element rect
 */ class $f83208cc1173e373$var$Rect extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $f2731110a32ba8b7$export$7757a7d90505b04a)($f83208cc1173e373$var$addCornerRadius($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$Transformed2DElement))))) {
    static overloads = [
        "x, y, width, height, top_left_radius, top_right_radius, bottom_right_radius, bottom_left_radius", 
    ];
    collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).rect;
    get collision_args() {
        const { rect_mode: rect_mode  } = this;
        const { pixel_density: pixel_density  } = this.canvas;
        const w = this.width * this.pInst.pow(pixel_density, 2);
        const h = this.height * this.pInst.pow(pixel_density, 2);
        if (rect_mode === "corner") {
            const { x: x , y: y  } = this.local_to_canvas_position(this.x, this.y);
            return [
                x,
                y,
                w,
                h
            ];
        }
        if (rect_mode === "center") {
            const { x: x1 , y: y1  } = this.local_to_canvas_position(this.x - this.width / 2, this.y - this.height / 2);
            return [
                x1,
                y1,
                w,
                h
            ];
        }
        console.error(`Collision detection with rect_mode ${rect_mode} is not yet supported`);
    }
    get mouse_over() {
        const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(this.pInst.mouseX, this.pInst.mouseY);
        const { x: x , y: y , width: width , height: height  } = this;
        return this.collide.point_rect(local_mouse_x, local_mouse_y, x, y, width, height);
    }
}
customElements.define("p-rect", $f83208cc1173e373$var$Rect);
/**
 * Draws a square to the screen. A square is a four-sided shape with every
 * angle at ninety degrees, and equal side size. This element is a special
 * case of the rect element, where the width and height are the same, and the
 * attribute is called "s" for side size. By default, the x and y attributes
 * set the location of the upper-left corner, and s sets the side size of the
 * square. The way these attributes are interpreted, may be changed with the
 * rect_mode attribute.
 *
 * The tl, tr, br, and bl attributes, if specified, determine corner radius
 * for the top-left, top-right, lower-right and lower-left corners,
 * respectively. An omitted corner radius attribute is set to the value of
 * the previously specified radius value in the attribute list.
 *
 * @element square
 */ class $f83208cc1173e373$var$Square extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$7757a7d90505b04a)($f83208cc1173e373$var$addCornerRadius($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$Transformed2DElement)))) {
    #size = 100;
    static overloads = [
        "x, y, size, top_left_radius, top_right_radius, bottom_right_radius, bottom_left_radius", 
    ];
    collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).rect;
    get collision_args() {
        const { pixel_density: pixel_density  } = this.canvas;
        const { size: size , rect_mode: rect_mode  } = this;
        const w = size * this.pInst.pow(pixel_density, 2);
        const h = w;
        if (rect_mode === "corner") {
            const { x: x , y: y  } = this.local_to_canvas_position(this.x, this.y);
            return [
                x,
                y,
                w,
                h
            ];
        }
        if (rect_mode === "center") {
            const { x: x1 , y: y1  } = this.local_to_canvas_position(this.x - size / 2, this.y - this.size / 2);
            return [
                x1,
                y1,
                w,
                h
            ];
        }
        console.error(`Collision detection for rect_mode ${rect_mode} is not yet supported`);
        return [];
    }
    get mouse_over() {
        const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(this.pInst.mouseX, this.pInst.mouseY);
        const { x: x , y: y , size: size  } = this;
        return this.collide.point_rect(local_mouse_x, local_mouse_y, x, y, size, size);
    }
    /**
   * The side size of the square
   * @type {number}
   */ get size() {
        return this.#size;
    }
    set size(val) {
        if (!isNaN(val)) this.#size = Number(val);
        else console.error(`${this.tagName}'s size is being set to ${val}, but it may only be set to a number.`);
    }
}
customElements.define("p-square", $f83208cc1173e373$var$Square);
/**
 * Draws a triangle to the canvas. A triangle is a plane created by connecting
 * three points. x1 and y1 specify the first point, x2 and y2 specify the
 * second point, and x3 and y3 specify the
 * third point.
 * @element triangle
 */ class $f83208cc1173e373$var$Triangle extends (0, $f2731110a32ba8b7$export$d38590504f301641)((0, $f2731110a32ba8b7$export$3b9f5e1deb5b3f70)($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$Transformed2DElement))) {
    static overloads = [
        "x1, y1, x2, y2, x3, y3"
    ];
    collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).poly;
    get collision_args() {
        return [
            this.vertices.map($f83208cc1173e373$var$transformVertexFn(this))
        ];
    }
    get mouse_over() {
        const { x: local_mouse_x , y: local_mouse_y  } = this.canvas_to_local_position(this.pInst.mouseX, this.pInst.mouseY);
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3  } = this;
        return this.collide.point_triangle(local_mouse_x, local_mouse_y, x1, y1, x2, y2, x3, y3);
    }
    get vertices() {
        const { x1: x1 , y1: y1 , x2: x2 , y2: y2 , x3: x3 , y3: y3  } = this;
        return [
            this.pInst.createVector(x1, y1),
            this.pInst.createVector(x2, y2),
            this.pInst.createVector(x3, y3), 
        ];
    }
}
customElements.define("p-triangle", $f83208cc1173e373$var$Triangle);
/**
 * Draws a cubic Bezier curve on the screen. These curves are defined by a
 * series of anchor and control points. x1 and y1 specify
 * the first anchor point and x4 and y4 specify the other
 * anchor point, which become the first and last points on the curve. (x2, y2)
 * and (x3, y3) specify the two control points which define the shape
 * of the curve. Approximately speaking, control points "pull" the curve
 * towards them.
 *
 * Bezier curves were developed by French automotive engineer Pierre Bezier,
 * and are commonly used in computer graphics to define gently sloping curves.
 * @element bezier
 */ class $f83208cc1173e373$var$Bezier extends (0, $f2731110a32ba8b7$export$d38590504f301641)((0, $f2731110a32ba8b7$export$3b9f5e1deb5b3f70)((0, $f2731110a32ba8b7$export$6945b0bfc23861d6)($f83208cc1173e373$var$add2DFillStroke((0, $c3262cadfa7b9b02$export$a4b143f4d85e7bf7)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))))) {
    static overloads = [
        "x1, y1, x2, y2, x3, y3, x4, y4"
    ];
}
customElements.define("p-bezier", $f83208cc1173e373$var$Bezier);
/**
 * Draws a curved line on the screen between two points, given as (x2, y2) and (x3, y3).
 * (x1, y1) is a control point, as
 * if the curve came from this point even though it's not drawn. (x4, y4) similarly describes
 * the other control point.
 *
 * Longer curves can be created by putting a series of ```<curve>``` elements
 * together or using ```<curve-vertex>```. The curve_tightness property provides control
 * for the visual quality of the curve.
 * The ```<curve>``` element is an implementation of Catmull-Rom splines.
 * @element curve
 */ class $f83208cc1173e373$var$Curve extends (0, $f2731110a32ba8b7$export$d38590504f301641)((0, $f2731110a32ba8b7$export$3b9f5e1deb5b3f70)((0, $f2731110a32ba8b7$export$6945b0bfc23861d6)((0, $f2731110a32ba8b7$export$99f537b5fba70e67)($f83208cc1173e373$var$add2DFillStroke((0, $c3262cadfa7b9b02$export$f9e88d76da73025c)($f83208cc1173e373$var$Transformed2DElement)))))) {
    static overloads = [
        "x1, y1, x2, y2, x3, y3, x4, y4"
    ];
}
customElements.define("p-curve", $f83208cc1173e373$var$Curve);
/**
 * Use the ```<contour>``` element to create negative shapes
 * within a ```<shape>``` element such as the center of the letter 'O'.
 * The vertices of the ```<contour>``` are defined by its
 * ```<vertex>``` and ```<curve-vertex>``` children.
 * The vertices that define a negative shape must "wind" in the opposite direction
 * from the exterior shape. First draw vertices for the exterior clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 *
 * This element must be a child of a ```<shape>```.
 * @element contour
 * @example Rectangular cut out
 * ```html
 * <canvas
 *    width="400"
 *    height="400"
 *    background="120, 140, 80"
 *    loop="false"
 * >
 *  <shape
 *      anchor="width/2, height/2"
 *      mode="CLOSE"
 *      fill="240, 200, 180"
 *      stroke="200, 100, 60"
 *      stroke_weight="4"
 *  >
 *    <vertex x="-100" y="-100">
 *      <vertex x="100">
 *        <vertex y="100">
 *          <vertex x="-100" />
 *        </vertex>
 *      </vertex>
 *    </vertex>
 *    <contour>
 *      <vertex x="-50" y="-50">
 *        <vertex y="50">
 *          <vertex x="50">
 *            <vertex y="-50" />
 *          </vertex>
 *        </vertex>
 *      </vertex>
 *    </contour>
 *  </shape>
 * </canvas>
 * ```
 */ class $f83208cc1173e373$var$Contour extends $f83208cc1173e373$var$add2DFillStroke((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    renderFunctionName = "beginContour";
    endRender() {
        this.pInst.endContour();
    }
}
customElements.define("p-contour", $f83208cc1173e373$var$Contour);
const $f83208cc1173e373$var$addShape2DCollisionProps = (baseClass)=>class extends baseClass {
        collider = (0, $16ac526ed636526d$export$c8dddae6889b41c4).poly;
        get collision_args() {
            return [
                this.vertices.map($f83208cc1173e373$var$transformVertexFn(this))
            ];
        }
        get vertices() {
            const arrayFromChildren = (el)=>{
                const ca = Array.from(el.children);
                return ca.concat(ca.map(arrayFromChildren)).flat();
            };
            const childArray = arrayFromChildren(this);
            const vertexChildren = childArray.filter((el)=>el instanceof $f83208cc1173e373$var$Vertex && el.this_element);
            const vertices = vertexChildren.map((el)=>{
                if (el instanceof $f83208cc1173e373$var$QuadraticVertex) {
                    const { x3: x3 , y3: y3  } = el;
                    return this.pInst.createVector(x3, y3);
                }
                const { x: x , y: y  } = el;
                return this.pInst.createVector(x, y);
            });
            return vertices.concat(vertices.slice(0));
        }
    };
const $f83208cc1173e373$export$d11dd115fc87026 = (baseClass)=>class extends baseClass {
        #kind;
        #mode;
        renderFunctionName = "beginShape";
        static overloads = [
            "[kind]"
        ];
        endRender() {
            if (this.#mode) this.pInst.endShape(this.#mode);
            else this.pInst.endShape();
        }
        /**
     * The options available for kind are
     *
     * POINTS
     * Draw a series of points
     *
     * LINES
     * Draw a series of unconnected line segments (individual lines)
     *
     * TRIANGLES
     * Draw a series of separate triangles
     *
     * TRIANGLE_FAN
     * Draw a series of connected triangles sharing the first vertex in a fan-like fashion
     *
     * TRIANGLE_STRIP
     * Draw a series of connected triangles in strip fashion
     *
     * QUADS
     * Draw a series of separate quads
     *
     * QUAD_STRIP
     * Draw quad strip using adjacent edges to form the next quad
     *
     * TESS (WEBGL only)
     * Handle irregular polygon for filling curve by explicit tessellation
     * @type {POINTS|LINES|TRIANGLES|TRIANGLE_FAN TRIANGLE_STRIP|QUADS|QUAD_STRIP|TESS}
     */ get kind() {
            return this.#kind;
        }
        set kind(val) {
            this.#kind = val;
        }
        get mode() {
            return this.#mode;
        }
        set mode(val) {
            this.#mode = val;
        }
    };
/**
 * Using the ```<shape>``` element allow creating more
 * complex forms. The vertices of the shape are defined by its ```<vertex>```,
 * ```<curve-vertex>```, and/or ```<quadratic-vertex>``` children.
 * The value of the kind property tells it which
 * types of shapes to create from the provided vertices. With no mode
 * specified, the shape can be any irregular polygon.
 *
 * Transformations such as translate, angle, and scale do not work on children on ```<shape>```.
 * It is also not possible to use other shapes, such as
 * ```<ellipse>``` or ```<rect>``` as children of ```<shape>```.
 * @element shape
 */ class $f83208cc1173e373$var$Shape extends $f83208cc1173e373$export$d11dd115fc87026($f83208cc1173e373$var$add2DFillStroke($f83208cc1173e373$var$addShape2DCollisionProps($f83208cc1173e373$var$Transformed2DElement))) {
}
customElements.define("p-shape", $f83208cc1173e373$var$Shape);
/**
 * All shapes are constructed by connecting a series of vertices. ```<vertex>```
 * is used to specify the vertex coordinates for points, lines, triangles,
 * quads, and polygons. It is used exclusively as a child of the ```<shape>``` element.
 * @element vertex
 */ class $f83208cc1173e373$var$Vertex extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    static overloads = [
        "x, y"
    ];
}
customElements.define("p-vertex", $f83208cc1173e373$var$Vertex);
/**
 * Specifies vertex coordinates for quadratic Bezier curves. Each ```<quadratic-vertex>```
 * defines the position of one control points and one
 * anchor point of a Bezier curve, adding a new segment to a line or shape.
 * The first ```<quadratic-vertex>``` child of a ```<shape>``` element
 * must have a ```<vertex>``` sibling above it to set the first anchor point.
 *
 * This element must be a child of a ```<shape>``` element
 * and only when there is no MODE or POINTS property specified on the
 *  ```<shape>```.
 */ class $f83208cc1173e373$var$QuadraticVertex extends (0, $f2731110a32ba8b7$export$ef4fa9024d8dc750)((0, $f2731110a32ba8b7$export$3b9f5e1deb5b3f70)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    static overloads = [
        "cx, cy, x3, y3"
    ];
}
customElements.define("p-quadratic-vertex", $f83208cc1173e373$var$QuadraticVertex);
/**
 * Specifies vertex coordinates for curves. This function may only
 * be used as a child of the ```<shape>``` element and only when there
 * is no MODE property specified on the ```<shape>``.
 *
 * The first and last points in a series of ```<curve-vertex>``` lines
 * will be used to
 * guide the beginning and end of the curve. A minimum of four
 * points is required to draw a tiny curve between the second and
 * third points. Adding a fifth point with ```<curve-vertex>``` will draw
 * the curve between the second, third, and fourth points. The
 * ```<curve-vertex>``` element is an implementation of Catmull-Rom
 * splines.
 */ class $f83208cc1173e373$var$CurveVertex extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $f2731110a32ba8b7$export$99f537b5fba70e67)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    static overloads = [
        "x, y"
    ];
}
customElements.define("p-curve-vertex", $f83208cc1173e373$var$CurveVertex);



p5.prototype._createDescriptionContainer = function() {
    const cnvId = this.canvas.id;
    const descriptionContainer = document.createElement("div");
    descriptionContainer.setAttribute("id", `${cnvId}_Description`);
    descriptionContainer.setAttribute("role", "region");
    descriptionContainer.setAttribute("aria-label", "Canvas Description");
    const p = document.createElement("p");
    p.setAttribute("id", `${cnvId}_fallbackDesc`);
    descriptionContainer.append(p);
    this.canvas.append(descriptionContainer);
    return descriptionContainer;
};
const $9e35468b3662e610$var$fallbackDescId = "_fallbackDesc";
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_describeHTML", (base)=>function(type, text) {
        const cnvId = this.canvas.id;
        const describeId = `#${cnvId}_Description`;
        if (type === "fallback") {
            if (!this.dummyDOM.querySelector(describeId)) {
                const fallback = this._createDescriptionContainer().querySelector(`#${cnvId}_fallbackDesc`);
                fallback.innerHTML = text;
            } else base.call(this, type, text);
            //if the container for the description exists
            this.descriptions.fallback = this.dummyDOM.querySelector(`#${cnvId}${$9e35468b3662e610$var$fallbackDescId}`);
            this.descriptions.fallback.innerHTML = text;
        }
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_describeElementHTML", (base)=>function(type, name, text) {
        const cnvId = this.canvas.id;
        if (type === "fallback" && !this.dummyDOM.querySelector(`#${cnvId}_Description`)) this._createDescriptionContainer();
        base.call(this, type, name, text);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_createOutput", (base)=>function(type, display) {
        const cnvId = this.canvas.id;
        if (!this.dummyDOM) this.dummyDOM = document.getElementById(cnvId).parentNode;
        if ((type === "textOutput" || type === "gridOutput") && !this.dummyDOM.querySelector(`#${cnvId}accessibleOutput${display}`)) this._createDescriptionContainer();
        base.call(this, type, display);
    });
p5.prototype.registerMethod("post", function() {
    if (this.text_output || this.grid_output) this._updateAccsOutput();
});
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    url: {
        get: function() {
            return this.getURL();
        }
    },
    url_path: {
        get: function() {
            return this.getURLPath();
        }
    },
    url_params: {
        get: function() {
            return this.getURLParams();
        }
    },
    log: {
        set: function(val) {
            this.print(val);
        }
    },
    text_output: {
        get: function() {
            return this._accessibleOutputs.text;
        },
        set: function(val) {
            if (val === true) this.textOutput();
            else this.textOutput(val);
        }
    }
});




/**
 * Clears the pixels within a buffer. This element only clears the canvas.
 * It will not clear objects created by create_x() functions such as
 * create_video() or create_div().
 * Unlike the main graphics context, pixels in additional graphics areas created
 * with create_graphics() can be entirely
 * or partially transparent. This element clears everything to make all of
 * the pixels 100% transparent.
 *
 * Note: In WebGL mode, this element can have attributes set to normalized RGBA
 * color values in order to clear the screen to a specific color.
 * In addition to color, it will also clear the depth buffer.
 * If you are not using the webGL renderer these color values will have no
 * effect.
 *
 * @element clear
 * @attribute {Number} r normalized red val.
 * @attribute {Number} g normalized green val.
 * @attribute {Number} b normalized blue val.
 * @attribute {Number} a normalized alpha val.
 */ class $6dd9f8b96c98a786$var$Clear extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    static overloads = [
        "",
        "r, g, b, a"
    ];
}
customElements.define("p-clear", $6dd9f8b96c98a786$var$Clear);
/**
 * The ```<paint-bucket>``` element fills the canvas with a particular color or
 * image.
 *
 * @element paint-bucket
 * @attribute {p5.Color} color  any value created by the <a href="#/p5/color">color
 * @attribute {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex
 * @attribute {Number} [a]         opacity of the background relative to current
 *                             color range (default is 0-255)
 * @attribute {Number} gray   specifies a value between white and black
 * @attribute {Number} v1     red or hue value (depending on the current color
 *                        mode)
 * @attribute {Number} v2     green or saturation value (depending on the current
 *                        color mode)
 * @attribute {Number} v3     blue or brightness value (depending on the current
 *                        color mode)
 * @attribute  {Number[]}      values  an array containing the red, green, blue
 *                                 and alpha components of the color
 * @attribute {p5.Image} image    image loaded via an ```<asset>``` (must be
 *                                  same size as the sketch window)
 */ class $6dd9f8b96c98a786$var$PaintBucket extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    static overloads = [
        "c",
        "colorstring, [a]",
        "gray, [a]",
        "v1, v2, v3, [a]"
    ];
    renderFunctionName = "background";
}
customElements.define("p-paint-bucket", $6dd9f8b96c98a786$var$PaintBucket);




(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    animate: {
        get: function() {
            return this.isLooping();
        },
        set: function(val) {
            if (val) this.loop();
            else this.noLoop();
        }
    },
    remove_canvas: {
        get: function() {
            return false;
        },
        set: function() {
            this.remove();
        }
    }
});



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("selectAll", "removeElements", "createDiv", "createP", "createSpan", "createImg", "createA", "createSlider", "createButton", "createCheckbox", "createSelect", "createRadio", "createColorPicker", "createInput", "createFileInput", "createVideo", "createAudio", "createCapture", "createElement");



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createCanvas", "createGraphics");



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("deviceOrientation", "turnAxis", "keyIsDown");
//  TODO - test on mobile device
p5.prototype.device_moved = false;
//  TODO - test on mobile device
p5.prototype.device_turned = false;
p5.prototype.mouse_down = false;
p5.prototype.mouse_up = false;
p5.prototype.mouse_dragging = false;
p5.prototype.mouse_double_clicked = false;
p5.prototype._mouseWheel = 0;
p5.prototype.key_down = false;
p5.prototype.key_up = false;
//  TODO - test on mobile device
p5.prototype.touch_started = false;
p5.prototype.touch_moved = false;
p5.prototype.touch_ended = false;
p5.prototype._startAngleZ;
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_handleMotion", (base)=>function() {
        base.call(this);
        this._setProperty("deviced_moved", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onmousedown", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("mouse_down", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ondbclick", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("mouse_double_clicked", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onmousemove", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_moved", this.mouseIsPressed);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onwheel", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("_mouseWheel", this._mouseWheelDeltaY);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onkeyup", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("key_up", true);
        this._setProperty("key_held", false);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_onkeydown", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("key_down", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ontouchbase", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_started", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ontouchmove", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_moved", true);
    });
(0, $1b3618ac1b6555cf$export$e00416b3cd122575)("_ontouchend", (base)=>function(e) {
        base.call(this, e);
        this._setProperty("touch_ended", true);
    });
p5.prototype.registerMethod("pre", function() {
    this._setProperty("mouse_up", this.mouseIsPressed == false && this.mouse_held == true);
    this._setProperty("mouse_held", this.mouseIsPressed);
    this._setProperty("key_held", this.key_down);
});
p5.prototype.registerMethod("post", function() {
    this._setProperty("device_moved", false);
    this._setProperty("mouse_down", false);
    this._setProperty("mouse_double_clicked", false);
    this._setProperty("_mouseWheel", false);
    this._setProperty("key_up", false);
    this._setProperty("key_down", false);
    this._setProperty("touch_started", false);
    this._setProperty("touch_moved", false);
    this._setProperty("touch_ended", false);
});
//  Create properties with default value
p5.prototype._moveThreshold = 0.5;
p5.prototype._shakeThreshold = 30;
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    //  TODO - test on mobile device
    device_turned: {
        get: function() {
            if (this.rotationX === null && this.rotationY === null && this.rotationZ === null) return false;
            return this.rotationX !== this.pRotationX || this.rotationY !== this.pRotationY || this.rotationZ !== this.pRotationZ;
        }
    },
    key_code: {
        get: function() {
            return this.keyCode;
        }
    },
    mouse_wheel: {
        get: function() {
            return this._mouseWheel;
        }
    },
    move_threshold: {
        get: function() {
            return this._moveThreshold;
        },
        set: function(val) {
            this.setMoveThreshold(val);
        }
    },
    pointer_lock_request: {
        get: function() {
            return document.pointerLockElement === this._curElement.elt;
        },
        set: function(val) {
            if (val) this.requestPointerLock();
            else this.exitPointerLock();
        }
    },
    shake_threshold: {
        get: function() {
            return this._shakeThreshold;
        },
        set: function(val) {
            this.setShakeThreshold(val);
        }
    }
});



(0, $1b3618ac1b6555cf$export$49218a2feaa1d459)("createWriter");
(0, $1b3618ac1b6555cf$export$b61bda4fbca264f2)({
    http_post: {
        set: function() {
            this.httpPost(...arguments);
        }
    },
    http_do: {
        set: function() {
            this.httpDo(...arguments);
        }
    },
    save_file: {
        set: function() {
            this.save(...arguments);
        }
    },
    save_json_file: {
        set: function() {
            this.saveJSON(...arguments);
        }
    },
    save_strings_file: {
        set: function() {
            this.saveStrings(...arguments);
        }
    },
    save_table_file: {
        set: function() {
            this.saveTable(...arguments);
        }
    }
});





/**
 * Draw an image to the canvas.
 *
 * This element can be used with different numbers of attributes. The
 * simplest use requires only three attributes: img, x, and y—where (x, y) is
 * the position of the image. Two more attributes can optionally be added to
 * specify the width and height of the image.
 *
 * This element can also be used with eight Number attributes. To
 * differentiate between all these attributes, p5.js uses the language of
 * "destination rectangle" (which corresponds to "dx", "dy", etc.) and "source
 * image" (which corresponds to "sx", "sy", etc.) below. Specifying the
 * "source image" dimensions can be useful when you want to display a
 * subsection of the source image instead of the whole thing.
 *
 * This element can also be used to draw images without distorting the original aspect ratio,
 * by adding 9th attribute, fit, which can either be COVER or CONTAIN.
 * CONTAIN, as the name suggests, contains the whole image within the specified destination box
 * without distorting the image ratio.
 * COVER covers the entire destination box.
 */ class $02ce2aae2c2d2607$var$Image extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    #image_mode = (0, $0c9e79e2e9aa197e$export$1a988e7317c65621).CORNER;
    #tint = (0, $0c9e79e2e9aa197e$export$1a988e7317c65621).NONE;
    static overloads = [
        "img, x, y, [width], [height]",
        "img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign]", 
    ];
    /**
   * Sets the fill value for displaying images. Images can be tinted to
   * specified colors or made transparent by including an alpha value.
   *
   * To apply transparency to an image without affecting its color, use
   * white as the tint color and specify an alpha value. For instance,
   * tint(255, 128) will make an image 50% transparent (assuming the default
   * alpha range of 0-255, which can be changed with color_mode.
   *
   * The value for the gray parameter must be less than or equal to the current
   * maximum value as specified by color_mode. The default maximum value is
   * 255.
   *
   * @type {p5.Color}
   */ get tint() {
        return this.#tint;
    }
    set tint(val) {
        if (val === (0, $0c9e79e2e9aa197e$export$1a988e7317c65621).NONE) this.pInst.noTint();
        else if (val instanceof p5.Color) this.pInst.tint(val);
        else this.pInst.tint(...val);
        this.#tint = this.pInst.color(this.pInst._renderer._tint);
    }
    /**
   * Set image mode. Modifies the location from which images are drawn by
   * changing the way in which an image's properties are interpreted.
   * The default mode is image_mode="CORNER", which interprets x and
   * y as the upper-left corner of the image.
   *
   * image_mode="CORNERS" interprets x and y
   * as the location of one corner, and width and height as the
   * opposite corner.
   *
   * image_mode="CENTER" interprets x and y
   * as the image's center point.
   * @type {CORNER|CORNERS|CENTER}
   */ get image_mode() {
        return this.#image_mode;
    }
    set image_mode(val) {
        this.pInst.imageMode(val);
        this.#image_mode = val;
    }
}
customElements.define("p-image", $02ce2aae2c2d2607$var$Image);






p5.prototype.DEFAULT = "default";
p5.prototype.AMBIENT = "ambient";
p5.prototype.SPECULAR = "specular";
p5.prototype.EMISSIVE = "emissive";
const $813871a5b290df44$export$f7627f06e20bd00e = (baseClass)=>class extends baseClass {
        #ambient_material;
        #emissive_material;
        #shininess;
        #specular_material;
        #no_lights;
        /**
     * Sets the ambient color of the material.
     *
     * The ambient_material color is the color the object will reflect
     * under **any** lighting.
     *
     * Consider an ambient_material with the color yellow (255, 255, 0).
     * If the light emits the color white (255, 255, 255), then the object
     * will appear yellow as it will reflect the red and green components
     * of the light. If the light emits the color red (255, 0, 0), then
     * the object will appear red as it will reflect the red component
     * of the light. If the light emits the color blue (0, 0, 255),
     * then the object will appear black, as there is no component of
     * the light that it can reflect.
     * @type {p5.Color}
     */ get ambient_material() {
            return this.#ambient_material;
        }
        set ambient_material(val) {
            if (Array.isArray(val)) this.pInst.ambientMaterial(...val);
            else this.pInst.ambientMaterial(val);
            this.#ambient_material = this.pInst.color(val);
        }
        /**
     * Sets the emissive color of the material.
     *
     * An emissive material will display the emissive color at
     * full strength regardless of lighting. This can give the
     * appearance that the object is glowing.
     *
     * Note, "emissive" is a misnomer in the sense that the material
     * does not actually emit light that will affect surrounding objects.
     *
     * @type {p5.Color}
     */ get emissive_material() {
            return this.#emissive_material;
        }
        set emissive_material(val) {
            if (Array.isArray(val)) this.pInst.emissiveMaterial(...val);
            else this.pInst.emissiveMaterial(val);
            this.#ambient_material = this.pInst.color(val);
        }
        /**
     * Sets the current material as a normal material.
     *
     * A normal material is not affected by light. It is often used as
     * a placeholder material when debugging.
     *
     * Surfaces facing the X-axis become red, those facing the Y-axis
     * become green, and those facing the Z-axis become blue.
     *
     * @type {boolean}
     */ get normal_material() {
            return this.pInst._renderer.useNormalMaterial;
        }
        set normal_material(val) {
            if (val) this.pInst.normalMaterial();
        }
        /**
     * Sets the <a href="#/p5.Shader">p5.Shader</a> object to
     * be used to render subsequent shapes.
     *
     * Custom shaders can be created using the
     * create_shader() method and
     * ```<shader>``` element.
     *
     * Set shader="DEFAULT" to restore the default shaders.
     *
     * Note, shaders can only be used in WEBGL mode.
     * @type {p5.Shader}
     */ get shader() {
            return [
                this.pInst._renderer.userStrokeShader,
                this.pInst._renderer.userFillShader, 
            ];
        }
        set shader(val) {
            const { pInst: pInst  } = this;
            if (val === pInst.DEFAULT) pInst.resetShader();
            else pInst.shader(val);
        }
        /**
     * Sets the amount of gloss ("shininess") of a
     * specular_material.
     *
     * The default and minimum value is 1.
     * @type {number}
     * */ get shininess() {
            return this.#shininess;
        }
        set shininess(val) {
            this.pInst.shininess(val);
            this.#shininess = val;
        }
        /**
     * Sets the specular color of the material.
     *
     * A specular material is reflective (shiny). The shininess can be
     * controlled by the shininess property.
     *
     * Like ambient_material,
     * the specular_material color is the color the object will reflect
     * under ```<ambient-light>```.
     * However unlike ambient_material, for all other types of lights
     * ```<directional-light>```,
     * ```<point-light>```,
     * ```spot-light>```,
     * a specular material will reflect the **color of the light source**.
     * This is what gives it its "shiny" appearance.
     *
     * @type {p5.Color}
     */ get specular_material() {
            return this.#specular_material;
        }
        set specular_material(val) {
            if (Array.isArray(val)) this.pInst.specularMaterial(...val);
            else this.pInst.specularMaterial(val);
            this.#specular_material = this.pInst.color(val);
        }
        /**
     * Sets the texture that will be used to render subsequent shapes.
     *
     * A texture is like a "skin" that wraps around a 3D geometry. Currently
     * supported textures are images, video, and offscreen renders.
     *
     * To texture a geometry created by a ```<shape>``` element,
     * you will need to specify uv coordinates in ```<vertex>``` element.
     *
     * Note, texture can only be used in WEBGL mode.
     *
     * @type {p5.Image|p5.MediaElement|p5.Graphics|p5.Texture}
     */ get texture() {
            return this.pInst._renderer._tex;
        }
        set texture(val) {
            this.pInst.texture(val);
        }
        /**
     * Sets the coordinate space for texture mapping. The default mode is IMAGE
     * which refers to the actual coordinates of the image.
     * NORMAL refers to a normalized space of values ranging from 0 to 1.
     *
     * With IMAGE, if an image is 100×200 pixels, mapping the image onto the
     * entire
     * size of a quad would require the points (0,0) (100, 0) (100,200) (0,200).
     * The same mapping in NORMAL is (0,0) (1,0) (1,1) (0,1).
     *
     * @type {IMAGE|NORMAL}
     */ get texture_mode() {
            return this.pInst._renderer.textureMode;
        }
        set texture_mode(val) {
            this.pInst.textureMode(val);
        }
        /**
     * Sets the global texture wrapping mode. This controls how textures behave
     * when their uv's go outside of the 0 to 1 range. There are three options:
     * CLAMP, REPEAT, and MIRROR.
     *
     * CLAMP causes the pixels at the edge of the texture to extend to the bounds.
     * REPEAT causes the texture to tile repeatedly until reaching the bounds.
     * MIRROR works similarly to REPEAT but it flips the texture with every new tile.
     *
     * REPEAT & MIRROR are only available if the texture
     * is a power of two size (128, 256, 512, 1024, etc.).
     *
     * This method will affect all textures in your sketch until another element
     * sets texture_mode.
     *
     * If only one value is provided, it will be applied to both the
     * horizontal and vertical axes.
     * @type {[CLAMP|REPEAT|MIRROR, CLAMP|REPEAT|MIRROR]}
     */ get texture_wrap() {
            return [
                this.pInst._renderer.textureWrapX,
                this.pInst._renderer.textureWrapY, 
            ];
        }
        set texture_wrap(val) {
            if (Array.isArray(val)) this.pInst.textureWrap(...val);
            else this.pInst.textureWrap(val);
        }
        /**
     * Removes all lights present in a sketch.
     *
     * All subsequent geometry is rendered without lighting (until a new
     * light is created with a lighting element (
     * ```<lights>```,
     * ```<ambient-light>```,
     * ```<directional-light>```,
     * ```<point-light>```,
     * ```<spot-light>```).
     * @type {boolean}
     */ get no_lights() {
            return this.#no_lights;
        }
        set no_lights(val) {
            this.#no_lights = val;
            if (val == true) this.pInst.noLights();
        }
    };
class $813871a5b290df44$export$c1b6c06f00a3c53a extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    draw(inherited) {
        //  Set no_lights to false so that children won't delete this light
        super.draw({
            ...inherited,
            no_lights: false
        });
    }
}
const $813871a5b290df44$export$fe226f30800ca89d = (baseClass)=>class extends baseClass {
        #specular_color;
        /**
     * Sets the color of the specular highlight of a non-ambient light
     * (i.e. all lights except ```<ambient-light>```).
     *
     * specular_color affects only the lights which are created by
     * this element or its children
     *
     * This property is used in combination with
     * <a href="#/p5/specularMaterial">specularMaterial()</a>.
     * If a geometry does not use specular_material, this property
     * will have no effect.
     *
     * The default color is white (255, 255, 255), which is used if
     * specular_color is not explicitly set.
     *
     * Note: specular_color is equivalent to the Processing function
     * <a href="https://processing.org/reference/lightSpecular_.
     * html">lightSpecular</a>.
     *
     * @type {p5.Color}
     */ get specular_color() {
            return this.#specular_color;
        }
        set specular_color(val) {
            const { pInst: pInst  } = this;
            const c = Array.isArray(val) ? pInst.color(...val) : pInst.color(val);
            pInst.specularColor(c);
            this.#specular_color = c;
        }
    };
const $813871a5b290df44$export$ebd05637ed7f2471 = (baseClass)=>class extends baseClass {
        #light_falloff;
        /**
     * Sets the falloff rate for ```<point-light>```
     * and ```<spot-light>```.
     *
     * light_falloff affects only this element and its children.
     *
     * The values are `constant`, `linear`, an `quadratic` and are used to calculate falloff as follows:
     *
     * d = distance from light position to vertex position
     *
     * falloff = 1 / (CONSTANT + d \* LINEAR + (d \* d) \* QUADRATIC)
     * @type {[number, number, number]}
     */ get light_falloff() {
            return this.#light_falloff;
        }
        set light_falloff([constant, linear, quadratic]) {
            const { pInst: pInst  } = this;
            pInst.lightFalloff(constant, linear, quadratic);
            this.#light_falloff = [
                pInst._renderer.constantAttenuation,
                pInst._renderer.linearAttenuation,
                pInst._renderer.quadraticAttenuation, 
            ];
        }
    };
const $813871a5b290df44$export$7757a7d90505b04a = (baseClass)=>class extends baseClass {
        #rect_mode;
        /**
     * Modifies the location from which rectangles are drawn by changing the way
     * in which x and y coordinates are interpreted.
     *
     * The default mode is CORNER, which interprets the x and y as the
     * upper-left corner of the shape.
     *
     * rect_mode="CORNERS" interprets x and y as the location of
     * one of the corners, and width and height as the location of
     * the diagonally opposite corner. Note, the rectangle is drawn between the
     * coordinates, so it is not necessary that the first corner be the upper left
     * corner.
     *
     * rect_mode="CENTER" interprets x and y as the shape's center
     * point.
     *
     * rect_mode="RADIUS" also uses x and y as the shape's
     * center
     * point, but uses width and height to specify half of the shape's
     * width and height respectively.
     *
     * The value to this property must be written in ALL CAPS because they are
     * predefined as constants in ALL CAPS.
     *
     * @type {CORNER|CORNERS|CENTER|RADIUS}
     */ get rect_mode() {
            return this.#rect_mode;
        }
        set rect_mode(mode) {
            this.pInst.rectMode(mode);
            this.#rect_mode = this.pInst._renderer._rectMode;
        }
    };
const $813871a5b290df44$export$8ef92d1c9f18c818 = (baseClass)=>class extends baseClass {
        #smooth = false;
        /**
     * smooth="true" draws all geometry with smooth (anti-aliased) edges. smooth="true" will also
     * improve image quality of resized images. On a 3D canvas, smooth is false
     * by default, so it is necessary to set smooth="true" if you would like
     * smooth (antialiased) edges on your geometry.
     * @type {boolean}
     */ get smooth() {
            return this.#smooth;
        }
        set smooth(val) {
            if (typeof val !== "boolean") return console.error(`${this.tagName}'s smooth property is being set to ${val}, but it may only be set to true or false.`);
            if (val) this.pInst.smooth();
            else this.pInst.noSmooth();
            this.#smooth = val;
        }
    };





const $c493a79ac67d47b1$export$512a862c62a0defc = (baseClass)=>class extends baseClass {
        #align = [
            p5.prototype.LEFT,
            p5.prototype.BASELINE
        ];
        #leading = 15;
        #font = "sans-serif";
        #font_size = 12;
        #style = p5.prototype.NORMAL;
        #wrap = p5.prototype.WORD;
        /**
     * Sets the current alignment for drawing text. Accepts two
     * values:
     * - first: horizontal alignment (LEFT, CENTER, or RIGHT)
     * - scond: vertical alignment (TOP, BOTTOM, CENTER, or BASELINE).
     *
     * So if you set align="LEFT", you are aligning the left
     * edge of your text to this element's x-coordinate.
     * If you write align="RIGHT, TOP", you are aligning the right edge
     * of your text to this element's x-coordinate and the top edge of the text
     * to this element's y-coordinate.
     * @type {[LEFT|CENTER|RIGHT, TOP|BOTTOM|CENTER|BASELINE]}
     */ get align() {
            return this.#align;
        }
        set align(val) {
            if (Array.isArray(val)) this.pInst.textAlign(...val);
            else this.pInst.textAlign(val);
            this.#align = [
                this.pInst._renderer._textAlign,
                this.pInst._renderer._textBaseline, 
            ];
        }
        /**
     * Sets the spacing, in pixels, between lines of text.
     * @type {number}
     */ get leading() {
            return this.#leading;
        }
        set leading(val) {
            this.pInst.textLeading(val);
            this.#leading = this.pInst._renderer._textLeading;
        }
        /**
     * The current font used by this element. This may be set to a font loaded
     * with load_font() or a string representing a
     * <a href="https://mzl.la/2dOw8WD">web safe font</a>.
     * @type {p5.Font}
     */ get font() {
            return this.#font;
        }
        set font(val) {
            this.pInst.textFont(val);
            this.#font = this.pInst._renderer._textFont;
        }
        /**
     * The font size in pixels.
     * @type {number}
     */ get font_size() {
            return this.#font_size;
        }
        set font_size(val) {
            this.pInst.textSize(val);
            this.#font_size = this.pInst._renderer._textSize;
        }
        /**
     * The style for text.
     * @type {NORMAL|ITALIC|BOLDITALIC}
     */ get style() {
            return this.#style;
        }
        set style(val) {
            this.pInst.textStyle(val);
            this.#style = this.pInst._renderer._textStyle;
        }
        /**
     * Specifies how lines of text are wrapped within a text box. This requires
     * width to be set on this element.
     *
     * WORD wrap style only breaks lines at spaces. A single string without spaces
     * that exceeds the boundaries of the canvas or text area is not truncated,
     * and will overflow the desired area, disappearing at the canvas edge.
     *
     * CHAR wrap style breaks lines wherever needed to stay within the text box.
     *
     * WORD is the default wrap style, and both styles will still break lines at
     * any line breaks specified in the original text. The text height property also
     * still applies to wrapped text in both styles, lines of text that do not fit
     * within the text area will not be drawn to the screen.
     * @type {WORD|CHAR}
     */ get wrap() {
            return this.#wrap;
        }
        set wrap(val) {
            this.pInst.textWrap(val);
            this.#wrap = this.pInst._renderer._textWrap;
        }
        /**
     * The ascent of the current font at its current size. The ascent represents the
     * distance, in pixels, of the tallest character above the baseline. (read-only)
     * @type {number}
     */ get ascent() {
            return this.pInst.textAscent();
        }
        /**
     * The descent of the current font at its current size. The descent represents the
     * distance, in pixels, of the character with the longest descender below the baseline.
     * (read-only)
     * @type {number}
     */ get descent() {
            return this.pInst.textDescent();
        }
    };


/**
 * Draws text on the ```<canvas>```. The content of the text may be specified
 * by setting the content property
 * ```xml
 * <text content="'Hello world'"></text>
 * ```
 * or by adding the content between the
 * element's start and end tags.
 * ```xml
 * <text>Hello world</text>
 * ```
 *
 * Change the color of the text with the fill property. Change
 * the outline of the text with the stroke and
 * stroke_weight properties.
 *
 * The text displays in relation to the <a href="#/p5/textAlign">textAlign()</a>
 * function, which gives the option to draw to the left, right, and center of the
 * coordinates.
 *
 * The width and height properties, if specified, define a rectangular area to display within and
 * may only be used with string data. When these properties are specified,
 * they are interpreted based on the current rect_mode
 * setting. Text that does not fit completely within the rectangle specified will
 * not be drawn to the screen. If width and height are not specified, the baseline
 * alignment is the default, which means that the text will be drawn upwards
 * from x and y.
 * @element text
 */ class $c05bfa4f8cdcd41a$var$Text extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $c493a79ac67d47b1$export$512a862c62a0defc)((0, $f2731110a32ba8b7$export$1caa28391933d750)((0, $2097739565d80955$export$cd9f7ba93ec6c49f)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))))))) {
    static overloads = [
        "content, x, y, [width], [height]"
    ];
}
customElements.define("p-text", $c05bfa4f8cdcd41a$var$Text);
const $c05bfa4f8cdcd41a$var$addFont3D = (baseClass)=>class extends baseClass {
        /**
     * The current font used by this element. This must be loaded
     * with load_font().
     * @type {p5.Font}
     */ get font() {
            return super.font;
        }
    };
/**
 * Draws text on the ```<canvas-3d>```. The content of the text may be specified
 * by setting the content property
 * ```xml
 * <text content="'Hello world'"></text>
 * ```
 * or by adding the content between the
 * element's start and end tags.
 * ```xml
 * <text>Hello world</text>
 * ```
 *
 * Change the color of the text with the fill property. Text on a 3D canvas does not
 * have a stroke property.
 *
 * The text displays in relation to the <a href="#/p5/textAlign">textAlign()</a>
 * function, which gives the option to draw to the left, right, and center of the
 * coordinates.
 *
 * The width and height properties, if specified, define a rectangular area to display within and
 * may only be used with string data. When these properties are specified,
 * they are interpreted based on the current rect_mode
 * setting. Text that does not fit completely within the rectangle specified will
 * not be drawn to the screen. If width and height are not specified, the baseline
 * alignment is the default, which means that the text will be drawn upwards
 * from x and y.
 * @element text
 */ class $c05bfa4f8cdcd41a$var$Text3D extends (0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$2a83b8e39b618423)($c05bfa4f8cdcd41a$var$addFont3D((0, $c493a79ac67d47b1$export$512a862c62a0defc)((0, $2097739565d80955$export$7d759072b2be4e22)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $03bbbf8eda9a336e$export$f5ddaad6515de8cc)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))))))))) {
    static overloads = [
        "content, x, y, [width], [height]"
    ];
}
customElements.define("p-text-3d", $c05bfa4f8cdcd41a$var$Text3D);










class $0cebf34523a0dd8b$var$WebGLGeometry extends (0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $2097739565d80955$export$7d759072b2be4e22)((0, $3a08fcf437e8d724$export$bc17fd552ac7bdac)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))))) {
}
class $0cebf34523a0dd8b$var$Normal extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    static overloads = [
        "vector",
        "x, y, z"
    ];
}
customElements.define("p-normal", $0cebf34523a0dd8b$var$Normal);
class $0cebf34523a0dd8b$var$Plane extends (0, $f2731110a32ba8b7$export$5f4909ba2c08017a)($0cebf34523a0dd8b$var$WebGLGeometry) {
    static overloads = "[width], [height], [detail_x], [detail_y]";
}
customElements.define("p-plane", $0cebf34523a0dd8b$var$Plane);
class $0cebf34523a0dd8b$var$Box extends (0, $f2731110a32ba8b7$export$5f4909ba2c08017a)($0cebf34523a0dd8b$var$WebGLGeometry) {
    static overloads = [
        "[width], [height], [depth], [detail_x], [detail_y]"
    ];
}
customElements.define("p-box", $0cebf34523a0dd8b$var$Box);
class $0cebf34523a0dd8b$var$Sphere extends $0cebf34523a0dd8b$var$WebGLGeometry {
    static overloads = [
        "[radius], [detail_x], [detail_y]"
    ];
}
customElements.define("p-sphere", $0cebf34523a0dd8b$var$Sphere);
class $0cebf34523a0dd8b$var$Cylinder extends $0cebf34523a0dd8b$var$WebGLGeometry {
    static overloads = [
        "[radius], [height], [detail_x], [detail_y], [bottomCap], [topCap]", 
    ];
}
customElements.define("p-cylinder", $0cebf34523a0dd8b$var$Cylinder);
class $0cebf34523a0dd8b$var$Cone extends $0cebf34523a0dd8b$var$WebGLGeometry {
    static overloads = [
        "[radius], [height], [detail_x], [detail_y], [cap]"
    ];
}
customElements.define("p-cone", $0cebf34523a0dd8b$var$Cone);
class $0cebf34523a0dd8b$var$Ellipsoid extends $0cebf34523a0dd8b$var$WebGLGeometry {
    static overloads = [
        "[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]", 
    ];
}
customElements.define("p-ellipsoid", $0cebf34523a0dd8b$var$Ellipsoid);
class $0cebf34523a0dd8b$var$Torus extends $0cebf34523a0dd8b$var$WebGLGeometry {
    static overloads = [
        "[radius], [tubeRadius], [detailX], [detailY]"
    ];
}
customElements.define("p-torus", $0cebf34523a0dd8b$var$Torus);
//  TODO - test when preload implemented
class $0cebf34523a0dd8b$var$LoadModel extends (0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33) {
    static overloads = [
        "path, normalize, [successCallback], [failureCallback], [fileType]",
        "path, [successCallback], [failureCallback], [fileType]", 
    ];
}
customElements.define("p-load-model", $0cebf34523a0dd8b$var$LoadModel);
class $0cebf34523a0dd8b$var$Model extends $0cebf34523a0dd8b$var$WebGLGeometry {
    static overloads = [
        "model"
    ];
}
customElements.define("p-model", $0cebf34523a0dd8b$var$Model);
const $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName = (baseClass)=>class extends baseClass {
        constructor(){
            super();
            this.renderFunctionName = this.renderFunctionName.slice(0, -2);
        }
    };
const $0cebf34523a0dd8b$var$addDetail = (baseClass)=>class extends baseClass {
        #detail = 25;
        /**
     * specifies the number of vertices that makes up the perimeter of the shape.
     * Default value is 25. Won't draw a stroke for a detail of more than 50.
     * @type {Integer}
     */ get detail() {
            return this.#detail;
        }
        set detail(val) {
            this.#detail = val;
        }
    };
const $0cebf34523a0dd8b$var$addDetailXY = (baseClass)=>class extends baseClass {
        #detail_x = 2;
        #detail_y = 2;
        /**
     * number of segments in the x-direction
     * @type {Integer}
     */ get detail_x() {
            return this.#detail_x;
        }
        set detail_x(val) {
            this.#detail_x = val;
        }
        /**
     * number of segments in the y-direction
     * @type {Integer}
     */ get detail_y() {
            return this.#detail_y;
        }
        set detail_y(val) {
            this.#detail_y = val;
        }
    };
/**
 * Draws an arc onto a ```<canvas-3d>```.
 * The origin may be changed with the ellipse_mode property.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever
 * stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
 * does not change where they fall. If both start and stop fall at the same
 * place, a full ellipse will be drawn. Be aware that the y-axis increases in
 * the downward direction, therefore angles are measured clockwise from the
 * positive x-direction ("3 o'clock").
 * @element arc-3d
 */ class $0cebf34523a0dd8b$var$Arc3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f83208cc1173e373$export$761535d4bf6998ba)($0cebf34523a0dd8b$var$addDetail((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))))) {
    static overloads = [
        "x, y, width, height, start_angle, stop_angle, [mode], [detail]", 
    ];
}
customElements.define("p-arc-3d", $0cebf34523a0dd8b$var$Arc3D);
class $0cebf34523a0dd8b$var$Base2DTo3D extends (0, $2097739565d80955$export$7d759072b2be4e22)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
}
/**
 * Draws an ellipse (oval) onto a ```<canvas-3d>```. If no height is specified, the
 * value of width is used for both the width and height. If a
 * negative height or width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle. The origin may be
 * changed with the ellipseMode() function.
 * @element ellipse-3d
 */ class $0cebf34523a0dd8b$var$Ellipse3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)($0cebf34523a0dd8b$var$Base2DTo3D)))) {
    static overloads = [
        "x, y, width, [height], [detail]"
    ];
}
customElements.define("p-ellipse-3d", $0cebf34523a0dd8b$var$Ellipse3D);
/**
 * Draws a circle onto a ```<canvas-3d>```. A circle is a simple closed shape. It is the
 * set of all points in a plane that are at a given distance from a given
 * point, the center.
 * @element circle
 */ class $0cebf34523a0dd8b$var$Circle3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f83208cc1173e373$export$115022717b09ec84)((0, $063b9c440f4a940f$export$306219eb761ac4c2)($0cebf34523a0dd8b$var$Base2DTo3D)))) {
    static overloads = [
        "x, y, diameter"
    ];
}
customElements.define("p-circle-3d", $0cebf34523a0dd8b$var$Circle3D);
/**
 * Draws a line (a direct path between two points) onto a ```<canvas-3d>```. Its width
 * can be modified by using the stroke_weight property. A line cannot be
 * filled, therefore the fill_color property will not affect the color of a
 * line. So to color a line, use the stroke property.
 * @element line-3d
 */ class $0cebf34523a0dd8b$var$Line3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$604ef710b341881f)((0, $f2731110a32ba8b7$export$81fbedce0d6f2624)((0, $063b9c440f4a940f$export$b2e29383819ac3c4)($0cebf34523a0dd8b$var$Base2DTo3D)))) {
    static overloads = [
        "x1, y1, z1, x2, y2, z2"
    ];
}
customElements.define("p-line-3d", $0cebf34523a0dd8b$var$Line3D);
/**
 * Draws a point, a coordinate in space at the dimension of one pixel onto a ```<canvas-3d>```.
 * The color of the point is changed with the stroke property. The size of
 * the point can be changed with the stroke_weight property.
 * @element point
 */ class $0cebf34523a0dd8b$var$Point3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $063b9c440f4a940f$export$b2e29383819ac3c4)($0cebf34523a0dd8b$var$Base2DTo3D))) {
    static overloads = [
        "x, y, z"
    ];
}
customElements.define("p-point-3d", $0cebf34523a0dd8b$var$Point3D);
/**
 * Draws a quad onto a ```<canvas-3d>```. A quad is a quadrilateral, a four-sided
 * polygon. It is similar to a rectangle, but the angles between its edges
 * are not constrained to ninety degrees. The x1 and y1 properties set the
 * first vertex and the subsequent pairs should proceed clockwise or
 * counter-clockwise around the defined shape.
 * @element quad
 */ class $0cebf34523a0dd8b$var$Quad3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$604ef710b341881f)((0, $f2731110a32ba8b7$export$81fbedce0d6f2624)((0, $f2731110a32ba8b7$export$fae99258cbe6a26a)((0, $f2731110a32ba8b7$export$e267bc9e857642fc)($0cebf34523a0dd8b$var$addDetailXY((0, $063b9c440f4a940f$export$306219eb761ac4c2)($0cebf34523a0dd8b$var$Base2DTo3D))))))) {
    static overloads = [
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, [detail_x], [detail_y]", 
    ];
}
customElements.define("p-quad-3d", $0cebf34523a0dd8b$var$Quad3D);
/**
 * Draws a rectangle onto a ```<canvas-3d>```. A rectangle is a four-sided closed shape
 * with every angle at ninety degrees. By default, the x and y properties
 * set the location of the upper-left corner, w sets the width, and h sets
 * the height. The way these properties are interpreted may be changed with
 * the rect_mode property.
 * @element rect
 */ class $0cebf34523a0dd8b$var$Rect3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$767c784c12981b7a)((0, $f2731110a32ba8b7$export$5f4909ba2c08017a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)($0cebf34523a0dd8b$var$Base2DTo3D)))) {
    static overloads = [
        "x, y, width, [height], [top_left_radius], [top_right_radius], [bottom_right_radius], [bottom_left_radius]", 
    ];
}
customElements.define("p-rect-3d", $0cebf34523a0dd8b$var$Rect3D);
/**
 * Draws a triangle onto a ```<canvas-3d>```. A triangle is a plane created by connecting
 * three points. x1 and y1 specify the first point, x2 and y2 specify the
 * second point, and x3 and y3 specify the
 * third point.
 * @element triangle
 */ class $0cebf34523a0dd8b$var$Triangle3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$604ef710b341881f)((0, $f2731110a32ba8b7$export$81fbedce0d6f2624)((0, $f2731110a32ba8b7$export$fae99258cbe6a26a)((0, $063b9c440f4a940f$export$306219eb761ac4c2)($0cebf34523a0dd8b$var$Base2DTo3D))))) {
    static overloads = [
        "x1, y1, z1, x2, y2, z2, x3, y3, z3"
    ];
}
customElements.define("p-triangle-3d", $0cebf34523a0dd8b$var$Triangle3D);
/**
 * Draws a cubic Bezier curve onto a ```<canvas-3d>```. These curves are defined by a
 * series of anchor and control points. x1 and y1 specify
 * the first anchor point and x4 and y4 specify the other
 * anchor point, which become the first and last points on the curve. (x2, y2)
 * and (x3, y3) specify the two control points which define the shape
 * of the curve. Approximately speaking, control points "pull" the curve
 * towards them.
 *
 * Bezier curves were developed by French automotive engineer Pierre Bezier,
 * and are commonly used in computer graphics to define gently sloping curves.
 * @element bezier-3d
 */ class $0cebf34523a0dd8b$var$Bezier3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$604ef710b341881f)((0, $f2731110a32ba8b7$export$81fbedce0d6f2624)((0, $f2731110a32ba8b7$export$fae99258cbe6a26a)((0, $f2731110a32ba8b7$export$e267bc9e857642fc)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $c3262cadfa7b9b02$export$a4b143f4d85e7bf7)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))))))))) {
    static overloads = [
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"
    ];
}
customElements.define("p-bezier-3d", $0cebf34523a0dd8b$var$Bezier3D);
/**
 * Draws a curved line onto a ```<canvas-3d>``` between two points,
 * given as (x2, y2) and (x3, y3).
 * (x1, y1) is a control point, as
 * if the curve came from this point even though it's not drawn. (x4, y4) similarly describes
 * the other control point.
 *
 * Longer curves can be created by putting a series of ```<curve-3d>``` elements
 * together or using ```<curve-vertex>```. The curve_tightness property provides control
 * for the visual quality of the curve.
 * The ```<curve>``` element is an implementation of Catmull-Rom splines.
 * @element curve
 */ class $0cebf34523a0dd8b$var$Curve3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$604ef710b341881f)((0, $f2731110a32ba8b7$export$81fbedce0d6f2624)((0, $f2731110a32ba8b7$export$fae99258cbe6a26a)((0, $f2731110a32ba8b7$export$e267bc9e857642fc)((0, $f2731110a32ba8b7$export$99f537b5fba70e67)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $c3262cadfa7b9b02$export$f9e88d76da73025c)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))))))))) {
    static overloads = [
        "x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4"
    ];
}
customElements.define("p-curve-3d", $0cebf34523a0dd8b$var$Curve3D);
/**
 * Use the ```<contour-3d>``` element to create negative shapes
 * within a ```<shape-3d>``` element such as the center of the letter 'O'.
 * The vertices of the ```<contour-3d>``` are defined by its
 * ```<vertex-3d>``` and ```<curve-vertex-3d>``` children.
 * The vertices that define a negative shape must "wind" in the opposite direction
 * from the exterior shape. First draw vertices for the exterior clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 *
 * This element must be a child of a ```<shape-3d>```.
 * @element contour
 */ class $0cebf34523a0dd8b$var$Contour3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))) {
    renderFunctionName = "beginContour";
    endRender() {
        this.pInst.endContour();
    }
}
customElements.define("p-contour-3d", $0cebf34523a0dd8b$var$Contour3D);
/**
 * Using the ```<shape-3d>``` element allow creating more
 * complex forms on a ```<canvas-3d>```.
 * The vertices of the shape are defined by its ```<vertex-3d>```,
 * ```<curve-vertex-3d>```, and/or ```<quadratic-vertex-3d>``` children.
 * The value of the kind property tells it which
 * types of shapes to create from the provided vertices. With no mode
 * specified, the shape can be any irregular polygon.
 *
 *
 * Transformations such as translate, angle, and scale do not work on children on ```<shape-3d>```.
 * It is also not possible to use other shapes, such as
 * ```<ellipse-3d>``` or ```<rect-3d>``` as children of ```<shape-3d>```.
 * @element shape-3d
 */ class $0cebf34523a0dd8b$var$Shape3D extends (0, $f83208cc1173e373$export$d11dd115fc87026)((0, $063b9c440f4a940f$export$306219eb761ac4c2)($0cebf34523a0dd8b$var$Base2DTo3D)) {
}
customElements.define("p-shape-3d", $0cebf34523a0dd8b$var$Shape3D);
const $0cebf34523a0dd8b$var$addUV = (baseClass)=>class extends baseClass {
        #u;
        #v;
        /**
     * the vertex's texture u-coordinate
     * @type {number}
     */ get u() {
            return this.#u;
        }
        set u(val) {
            this.#u = val;
        }
        /**
     * the vertex's texture v-coordinate
     * @type {number}
     */ get v() {
            return this.#v;
        }
        set v(val) {
            this.#v = val;
        }
    };
/**
 * All shapes are constructed by connecting a series of vertices. ```<vertex-3d>```
 * is used to specify the vertex coordinates for shapes on a ```<canvas-3d>```.
 * It is used exclusively as a child of the ```<shape-3d>``` element.
 * @element vertex
 */ class $0cebf34523a0dd8b$var$Vertex3D extends (0, $f2731110a32ba8b7$export$339b9be62e060004)($0cebf34523a0dd8b$var$addUV((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33))) {
    static overloads = [
        "x, y, z, [u], [v]"
    ];
}
customElements.define("p-vertex-3d", $0cebf34523a0dd8b$var$Vertex3D);
/**
 * Specifies vertex coordinates for quadratic Bezier curves on a ```<canvas-3d>```.
 * Each ```<quadratic-vertex-3d>```
 * defines the position of one control points and one
 * anchor point of a Bezier curve, adding a new segment to a line or shape.
 * The first ```<quadratic-vertex-3d>``` child of a ```<shape>``` element
 * must have a ```<vertex-3d>``` sibling above it to set the first anchor point.
 *
 * This element must be a child of a ```<shape-3d>``` element
 * and only when there is no MODE or POINTS property specified on the
 *  ```<shape-3d>```.
 */ class $0cebf34523a0dd8b$var$QuadraticVertex3D extends (0, $f2731110a32ba8b7$export$fae99258cbe6a26a)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)) {
    static overloads = [
        "cx, cy, cz, x3, y3, z3"
    ];
}
customElements.define("p-quadratic-vertex-3d", $0cebf34523a0dd8b$var$QuadraticVertex3D);
/**
 * Specifies vertex coordinates for curves. This function may only
 * be used as a child of the ```<shape-3d>``` element and only when there
 * is no MODE property specified on the ```<shape-3d>``.
 *
 * The first and last points in a series of ```<curve-vertex-3d>``` lines
 * will be used to
 * guide the beginning and end of the curve. A minimum of four
 * points is required to draw a tiny curve between the second and
 * third points. Adding a fifth point with ```<curve-vertex>``` will draw
 * the curve between the second, third, and fourth points. The
 * ```<curve-vertex>``` element is an implementation of Catmull-Rom
 * splines.
 */ class $0cebf34523a0dd8b$var$CurveVertex3D extends $0cebf34523a0dd8b$var$remove3DFromRenderFunctionName((0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $f2731110a32ba8b7$export$99f537b5fba70e67)((0, $063b9c440f4a940f$export$306219eb761ac4c2)((0, $813871a5b290df44$export$f7627f06e20bd00e)((0, $79ce0e365a23b6d5$export$66cca51e2e9c1a33)))))) {
    static overloads = [
        "x, y, z"
    ];
}
customElements.define("p-curve-vertex-3d", $0cebf34523a0dd8b$var$CurveVertex3D);





/**
 * Creates an ambient light with the given color.
 *
 * Ambient light does not come from a specific direction.
 * Objects are evenly lit from all sides. Ambient lights are
 * almost always used in combination with other types of lights.
 * @element ambient-light
 * @attribute {Number}   v1     red or hue value relative to the current color
 *                                range
 * @attribute {Number}   v2     green or saturation value relative to the
 *                                current color range
 * @attribute {Number}   v3     blue or brightness value relative to the current
 *                                color range
 * @attribute {Number}   alpha  alpha value relative to current color range
 *                                (default is 0-255)
 * @attribute {Number}   gray   number specifying value between
 *                                white and black
 * @attribute {String}   value  a color string
 * @attribute {Number[]} values an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @attribute {p5.Color} color  color as a <a
 *                                 href="https://p5js.org/reference/#/p5.Color"
 *                                 target="_blank">p5.Color</a>
 */ class $12bf7ff6c321610b$var$AmbientLight extends (0, $813871a5b290df44$export$c1b6c06f00a3c53a) {
    static overloads = [
        "v1, v2, v3, [alpha]",
        "gray, [alpha]",
        "value",
        "values",
        "color", 
    ];
}
customElements.define("p-ambient-light", $12bf7ff6c321610b$var$AmbientLight);
/**
 * Creates a directional light with the given color and direction.
 *
 * Directional light comes from one direction.
 * The direction is specified as numbers inclusively between -1 and 1.
 * For example, setting the direction as (0, -1, 0) will cause the
 * geometry to be lit from below (since the light will be facing
 * directly upwards). Similarly, setting the direction as (1, 0, 0)
 * will cause the geometry to be lit from the left (since the light
 * will be facing directly rightwards).
 *
 * Directional lights do not have a specific point of origin, and
 * therefore cannot be positioned closer or farther away from a geometry.
 *
 * A maximum of **5** directional lights can be active at once.
 */ class $12bf7ff6c321610b$var$DirectionalLight extends (0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a)) {
    static overloads = [
        "v1, v2, v3, x, y, z",
        "v1, v2, v3, direction",
        "color, x, y, z",
        "color, direction", 
    ];
}
customElements.define("p-directional-light", $12bf7ff6c321610b$var$DirectionalLight);
/**
 * Creates a point light with the given color and position.
 *
 * A point light emits light from a single point in all directions.
 * Because the light is emitted from a specific point (position),
 * it has a different effect when it is positioned farther vs. nearer
 * an object.
 *
 * A maximum of **5** point lights can be active at once.
 */ class $12bf7ff6c321610b$var$PointLight extends (0, $f2731110a32ba8b7$export$339b9be62e060004)((0, $063b9c440f4a940f$export$1c730bb33b0db09f)((0, $813871a5b290df44$export$ebd05637ed7f2471)((0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a))))) {
    static overloads = [
        "v1, v2, v3, x, y, z",
        "v1, v2, v3, position",
        "color, x, y, z",
        "color, position", 
    ];
}
customElements.define("p-point-light", $12bf7ff6c321610b$var$PointLight);
/**
 * Places an ambient and directional light in the scene.
 * The lights are set to <ambient-light v1="128" v2="128" v3="128"> and
 * <directional-light v1="128" v2="128" v3'="128" x="0" y="0" z="-1">.
 */ class $12bf7ff6c321610b$var$Lights extends (0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a)) {
    static overloads = [
        ""
    ];
}
customElements.define("p-lights", $12bf7ff6c321610b$var$Lights);
/**
 * Creates a spot light with the given color, position,
 * light direction, angle, and concentration.
 *
 * Like a ```<point-light>```, a ```<spot-light>```
 * emits light from a specific point (position). It has a different effect
 * when it is positioned farther vs. nearer an object.
 *
 * However, unlike a ```<point-light>```, the light is emitted in **one
 * direction**
 * along a conical shape. The shape of the cone can be controlled using
 * the `angle` and `concentration` parameters.
 *
 * The `angle` parameter is used to
 * determine the radius of the cone. And the `concentration`
 * parameter is used to focus the light towards the center of
 * the cone. Both parameters are optional, however if you want
 * to specify `concentration`, you must also specify `angle`.
 * The minimum concentration value is 1.
 *
 * A maximum of **5** spot lights can be active at once.
 */ class $12bf7ff6c321610b$var$SpotLight extends (0, $813871a5b290df44$export$ebd05637ed7f2471)((0, $813871a5b290df44$export$fe226f30800ca89d)((0, $813871a5b290df44$export$c1b6c06f00a3c53a))) {
    static overloads = [
        "v1, v2, v3, x, y, z, rx, ry, rz, [angle], [concentration]",
        "color, position, direction, [angle], [concentration]",
        "v1, v2, v3, position, direction, [angle], [concentration]",
        "color, x, y, z, direction, [angle], [concentration]",
        "color, position, rx, ry, rz, [angle], [concentration]",
        "v1, v2, v3, x, y, z, direction, [angle], [concentration]",
        "v1, v2, v3, position, rx, ry, rz, [angle], [concentration]",
        "color, x, y, z, rx, ry, rz, [angle], [concentration]", 
    ];
}
customElements.define("p-spot-light", $12bf7ff6c321610b$var$SpotLight);


"use strict";
const $cf838c15c8b009ba$var$customElementsDefined = new Event("customElementsDefined");
dispatchEvent($cf838c15c8b009ba$var$customElementsDefined);


//# sourceMappingURL=p5.marker.js.map
  