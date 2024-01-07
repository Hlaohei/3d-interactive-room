import Experience from "../Experience";

export default class Keyboard {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.setBtn();
  }

  setBtn() {
    this.btn = {};
    this.btn.models = [];

    this.resources.items.finalModel.scene.traverse((child) => {
      if (child.isMesh) {
        // 如果 name 中包含按键 就添加到 models 中
        if (child.name.includes("按键")) {
          this.btn.models.push(child);
        }
      }
    });

    this.btn.status = { down: 0.04, up: 0.05 };

    this.btn.audio = {
      small: new Audio("/models/audios/1.mp3"),
      big: new Audio("/models/audios/4.mp3"),
    };

    this.btn.onKeyDown = (_event) => {
      if (_event.repeat) {
        return;
      }
      if (this.btn.models && this.btn.models.length > 0) {
        switch (_event.code) {
          case "KeyC":
            this.btn.audio.small.currentTime = 0;
            this.btn.audio.small.play();
            this.btn.models[0].position.y = this.btn.status.down;
            break;

          case "KeyV":
            this.btn.audio.small.currentTime = 0;
            this.btn.audio.small.play();
            this.btn.models[2].position.y = this.btn.status.down;
            break;

          case "ControlLeft":
          case "ControlRight":
            this.btn.audio.big.currentTime = 0;
            this.btn.audio.big.play();
            this.btn.models[1].position.y = this.btn.status.down;
            break;
        }
      }
    };

    this.btn.onKeyUp = (_event) => {
      if (this.btn.models && this.btn.models.length > 0) {
        switch (_event.code) {
          case "KeyC":
            this.btn.models[0].position.y = this.btn.status.up;
            break;

          case "KeyV":
            this.btn.models[2].position.y = this.btn.status.up;
            break;

          case "ControlLeft":
          case "ControlRight":
            this.btn.models[1].position.y = this.btn.status.up;
            break;
        }
      }
    };

    window.addEventListener("keydown", this.btn.onKeyDown, false);
    window.addEventListener("keyup", this.btn.onKeyUp, false);

    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type === "keydown") {
          this.btn.onKeyDown(event.data);
        } else if (event.data.type === "keyup") {
          this.btn.onKeyUp(event.data);
        }
      },
      false
    );
  }
}
