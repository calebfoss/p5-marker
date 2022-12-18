# \_

The blank <\_> element renders nothing to the canvas. This is useful
for adjusting attributes for child elements.

**Mixins:** P5Extension

## Properties

| Property                | Modifiers | Type    | Default                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderedAttributeNames` | readonly  | `array` |                                                                                                                                                                                                                                                                                                                                         |
| `pInst`                 | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `parent_element`        | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `persistent`            | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `proxy`                 |           | `this`  | "new Proxy(this, {\n get(target, prop) {\n if (prop in target) return target[prop];\n return target.#state[prop];\n },\n has(target, prop) {\n if (prop in target) return true;\n return prop in target.#state;\n },\n set(target, prop, val) {\n target.#updateFunctions.set(prop, () => val);\n target.#state[prop] = val;\n },\n })" |
| `this_element`          | readonly  | `this`  |                                                                                                                                                                                                                                                                                                                                         |

## Methods

| Method             | Type                       |
| ------------------ | -------------------------- |
| `colliding_with`   | `(el: any): any`           |
| `draw`             | `(inherited: any): void`   |
| `drawChildren`     | `(assigned: any): void`    |
| `getInheritedAttr` | `(attrName: any): any`     |
| `isPersistent`     | `(attrName: any): any`     |
| `setup`            | `(pInst: any): void`       |
| `setupEvalFn`      | `(attr: any): void`        |
| `setupEvalFns`     | `(): void`                 |
| `showLogicBool`    | `(inherited: any): any[]`  |
| `updateState`      | `(inherited: any): object` |
| `varInitialized`   | `(varName: any): any`      |

# canvas

The `<canvas>` element is a rectangular area of the window for rendering
imagery. All child elements are rendered to the canvas. Width, height
canvas_background, and all custom attributes are persistent; if a child
element changes the value of any of these attributes, the change will
remain in the next frame. This can be used to animate attributes over
time.

**Mixins:** P5Extension

## Attributes

| Attribute           | Type                                                                                       | Description                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `canvas_background` | `p5.Color\|String\|Number, [Number]\|Number, Number, Number, [Number]\|p5.Image, [Number]` | Sets the background that is rendered at the start of each frame. This may be a color or an image. |
| `height`            | `Number`                                                                                   | Height of the canvas in pixels                                                                    |
| `width`             | `Number`                                                                                   | Width of the canvas in pixels                                                                     |

## Properties

| Property                | Modifiers | Type    | Default                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderedAttributeNames` | readonly  | `array` |                                                                                                                                                                                                                                                                                                                                         |
| `pInst`                 | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `parent_element`        | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `persistent`            | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `proxy`                 |           | `this`  | "new Proxy(this, {\n get(target, prop) {\n if (prop in target) return target[prop];\n return target.#state[prop];\n },\n has(target, prop) {\n if (prop in target) return true;\n return prop in target.#state;\n },\n set(target, prop, val) {\n target.#updateFunctions.set(prop, () => val);\n target.#state[prop] = val;\n },\n })" |
| `this_element`          | readonly  | `this`  |                                                                                                                                                                                                                                                                                                                                         |

## Methods

| Method             | Type                       |
| ------------------ | -------------------------- |
| `colliding_with`   | `(el: any): any`           |
| `draw`             | `(inherited: any): void`   |
| `drawChildren`     | `(assigned: any): void`    |
| `getInheritedAttr` | `(attrName: any): any`     |
| `isPersistent`     | `(attrName: any): any`     |
| `runCode`          | `(): void`                 |
| `setup`            | `(pInst: any): void`       |
| `setupEvalFn`      | `(attr: any): void`        |
| `setupEvalFns`     | `(): void`                 |
| `showLogicBool`    | `(inherited: any): any[]`  |
| `updateState`      | `(inherited: any): object` |
| `varInitialized`   | `(varName: any): any`      |

# custom

The `<custom>` element generates a new element from a combination of existing
elements. This element should be placed outside the <canvas> element. The name attribute defines the name of the new element. For
example, if name is set to "my-element," <my-element>

**Mixins:** P5Extension

## Example

```html
<_>
 <custom name="cloud" attributes="center_x, center_y" stroke_color="NONE">
     <_ anchor="center_x, center_y" d="40">
         <circle x="-20" y="-10" fill_color="220"></circle>
         <circle x="20" y="-10" fill_color="210"></circle>
         <circle x="-10" y="-20" fill_color="250"></circle>
         <circle x="10" y="-20" fill_color="210"></circle>
         <circle x="0" y="0" fill_color="180"></circle>
         <circle x="20" y="0" fill_color="200"></circle>
         <circle x="-20" y="0" fill_color="240"></circle>
         <circle x="0" y="-5" fill_color="235"></circle>
     </_>
 </custom>
 <canvas
     width="400"
     height="400"
     is="canvas"
     canvas_background="100, 140, 200"
     cloud_x="0"
 >
     <cloud
         center_y="75"
         center_x="cloud_x - 40 - width * 0.25"
         change="center_x: center_x + width * 0.25"
         repeat="WHILE,  center_x LESS_THAN width * 1.25"
     ></cloud>
     <_ cloud_x="cloud_x + 0.25">
         <_ on="cloud_x GREATER_THAN width * 0.25" cloud_x="0"></_>
     </_>
 </canvas>
</_>
```

