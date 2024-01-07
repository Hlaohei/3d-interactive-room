import Experience from "../Experience";

export default class Fans {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "机箱风扇",
        expanded: true,
      });
    }

    this.setFans();
  }

  setFans() {
    this.fans = {};
    this.fans.models = [];
    this.fans.speed = 5;

    this.resources.items.finalModel.scene.traverse((child) => {
      if (child.isMesh) {
        // 如果 name 中包含风扇 就添加到 this.fans 中
        if (child.name.includes("风扇")) {
          this.fans.models.push(child);
        }
      }
    });

    /**
     * debug UI
     */
    if (this.debug) {
      this.debugFolder.addInput(this.fans, "speed", {
        label: "速度",
        min: 0,
        max: 10,
        step: 0.01,
      });
    }
  }

  update() {
    if (this.fans && this.fans.models.length > 0) {
      this.fans.models.forEach((fan) => {
        fan.rotation.y = (this.time.elapsed / 1000) * this.fans.speed;
      });
    }
  }
}
