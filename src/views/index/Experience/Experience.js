import * as THREE from "three";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import { Pane } from "tweakpane";

import Time from "./Utils/Time";
import Sizes from "./Utils/Sizes";
import Stats from "./Utils/Stats";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Resources from "./Resources";
import World from "./World";
import Navigation from "./Navigation";

import assets from "./assets";

export default class Experience {
  static instance;

  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // 接收参数
    this.targetElement = _options.targetElement;

    if (!this.targetElement) {
      console.warn("请传入 'targetElement' 参数");
      return;
    }

    this.time = new Time();
    this.sizes = new Sizes();

    this.setConfig();
    this.setStats();
    this.setDebug();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setResources();
    this.setWorld();
    this.setNavigation();

    this.sizes.on("resize", () => {
      this.resize();
    });

    if (WebGL.isWebGLAvailable()) {
      this.time.on("tick", () => {
        this.update();
      });
    } else {
      const warning = WebGL.getWebGLErrorMessage();
      this.targetElement.appendChild(warning);
    }
  }

  setConfig() {
    this.config = {};

    // 像素比例
    this.config.pixelRatio = window.devicePixelRatio;

    // 宽高
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;
    // 最小边 最大边
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    // debug
    this.config.debug = window.location.hash === "#hhh";
    // this.config.debug = true;
  }

  /**
   * 初始化 stats 帧率显示
   */
  setStats() {
    if (this.config.debug) {
      this.stats = new Stats(true);
    }
  }

  /**
   * 初始化 debug UI
   */
  setDebug() {
    if (this.config.debug) {
      this.debug = new Pane({
        title: "laohei 3d website - debug",
        expanded: false,
      });
      this.debug.containerElem_.style.width = "320px";
    }
  }

  /**
   * 初始化 3D 场景
   */
  setScene() {
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
  }

  /**
   * 初始化 3D 相机
   */
  setCamera() {
    this.camera = new Camera();
  }

  /**
   * 初始化 3D 渲染器
   */
  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });
    this.targetElement.appendChild(this.renderer.instance.domElement);
    this.targetElement.appendChild(this.renderer.cssInstance.domElement);
  }

  /**
   * 初始化 资源
   */
  setResources() {
    this.resources = new Resources(assets);
  }

  /**
   * 初始化 3D 世界
   */
  setWorld() {
    this.world = new World();
  }

  /**
   * 初始化 导航
   */
  setNavigation() {
    this.navigation = new Navigation();
  }

  update() {
    if (this.stats) this.stats.update();

    if (this.renderer) this.camera.update();

    if (this.renderer) this.renderer.update();

    if (this.world) this.world.update();

    if (this.navigation) this.navigation.update();

    // window.requestAnimationFrame(() => {
    //   this.update();
    // });
  }
  resize() {
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    this.config.pixelRatio = window.devicePixelRatio;

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }

  destroy() {}
}