## Properties

| Property                | Modifiers | Type    | Default                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderedAttributeNames` | readonly  | `array` |                                                                                                                                                                                                                                                                                                                                         |
| `pInst`                 | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `parent_element`        | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `persistent`            | readonly  |         |                                                                                                                                                                                                                                                                                                                                         |
| `proxy`                 |           | `this`  | "new Proxy(this, {\n get(target, prop) {\n if (prop in target) return target[prop];\n return target.#state[prop];\n },\n has(target, prop) {\n if (prop in target) return true;\n return prop in target.#state;\n },\n set(target, prop, val) {\n target.#updateFunctions.set(prop, () => val);\n target.#state[prop] = val;\n },\n })" |
| `this_element`          | readonly  | `this`  |                                                                                                                                                                                                                                                                                                                                         |

## Methods

| Method             | Type                       |
| ------------------ | -------------------------- |
| `colliding_with`   | `(el: any): any`           |
| `draw`             | `(inherited: any): void`   |
| `drawChildren`     | `(assigned: any): void`    |
| `getInheritedAttr` | `(attrName: any): any`     |
| `isPersistent`     | `(attrName: any): any`     |
| `setup`            | `(pInst: any): void`       |
| `setupEvalFn`      | `(attr: any): void`        |
| `setupEvalFns`     | `(): void`                 |
| `showLogicBool`    | `(inherited: any): any[]`  |
| `updateState`      | `(inherited: any): object` |
| `varInitialized`   | `(varName: any): any`      |

# p-sketch

This HTML element loads an XML sketch file. This should be added to the
index.html file as a `<link>` element with the attributes is="p-sketch" and
href="[PATH TO XML FILE]".

## Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="p5.js"></script>
    <script src="p5.marker.js" defer></script>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <link href="sketch.xml" is="p-sketch" />
    <meta charset="utf-8" />
  </head>
  <body></body>
</html>
```

## Methods

| Method               | Type                                       |
| -------------------- | ------------------------------------------ |
| `convertAllElements` | `(xmlEl: any, parent?: HTMLElement): void` |
| `convertElement`     | `(xmlEl: any): HTMLElement`                |
| `convertXML`         | `(e: any): void`                           |
| `copyAttributes`     | `(orig: any, copy: any): void`             |
| `loadXML`            | `(path: any): void`                        |

# arc

Draws an arc to the screen. If called with only x, y, w, h, start and stop
the arc will be drawn and filled as an open pie segment. If a mode
parameter is provided, the arc will be filled like an open semi-circle
(OPEN), a closed semi-circle (CHORD), or as a closed pie segment (PIE).
The origin may be changed with the ellipseMode() function.

The arc is always drawn clockwise from wherever start falls to wherever
stop falls on the ellipse. Adding or subtracting TWO_PI to either angle
does not change where they fall. If both start and stop fall at the same
place, a full ellipse will be drawn. Be aware that the y-axis increases in
the downward direction, therefore angles are measured clockwise from the
positive x-direction ("3 o'clock").

**Mixins:** P5Extension

## Attributes

| Attribute | Type       | Description                                                                                                                                                                                                |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detail`  | `Integer`  | optional parameter for WebGL mode only. This is<br />to specify the number of vertices that makes up the perimeter of the arc.<br />Default value is 25. Won't draw a stroke for a detail of more than 50. |
| `h`       | `Number`   | height of the arc's ellipse by default (affected by ellipse_mode)                                                                                                                                          |
| `mode`    | `Constant` | determines the way of drawing the arc. either<br />CHORD, PIE or OPEN.                                                                                                                                     |
| `start`   | `Number`   | angle to start the arc, specified in radians                                                                                                                                                               |
| `stop`    | `Number`   | angle to stop the arc, specified in radians                                                                                                                                                                |
| `w`       | `Number`   | width of the arc's ellipse by default (affected by ellipse_mode)                                                                                                                                           |
| `x`       | `Number`   | x-coordinate of the arc's ellipse                                                                                                                                                                          |
| `y`       | `Number`   | y-coordinate of the arc's ellipse                                                                                                                                                                          |

## Properties

| Property                | Modifiers | Type     | Default                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fnName`                | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `fnStr`                 | readonly  | `string` |                                                                                                                                                                                                                                                                                                                                         |
| `mouse_over`            | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `orderedAttributeNames` | readonly  | `array`  |                                                                                                                                                                                                                                                                                                                                         |
| `overloads`             |           |          | "overloads"                                                                                                                                                                                                                                                                                                                             |
| `pInst`                 | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `parent_element`        | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `persistent`            | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `proxy`                 |           | `this`   | "new Proxy(this, {\n get(target, prop) {\n if (prop in target) return target[prop];\n return target.#state[prop];\n },\n has(target, prop) {\n if (prop in target) return true;\n return prop in target.#state;\n },\n set(target, prop, val) {\n target.#updateFunctions.set(prop, () => val);\n target.#state[prop] = val;\n },\n })" |
| `this_element`          | readonly  | `this`   |                                                                                                                                                                                                                                                                                                                                         |

