import Experience from "../Experience";

import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class Phone {
  constructor() {
    this.experience = new Experience();
    this.cssScene = this.experience.cssScene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.setModel();
    this.setView();
  }

  setModel() {
    this.model = {};

    this.model.geometry = new THREE.PlaneGeometry(0.1, 0.2);

    this.model.material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: "#000000",
      opacity: 0,
      blending: THREE.NoBlending,
    });

    this.model.mesh = this.resources.items.finalModel.scene.children.find(
      (mesh) => mesh.name === "手机屏幕"
    );
    this.model.mesh.material = this.model.material;
  }

  setView() {
    this.view = {};

    this.view.domElement = document.createElement("div");
    this.view.domElement.className = "phone-screen-box";
    this.view.domElement.style.width = 200 + "px";
    this.view.domElement.style.height = 200 + "px";
    this.view.domElement.style.position = "absolute";
    this.view.domElement.style.top = 0;
    this.view.domElement.style.left = 0;
    this.view.domElement.style.zIndex = 30;

    this.view.updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const weekday = now.toLocaleDateString(undefined, { weekday: "long" });

      const innerHTML = `
        <span>${hours} : ${minutes}</span>
        <span>${year}-${month}-${day}</span>
        <span>${weekday}</span>
      `;

      this.view.domElement.innerHTML = innerHTML;
    };
    setInterval(this.view.updateTime, 1000); // 每秒钟更新一次时间

    this.view.object = new CSS3DObject(this.view.domElement);
    this.view.object.position.copy(this.model.mesh.position);
    this.view.object.rotation.set(-0.5, -0.2, -0.095);

    let scaleNum = 0.0003;
    this.view.object.scale.copy(
      new THREE.Vector3(scaleNum, scaleNum, scaleNum)
    );

    this.cssScene.add(this.view.object);
  }
}
