import Experience from "./Experience";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.targetElement = this.experience.targetElement;
    this.scene = this.experience.scene;

    this.mode = "default"; // "debug", "default"

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "相机",
        expanded: false,
      });

      this.debugFolder.addInput(this, "mode", {
        label: "查看模式",
        options: {
          default: "default",
          debug: "debug",
        },
      });
    }

    this.setInstance();
    // this.setControls();
    this.setModes();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.config.width / this.config.height,
      0.01,
      100
    );
    this.instance.rotation.reorder("YXZ");

    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.targetElement);
    this.controls.enableDamping = true;
  }

  setModes() {
    this.modes = {};

    // default 常规模式
    this.modes.default = {};
    this.modes.default.instance = this.instance.clone();
    this.modes.default.instance.rotation.reorder("YXZ");

    // debug 模式
    this.modes.debug = {};
    this.modes.debug.instance = this.instance.clone();
    this.modes.debug.instance.rotation.reorder("YXZ");
    this.modes.debug.instance.position.set(5, 5, 5);

    this.modes.debug.orbitControls = new OrbitControls(
      this.modes.debug.instance,
      this.targetElement
    );
    this.modes.debug.orbitControls.enableDamping = true;
    // this.modes.debug.orbitControls.enabled = true;
    // this.modes.debug.orbitControls.screenSpacePanning = true;
    // this.modes.debug.orbitControls.enableKeys = false;
    // this.modes.debug.orbitControls.zoomSpeed = 0.25;
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();

    this.modes.default.instance.aspect = this.config.width / this.config.height;
    this.modes.default.instance.updateProjectionMatrix();

    this.modes.debug.instance.aspect = this.config.width / this.config.height;
    this.modes.debug.instance.updateProjectionMatrix();
  }

  update() {
    if (this.controls) this.controls.update();
    if (this.modes.debug.orbitControls) this.modes.debug.orbitControls.update();

    this.instance.position.copy(this.modes[this.mode].instance.position);
    this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);

    this.instance.updateMatrixWorld();
  }

  destroy() {
    if (this.controls) this.controls.destroy();
    if (this.modes.debug.orbitControls)
      this.modes.debug.orbitControls.destroy();
  }
}
