export const addWebGLMethods = (baseClass) =>
  class extends baseClass {
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
     */
    create_camera() {
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
     */
    create_shader() {
      this.pInst.createShader(...arguments);
    }
  };
