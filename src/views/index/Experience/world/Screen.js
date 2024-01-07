import Experience from "../Experience";

import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class Screen {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.cssScene = this.experience.cssScene;
    this.camera = this.experience.camera;
    this.config = this.experience.config;
    this.resources = this.experience.resources;
    this.targetElement = this.experience.targetElement;
    this.navigation = this.experience.navigation;

    this.setScreenModel();

    this.setLeftScreen();
    this.setRightScreen();

    this.setListener();
  }

  setScreenModel() {
    this.screenModel = {};

    // 屏幕模型大小 0.64 * 0.36
    this.screenModel.left = this.resources.items.finalModel.scene.children.find(
      (mesh) => mesh.name === "电脑屏幕左"
    );
    this.screenModel.right =
      this.resources.items.finalModel.scene.children.find(
        (mesh) => mesh.name === "电脑屏幕右"
      );

    this.screenModel.material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: "#000000",
      opacity: 0,
      // side: THREE.DoubleSide,
      blending: THREE.NoBlending,
    });
    this.screenModel.left.material = this.screenModel.material;
    // this.screenModel.right.material = this.screenModel.material;
  }

  setLeftScreen() {
    this.leftScreen = {};

    // 左屏幕显示 dom 元素
    this.leftScreen.iframe = document.createElement("iframe");
    // this.leftScreen.iframe.src = "http://192.168.1.5:5173/";
    // this.leftScreen.iframe.src = "/share/2";
    // this.leftScreen.iframe.src = "/resume";
    this.leftScreen.iframe.src = "#/hei-os?isHeiOs=true";
    this.leftScreen.iframe.style.width = 1280 + "px";
    this.leftScreen.iframe.style.height = 720 + "px";
    this.leftScreen.iframe.style.border = "none";
    this.leftScreen.iframe.style.position = "absolute";
    this.leftScreen.iframe.id = "left-screen";
    this.leftScreen.iframe.style.zIndex = 20;

    this.leftScreen.object = new CSS3DObject(this.leftScreen.iframe);
    this.leftScreen.object.position.copy(this.screenModel.left.position);
    this.leftScreen.object.rotation.copy(this.screenModel.left.rotation);

    let scaleNum = 0.0005;
    this.leftScreen.object.scale.copy(
      new THREE.Vector3(scaleNum, scaleNum, scaleNum)
    );

    this.cssScene.add(this.leftScreen.object);
  }

  setRightScreen() {
    this.rightScreen = {};

    // 右屏幕显示 logo 图片
    this.rightScreen.texture = this.resources.items.logoImage;
    this.rightScreen.texture.colorSpace = THREE.SRGBColorSpace;

    this.rightScreen.geometry = new THREE.PlaneGeometry(0.2, 0.2);

    this.rightScreen.material = new THREE.MeshBasicMaterial({
      map: this.rightScreen.texture,
      transparent: true,
      // blending: THREE.NoBlending,
    });

    this.rightScreen.mesh = new THREE.Mesh(
      this.rightScreen.geometry,
      this.rightScreen.material
    );
    this.rightScreen.mesh.name = "电脑屏幕右";

    this.rightScreen.mesh.position.set(
      this.screenModel.right.position.x - 0.001,
      this.screenModel.right.position.y,
      this.screenModel.right.position.z + 0.001
    );
    this.rightScreen.mesh.rotation.copy(this.screenModel.right.rotation);

    this.scene.add(this.rightScreen.mesh);
  }

  setListener() {
    this.listener = {};

    this.listener.down = (_x, _y) => {
      // 获取鼠标点击位置的归一化设备坐标
      const mouse = new THREE.Vector2();
      mouse.x = (_x / this.config.width) * 2 - 1;
      mouse.y = -(_y / this.config.height) * 2 + 1;

      // 创建一个射线投射器
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera.instance);

      // 射线碰撞检测
      const intersects = raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        // console.log(selectedObject.name);

        switch (selectedObject.name) {
          case "电脑屏幕右":
            this.navigation.viewModes.rightScreen();
            break;
          case "电脑屏幕左":
            this.navigation.viewModes.leftScreen();
            break;
          default:
            this.navigation.viewModes.default();
            break;
        }
      }
    };

    this.listener.onMouseDown = (_event) => {
      _event.preventDefault();
      this.listener.down(_event.clientX, _event.clientY);
    };
    this.listener.onTouchStart = (_event) => {
      _event.preventDefault();
      this.listener.down(_event.touches[0].clientX, _event.touches[0].clientY);
    };

    this.targetElement.addEventListener(
      "mousedown",
      this.listener.onMouseDown,
      false
    );
    this.targetElement.addEventListener(
      "touchstart",
      this.listener.onTouchStart,
      false
    );
  }
}