## Methods

| Method                   | Type                       |
| ------------------------ | -------------------------- |
| `#setAnchorToXY`         | `(): void`                 |
| `colliding_with`         | `(el: any): any`           |
| `draw`                   | `(inherited: any): void`   |
| `drawChildren`           | `(assigned: any): void`    |
| `getInheritedAttr`       | `(attrName: any): any`     |
| `isPersistent`           | `(attrName: any): any`     |
| `renderToCanvas`         | `(): void`                 |
| `setParamsFromOverloads` | `(): void`                 |
| `setup`                  | `(pInst: any): void`       |
| `setupEvalFn`            | `(attr: any): void`        |
| `setupEvalFns`           | `(): void`                 |
| `showLogicBool`          | `(inherited: any): any[]`  |
| `updateState`            | `(inherited: any): object` |
| `varInitialized`         | `(varName: any): any`      |

# ellipse

Draws an ellipse (oval) to the screen. By default, the first two
parameters set the location of the center of the ellipse, and the third
and fourth parameters set the shape's width and height. If no height is
specified, the value of width is used for both the width and height. If a
negative height or width is specified, the absolute value is taken.

An ellipse with equal width and height is a circle. The origin may be
changed with the ellipseMode() function.

**Mixins:** P5Extension

## Attributes

| Attribute | Type      | Description                                                                                                                                                                                 |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detail`  | `Integer` | For WEBGL mode only. This is to specify the<br />number of vertices that makes up the perimeter of the ellipse. Default<br />value is 25. Won't draw a stroke for a detail of more than 50. |
| `h`       | `Number`  | height of the ellipse                                                                                                                                                                       |
| `w`       | `Number`  | width of the ellipse                                                                                                                                                                        |
| `x`       | `Number`  | x-coordinate of the center of the ellipse                                                                                                                                                   |
| `y`       | `Number`  | y-coordinate of the center of the ellipse                                                                                                                                                   |

## Properties

| Property                | Modifiers | Type     | Default                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collider`              |           |          | "ellipse"                                                                                                                                                                                                                                                                                                                               |
| `collision_args`        | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `fnName`                | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `fnStr`                 | readonly  | `string` |                                                                                                                                                                                                                                                                                                                                         |
| `mouse_over`            | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `orderedAttributeNames` | readonly  | `array`  |                                                                                                                                                                                                                                                                                                                                         |
| `overloads`             |           |          | "overloads"                                                                                                                                                                                                                                                                                                                             |
| `pInst`                 | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `parent_element`        | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `persistent`            | readonly  |          |                                                                                                                                                                                                                                                                                                                                         |
| `proxy`                 |           | `this`   | "new Proxy(this, {\n get(target, prop) {\n if (prop in target) return target[prop];\n return target.#state[prop];\n },\n has(target, prop) {\n if (prop in target) return true;\n return prop in target.#state;\n },\n set(target, prop, val) {\n target.#updateFunctions.set(prop, () => val);\n target.#state[prop] = val;\n },\n })" |
| `this_element`          | readonly  | `this`   |                                                                                                                                                                                                                                                                                                                                         |

## Methods

| Method                   | Type                       |
| ------------------------ | -------------------------- |
| `#setAnchorToXY`         | `(): void`                 |
| `colliding_with`         | `(el: any): any`           |
| `draw`                   | `(inherited: any): void`   |
| `drawChildren`           | `(assigned: any): void`    |
| `getInheritedAttr`       | `(attrName: any): any`     |
| `isPersistent`           | `(attrName: any): any`     |
| `renderToCanvas`         | `(): void`                 |
| `setParamsFromOverloads` | `(): void`                 |
| `setup`                  | `(pInst: any): void`       |
| `setupEvalFn`            | `(attr: any): void`        |
| `setupEvalFns`           | `(): void`                 |
| `showLogicBool`          | `(inherited: any): any[]`  |
| `updateState`            | `(inherited: any): object` |
| `varInitialized`         | `(varName: any): any`      |
