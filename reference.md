# _

The blank `<_>` element renders nothing to the canvas. This is useful
for adjusting attributes for child elements.

**Mixins:** P5Extension

## Properties

| Property                | Modifiers | Type      | Description                                      |
|-------------------------|-----------|-----------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `orderedAttributeNames` | readonly  | `Array`   | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `pInst`                 | readonly  | `object`  | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method               | Type                               | Description                                      |
|----------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited` | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`     | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`               | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`       | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `setup`              | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`        | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


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
| `above_sibling`         | readonly  | `proxy`   | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `orderedAttributeNames` | readonly  | `Array`   | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `pInst`                 | readonly  | `object`  | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method               | Type                               | Description                                      |
|----------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited` | `(varName: any): boolean`          | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`     | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`               | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`       | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `runCode`            | `(): void`                         |                                                  |
| `setup`              | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`        | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


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
| `above_sibling`         | readonly  | `proxy`   | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `orderedAttributeNames` | readonly  | `Array`   | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `pInst`                 | readonly  | `object`  | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method               | Type                               | Description                                      |
|----------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited` | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`     | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`               | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`       | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `setup`              | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`        | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


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
| `detail`  | `Integer`  | optional parameter for WebGL mode only. This isto specify the number of vertices that makes up the perimeter of the arc.Default value is 25. Won't draw a stroke for a detail of more than 50. |
| `h`       | `Number`   | height of the arc's ellipse by default (affected by ellipse_mode) |
| `mode`    | `Constant` | determines the way of drawing the arc. eitherCHORD, PIE or OPEN. |
| `start`   | `Number`   | angle to start the arc, specified in radians     |
| `stop`    | `Number`   | angle to stop the arc, specified in radians      |
| `w`       | `Number`   | width of the arc's ellipse by default (affected by ellipse_mode) |
| `x`       | `Number`   | x-coordinate of the arc's ellipse                |
| `y`       | `Number`   | y-coordinate of the arc's ellipse                |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


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
| `detail`  | `Integer` | For WEBGL mode only. This is to specify thenumber of vertices that makes up the perimeter of the ellipse. Defaultvalue is 25. Won't draw a stroke for a detail of more than 50. |
| `h`       | `Number`  | height of the ellipse                            |
| `w`       | `Number`  | width of the ellipse                             |
| `x`       | `Number`  | x-coordinate of the center of the ellipse        |
| `y`       | `Number`  | y-coordinate of the center of the ellipse        |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "ellipse"   |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


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
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "circle"    |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


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
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "line"      |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


# point

Draws a point, a coordinate in space at the dimension of one pixel. The
color of the point is changed with the stroke_color attribute. The size of
the point can be changed with the stroke_weight attribute.

**Mixins:** P5Extension

## Attributes

| Attribute | Type     | Description               |
|-----------|----------|---------------------------|
| `x`       | `Number` | x-coordinate              |
| `y`       | `Number` | y-coordinate              |
| `z`       | `Number` | z-coordinate (WEBGL mode) |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "circle"    |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


# quad

Draws a quad on the canvas. A quad is a quadrilateral, a four-sided
polygon. It is similar to a rectangle, but the angles between its edges
are not constrained to ninety degrees. The x1 and y1 attributes set the
first vertex and the subsequent pairs should proceed clockwise or
counter-clockwise around the defined shape. z attributes only work when
quad() is used in WEBGL mode.

**Mixins:** P5Extension

## Attributes

| Attribute  | Type      | Description                                      |
|------------|-----------|--------------------------------------------------|
| `detail_x` | `Integer` | number of segments in the x-direction (WEBGL mode) |
| `detail_y` | `Integer` | number of segments in the y-direction (WEBGL mode) |
| `x1`       | `Number`  | x-coordinate of the first point                  |
| `x2`       | `Number`  | x-coordinate of the second point                 |
| `x3`       | `Number`  | x-coordinate of the third point                  |
| `x4`       | `Number`  | x-coordinate of the fourth point                 |
| `y1`       | `Number`  | y-coordinate of the first point                  |
| `y2`       | `Number`  | y-coordinate of the second point                 |
| `y3`       | `Number`  | y-coordinate of the third point                  |
| `y4`       | `Number`  | y-coordinate of the fourth point                 |
| `z1`       | `Number`  | z-coordinate of the first point (WEBGL mode)     |
| `z2`       | `Number`  | z-coordinate of the second point (WEBGL mode)    |
| `z3`       | `Number`  | z-coordinate of the third point (WEBGL mode)     |
| `z4`       | `Number`  | z-coordinate of the fourth point (WEBGL mode)    |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "poly"      |                                                  |
| `collision_args`        | readonly  | `any[][]` |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |
| `vertices`              | readonly  | `array`   |             |                                                  |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


# rect

Draws a rectangle on the canvas. A rectangle is a four-sided closed shape
with every angle at ninety degrees. By default, the x and y attributes
set the location of the upper-left corner, w sets the width, and h sets
the height. The way these attributes are interpreted may be changed with
the rect_mode attribute.

The tl, tr, br and bl attributes, if specified, determine
corner radius for the top-left, top-right, lower-right and lower-left
corners, respectively. An omitted corner radius parameter is set to the
value of the previously specified radius value in the attribute list.

**Mixins:** P5Extension

## Attributes

| Attribute | Type     | Description                    |
|-----------|----------|--------------------------------|
| `bl`      | `Number` | radius of bottom-left corner.  |
| `br`      | `Number` | radius of bottom-right corner. |
| `h`       | `Number` | height of the rectangle.       |
| `tl`      | `Number` | radius of top-left corner.     |
| `tr`      | `Number` | radius of top-right corner.    |
| `w`       | `Number` | width of the rectangle.        |
| `x`       | `Number` | x-coordinate of the rectangle. |
| `y`       | `Number` | y-coordinate of the rectangle. |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "rect"      |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |


# square

Draws a square to the screen. A square is a four-sided shape with every
angle at ninety degrees, and equal side size. This element is a special
case of the rect element, where the width and height are the same, and the
attribute is called "s" for side size. By default, the x and y attributes
set the location of the upper-left corner, and s sets the side size of the
square. The way these attributes are interpreted, may be changed with the
rect_mode attribute.

The tl, tr, br, and bl attributes, if specified, determine corner radius
for the top-left, top-right, lower-right and lower-left corners,
respectively. An omitted corner radius attribute is set to the value of
the previously specified radius value in the attribute list.

**Mixins:** P5Extension

## Attributes

| Attribute | Type     | Description                    |
|-----------|----------|--------------------------------|
| `bl`      | `Number` | radius of bottom-left corner.  |
| `br`      | `Number` | radius of bottom-right corner. |
| `s`       | `Number` | side size of the square.       |
| `tl`      | `Number` | radius of top-left corner.     |
| `tr`      | `Number` | radius of top-right corner.    |
| `x`       | `Number` | x-coordinate of the square.    |
| `y`       | `Number` | y-coordinate of the square.    |

## Properties

| Property                | Modifiers | Type      | Default     | Description                                      |
|-------------------------|-----------|-----------|-------------|--------------------------------------------------|
| `above_sibling`         | readonly  | `proxy`   |             | Proxy for the sibling element above this element with access to itsproperties, methods, and attributes. |
| `above_siblings_off`    | readonly  | `boolean` |             | True if siblings directly above this element with an "on" attribute have"on" set to false. This can be used to switch between elements based onconditions, similar to if/else. |
| `collider`              |           |           | "rect"      |                                                  |
| `collision_args`        | readonly  | `array`   |             |                                                  |
| `fnName`                | readonly  | `string`  |             | Name of this element's render function.          |
| `mouse_over`            | readonly  |           |             |                                                  |
| `orderedAttributeNames` | readonly  | `Array`   |             | List of attribute names in the order in which they will be evaluated.Element attributes are not guaranteed to be in the order in which theyare written. Transformation attributes are prioritized before othersand use this order: anchor, angle, scale_factor, shear. |
| `overloads`             |           |           | "overloads" |                                                  |
| `pInst`                 | readonly  | `object`  |             | This element's p5 instance.                      |
| `parent_element`        | readonly  | `proxy`   |             | Proxy for this element's parent element with access to its properties,methods, and attributes. |
| `persistent`            | readonly  | `proxy`   |             | Proxy for this element's parent canvas is a child with access to itsproperties, methods, and attributes. |
| `this_element`          | readonly  | `this`    |             | This element's proxy with access to properties, methods, and attributes. |

## Methods

| Method                   | Type                               | Description                                      |
|--------------------------|------------------------------------|--------------------------------------------------|
| `attributeInherited`     | `(attributeName: string): boolean` | Checks if the provided attribute name belongs to a parent element. Ifthe attribute refers to an object property, this will check for anattribute with a name that matches the object.<br /><br />**attributeName**: name of the attribute to check |
| `colliding_with`         | `(el: P5Element): boolean`         | Checks if this element is colliding with the provided other element.<br /><br />**el**: other element to check |
| `draw`                   | `(inherited: object): void`        | Updates the element's attribute values, renders it to the canvas, andcalls the draw method on its children.<br /><br />**inherited**: object containing attribute values passeddown from parent element |
| `isPersistent`           | `(attributeName: string): boolean` | Checks if an attribute belongs to the parent canvas of this element.<br /><br />**attributeName**: name of the attribute to check |
| `renderToCanvas`         | `(): void`                         | Calls this element's render function with current attribute values. |
| `setParamsFromOverloads` | `(): never[] \| undefined`         | Sets the parameters used to call this element's render function basedon the overloads for that function and this element's attributes. |
| `setup`                  | `(pInst: p5): void`                | Sets this element up with a p5 instance and sets up its children.<br /><br />**pInst**: undefined |
| `updateState`            | `(inherited: Object): object`      | Updates the values of all attributes using the provided expressions.<br /><br />**inherited**: object |
