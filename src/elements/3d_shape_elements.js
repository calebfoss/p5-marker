import { RenderedElement } from "../core";
import { addXYZ, addWidthHeight } from "../properties/shape_props";
import { WebGLGeometry } from "../properties/3d_props";

class Normal extends addXYZ(RenderedElement) {
  constructor() {
    super(["vector", "x, y, z"]);
  }
}
customElements.define("p-normal", Normal);

class Plane extends addWidthHeight(WebGLGeometry) {
  constructor() {
    super("[width], [height], [detail_x], [detail_y]");
  }
}
customElements.define("p-plane", Plane);

class Box extends addWidthHeight(WebGLGeometry) {
  constructor() {
    super(["[width], [height], [depth], [detail_x], [detail_y]"]);
  }
}
customElements.define("p-box", Box);

class Sphere extends WebGLGeometry {
  constructor() {
    super(["[radius], [detail_x], [detail_y]"]);
  }
}
customElements.define("p-sphere", Sphere);

class Cylinder extends WebGLGeometry {
  constructor() {
    super([
      "[radius], [height], [detail_x], [detail_y], [bottomCap], [topCap]",
    ]);
  }
}
customElements.define("p-cylinder", Cylinder);

class Cone extends WebGLGeometry {
  constructor() {
    super(["[radius], [height], [detail_x], [detail_y], [cap]"]);
  }
}
customElements.define("p-cone", Cone);

class Ellipsoid extends WebGLGeometry {
  constructor() {
    super(["[radius_x], [radius_y], [radius_z], [detail_x], [detail_y]"]);
  }
}
customElements.define("p-ellipsoid", Ellipsoid);

class Torus extends WebGLGeometry {
  constructor() {
    super(["[radius], [tubeRadius], [detailX], [detailY]"]);
  }
}
customElements.define("p-torus", Torus);

//  TODO - test when preload implemented
class LoadModel extends RenderedElement {
  constructor() {
    super([
      "path, normalize, [successCallback], [failureCallback], [fileType]",
      "path, [successCallback], [failureCallback], [fileType]",
    ]);
  }
}
customElements.define("p-load-model", LoadModel);

class Model extends WebGLGeometry {
  constructor() {
    super(["model"]);
  }
}
customElements.define("p-model", Model);
