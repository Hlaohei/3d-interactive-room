import Experience from "./Experience";

import * as THREE from "three";

import Baked from "./world/Baked";
import Fans from "./world/Fans";
import Outside from "./world/Outside";
import Keyboard from "./world/Keyboard";
import TeaSteam from "./world/TeaSteam";
import Phone from "./world/Phone";
import MatrixLED from "./world/MatrixLED";
import Screen from "./world/Screen";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setWorldCenterPoint();
        this.setBaked();
        this.setFans();
        this.setKeyboard();
        this.setOutside();
        this.setTeaSteam();
        this.setPhone();
        this.setMatrixLED();
        this.setScreen();
      }
    });
  }

  setWorldCenterPoint() {
    this.worldCenterPoint = {};

    this.resources.items.finalModel.scene.children.find((mesh) => {
      if (mesh.name === "摄像机跟踪点") {
        this.worldCenterPoint = mesh;
      }
    });
  }

  setBaked() {
    this.baked = new Baked();
  }

  setFans() {
    this.fans = new Fans();
  }

  setKeyboard() {
    this.keyboard = new Keyboard();
  }

  setOutside() {
    this.outside = new Outside();
  }

  setTeaSteam() {
    this.teaSteam = new TeaSteam();
  }

  setPhone() {
    this.phone = new Phone();
  }

  setMatrixLED() {
    this.matrixLED = new MatrixLED();
  }

  setScreen() {
    this.screen = new Screen();
  }

  update() {
    if (this.fans) this.fans.update();

    if (this.teaSteam) this.teaSteam.update();

    if (this.matrixLED) this.matrixLED.update();
  }

  resize() {}

  destroy() {}
}
