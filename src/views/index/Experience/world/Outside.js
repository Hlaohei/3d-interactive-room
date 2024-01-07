import Experience from "../Experience";

import * as THREE from "three";

export default class Outside {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;

    // if (this.debug) {
    //   this.debugFolder = this.debug.addFolder({
    //     title: "窗外",
    //     expanded: true,
    //   });
    // }

    this.setPlane();
  }

  setPlane() {
    this.plane = {};

    this.plane.texture = this.resources.items.outsideImage;
    this.plane.texture.colorSpace = THREE.SRGBColorSpace;

    this.plane.geometry = new THREE.SphereGeometry(5, 16, 10, 0, 2, 1.2, 1);

    this.plane.material = new THREE.MeshBasicMaterial({
      map: this.plane.texture,
      side: THREE.BackSide,
    });

    this.plane.mesh = new THREE.Mesh(this.plane.geometry, this.plane.material);
    this.plane.mesh.position.set(0, 0.4, 0.2);
    this.plane.mesh.rotation.y = -Math.PI / 2.5;

    this.scene.add(this.plane.mesh);
  }

  update() {}
}
