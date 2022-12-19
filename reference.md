# _

The blank `<_>` element renders nothing to the canvas. This is useful
for adjusting attributes for child elements.

**Mixins:** P5Extension

## Properties

| Property                | Modifiers | Type      | Description                                      |
|-------------------------|-----------|-----------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `orderedAttributeNames` | readonly  | `Array`   |                                                  |
| `pInst`                 | readonly  | `object`  | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method               | Type                               | Description                                      |
|----------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited` | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`     | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`               | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`       | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `setup`              | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`        | `(inherited: any): object`         |                                                  |


# canvas

The `<canvas>` element is a rectangular area of the window for rendering
imagery. All child elements are rendered to the canvas. Width, height
canvas_background, and all custom attributes are persistent; if a child
element changes the value of any of these attributes, the change will
remain in the next frame. This can be used to animate attributes over
time.

**Mixins:** P5Extension

## Attributes

| Attribute           | Type                                             | Description                                      |
|---------------------|--------------------------------------------------|--------------------------------------------------|
| `canvas_background` | `p5.Color\|String\|Number, [Number]\|Number, Number, Number, [Number]\|p5.Image, [Number]` | Sets the background that is rendered at the start of each frame. This may be a color or an image. |
| `height`            | `Number`                                         | Height of the canvas in pixels                   |
| `width`             | `Number`                                         | Width of the canvas in pixels                    |

## Properties

| Property                | Modifiers | Type      | Description                                      |
|-------------------------|-----------|-----------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `orderedAttributeNames` | readonly  | `Array`   |                                                  |
| `pInst`                 | readonly  | `object`  | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method               | Type                               | Description                                      |
|----------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited` | `(varName: any): boolean`          | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`     | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`               | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`       | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `runCode`            | `(): void`                         |                                                  |
| `setup`              | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`        | `(inherited: any): object`         |                                                  |


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

| Property                | Modifiers | Type      | Description                                      |
|-------------------------|-----------|-----------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `orderedAttributeNames` | readonly  | `Array`   |                                                  |
| `pInst`                 | readonly  | `object`  | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method               | Type                               | Description                                      |
|----------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited` | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`     | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`               | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`       | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `setup`              | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`        | `(inherited: any): object`         |                                                  |


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
|----------------------|--------------------------------------------|
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

| Attribute | Type       | Description                                      |
|-----------|------------|--------------------------------------------------|
| `detail`  | `Integer`  | optional parameter for WebGL mode only. This is<br />to specify the number of vertices that makes up the perimeter of the arc.<br />Default value is 25. Won't draw a stroke for a detail of more than 50. |
| `h`       | `Number`   | height of the arc's ellipse by default (affected by ellipse_mode) |
| `mode`    | `Constant` | determines the way of drawing the arc. either<br />CHORD, PIE or OPEN. |
| `start`   | `Number`   | angle to start the arc, specified in radians     |
| `stop`    | `Number`   | angle to stop the arc, specified in radians      |
| `w`       | `Number`   | width of the arc's ellipse by default (affected by ellipse_mode) |
| `x`       | `Number`   | x-coordinate of the arc's ellipse                |
| `y`       | `Number`   | y-coordinate of the arc's ellipse                |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `fnName`                | readonly  |           |             |                                                  |
| `fnStr`                 | readonly  | `string`  |             |                                                  |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             |                                                  |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         |                                                  |
| `setParamsFromOverloads` | `(): never[] \| undefined`         |                                                  |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: any): object`         |                                                  |


# ellipse

Draws an ellipse (oval) to the screen. If no height is specified, the
value of width is used for both the width and height. If a
negative height or width is specified, the absolute value is taken.

An ellipse with equal width and height is a circle. The origin may be
changed with the ellipseMode() function.

**Mixins:** P5Extension

## Attributes

| Attribute | Type      | Description                                      |
|-----------|-----------|--------------------------------------------------|
| `detail`  | `Integer` | For WEBGL mode only. This is to specify the<br />number of vertices that makes up the perimeter of the ellipse. Default<br />value is 25. Won't draw a stroke for a detail of more than 50. |
| `h`       | `Number`  | height of the ellipse                            |
| `w`       | `Number`  | width of the ellipse                             |
| `x`       | `Number`  | x-coordinate of the center of the ellipse        |
| `y`       | `Number`  | y-coordinate of the center of the ellipse        |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `collider`              |           |           | "ellipse"   |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  |           |             |                                                  |
| `fnStr`                 | readonly  | `string`  |             |                                                  |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             |                                                  |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         |                                                  |
| `setParamsFromOverloads` | `(): never[] \| undefined`         |                                                  |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: any): object`         |                                                  |


# circle

Draws a circle to the screen. A circle is a simple closed shape. It is the
set of all points in a plane that are at a given distance from a given
point, the center.

**Mixins:** P5Extension

## Attributes

| Attribute | Type     | Description                              |
|-----------|----------|------------------------------------------|
| `d`       | `Number` | diameter of the circle                   |
| `x`       | `Number` | x-coordinate of the center of the circle |
| `y`       | `Number` | y-coordinate of the center of the circle |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `collider`              |           |           | "circle"    |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  |           |             |                                                  |
| `fnStr`                 | readonly  | `string`  |             |                                                  |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             |                                                  |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         |                                                  |
| `setParamsFromOverloads` | `(): never[] \| undefined`         |                                                  |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: any): object`         |                                                  |


# line

Draws a line (a direct path between two points) to the screen. This width
can be modified by using the stroke_weight attribute. A line cannot be
filled, therefore the fill_color attribute will not affect the color of a
line. So to color a line, use the stroke_color attribute.

**Mixins:** P5Extension

## Attributes

| Attribute | Type     | Description                                   |
|-----------|----------|-----------------------------------------------|
| `x1`      | `Number` | x-coordinate of the first point               |
| `x2`      | `Number` | x-coordinate of the second point              |
| `y1`      | `Number` | y-coordinate of the first point               |
| `y2`      | `Number` | y-coordinate of the second point              |
| `z1`      | `Number` | z-coordinate of the first point (WEBGL mode)  |
| `z2`      | `Number` | z-coordinate of the second point (WEBGL mode) |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to its<br />properties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have<br />"on" set to false. This can be used to switch between elements based on<br />conditions, similar to if/else. |
| `collider`              |           |           | "line"      |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  |           |             |                                                  |
| `fnStr`                 | readonly  | `string`  |             |                                                  |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             |                                                  |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,<br />methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to its<br />properties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. If<br />the attribute refers to an object property, this will check for an<br />attribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, and<br />calls the draw method on its children.<br /><br />**inherited**: object containing attribute values passed<br />down from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         |                                                  |
| `setParamsFromOverloads` | `(): never[] \| undefined`         |                                                  |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: any): object`         |                                                  |
