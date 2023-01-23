import { RenderedElement } from "../core";
import { addXYZ, addWidthHeight } from "../properties/shape_props";
import { WebGLGeometry } from "../properties/3d_props";

class Normal extends addXYZ(RenderedElement) {
  static overloads = ["vector", "x, y, z"];
}
customElements.define("p-normal", Normal);

class Plane extends addWidthHeight(WebGLGeometry) {
  static overloads = "[width], [height], [detail_x], [detail_y]";
}
customElements.define("p-plane", Plane);

class Box extends addWidthHeight(WebGLGeometry) {
  static overloads = ["[width], [height], [depth], [detail_x], [detail_y]"];
}
customElements.define("p-box", Box);

class Sphere extends WebGLGeometry {
  static overloads = ["[radius], [detail_x], [detail_y]"];
}
customElements.define("p-sphere", Sphere);

class Cylinder extends WebGLGeometry {
  static overloads = [
    "[radius], [height], [detail_x], [detail_y], [bottomCap], [topCap]",
  ];
}
customElements.define("p-cylinder", Cylinder);

class Cone extends WebGLGeometry {
  static overloads = ["[radius], [height], [detail_x], [detail_y], [cap]"];
}
customElements.define("p-cone", Cone);

class Ellipsoid extends WebGLGeometry {
  static overloads = [
    "[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]",
  ];
}
customElements.define("p-ellipsoid", Ellipsoid);

class Torus extends WebGLGeometry {
  static overloads = ["[radius], [tubeRadius], [detailX], [detailY]"];
}
customElements.define("p-torus", Torus);

//  TODO - test when preload implemented
class LoadModel extends RenderedElement {
  static overloads = [
    "path, normalize, [successCallback], [failureCallback], [fileType]",
    "path, [successCallback], [failureCallback], [fileType]",
  ];
}
customElements.define("p-load-model", LoadModel);

class Model extends WebGLGeometry {
  static overloads = ["model"];
}
customElements.define("p-model", Model);
