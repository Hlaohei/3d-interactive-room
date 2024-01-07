import Experience from "../Experience";
import ledBaseArray from "../Utils/ledUtils/ledBaseArray";
import ledUtils from "../Utils/ledUtils";

import * as THREE from "three";
import gsap from "gsap";

import vertexShader from "../shaders/matrixLED/vertex.glsl?raw";
import fragmentShader from "../shaders/matrixLED/fragment.glsl?raw";

export default class MatrixLED {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "矩阵LED",
        expanded: true,
      });
    }

    this.getLocalStorage();
    this.setSurfaceModel();
    this.setLEDModel();
    this.setModel();
    this.setModes();
  }

  getLocalStorage() {
    this.localStorage = JSON.parse(localStorage.getItem("matrix-led"));
  }

  setSurfaceModel() {
    this.surfaceModel = {};
    this.surfaceModel.color = "#000000";

    this.surfaceModel.material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: new THREE.Color(this.surfaceModel.color),
      opacity: 0.3,
    });

    this.surfaceModel.mesh =
      this.resources.items.finalModel.scene.children.find(
        (mesh) => mesh.name === "LED粉丝牌表面"
      );
    this.surfaceModel.mesh.material = this.surfaceModel.material;
    this.surfaceModel.mesh.visible = true;

    if (this.debug) {
      // 显示面板
      this.debugFolder.addInput(this.surfaceModel.mesh, "visible", {
        label: "显示面板",
      });
      this.debugFolder
        .addInput(this.surfaceModel, "color", {
          label: "面板颜色",
        })
        .on("change", () => {
          this.surfaceModel.material.color.set(this.surfaceModel.color);
        });
      this.debugFolder.addInput(this.surfaceModel.material, "opacity", {
        min: 0,
        max: 1,
        step: 0.001,
        label: "面板透明度",
      });
    }
  }

  setLEDModel() {
    this.ledModel = {};
    this.ledModel.color = "#ff0000";

    this.ledModel.material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: new THREE.Color(this.ledModel.color),
      side: THREE.DoubleSide,
    });

    this.ledModel.mesh = this.resources.items.finalModel.scene.children.find(
      (mesh) => mesh.name === "LED矩阵"
    );
    this.ledModel.mesh.material = this.ledModel.material;
    this.ledModel.mesh.visible = false;

    // if (this.debug) {
    //   // 显示面板
    //   this.debugFolder.addInput(this.ledModel.mesh, "visible", {
    //     label: "显示模型LED",
    //   });
    //   this.debugFolder
    //     .addInput(this.ledModel, "color", {
    //       label: "模型LED颜色",
    //     })
    //     .on("change", () => {
    //       this.ledModel.material.color.set(this.ledModel.color);
    //     });
    // }
  }

  setModel() {
    // 定义实际显示的 LED 矩阵
    this.model = {};

    // 定义LED矩阵的默认值
    this.model.config = {
      matrixWidth: 40, // 矩阵的宽度
      matrixHeight: 9, // 矩阵的高度
      ledSize: 0.02, // 每个LED的大小
      ledSpacing: 0.002, // LED之间的间距
      color: "#ff74de", // LED 颜色
      baseColor: "#333333", // LED 基础颜色
      colorStrength: 1, // 亮度
    };

    this.model.meshGroup = new THREE.Group();

    // 计算整体LED矩阵的宽度和高度
    this.model.config.matrixWidthTotal =
      this.model.config.matrixWidth *
        (this.model.config.ledSize + this.model.config.ledSpacing) -
      this.model.config.ledSpacing;
    this.model.config.matrixHeightTotal =
      this.model.config.matrixHeight *
        (this.model.config.ledSize + this.model.config.ledSpacing) -
      this.model.config.ledSpacing;

    // 计算整体LED矩阵的左上角位置
    this.model.config.matrixLeft =
      -(this.model.config.matrixWidthTotal - this.model.config.ledSize) / 2;
    this.model.config.matrixTop =
      (this.model.config.matrixHeightTotal - this.model.config.ledSize) / 2;

    this.model.geometry = new THREE.PlaneGeometry(
      this.model.config.ledSize,
      this.model.config.ledSize
    );
    this.model.material = new THREE.ShaderMaterial({
      uniforms: {
        uBaseColor: { value: new THREE.Color(this.model.config.baseColor) },
        uColorStrength: {
          value: this.localStorage
            ? this.localStorage.colorStrength
            : this.model.config.colorStrength,
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.model.mesh = new THREE.InstancedMesh(
      this.model.geometry,
      this.model.material,
      this.model.config.matrixWidth * this.model.config.matrixHeight
    );
    this.model.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.model.mesh.instanceMatrix.needsUpdate = true;

    // 修改 mesh中每个元素 的位置
    for (let col = 0; col < this.model.config.matrixWidth; col++) {
      for (let row = 0; row < this.model.config.matrixHeight; row++) {
        const index = col * this.model.config.matrixHeight + row;

        const position = new THREE.Vector3(
          this.model.config.matrixLeft +
            col * (this.model.config.ledSize + this.model.config.ledSpacing),
          this.model.config.matrixTop -
            row * (this.model.config.ledSize + this.model.config.ledSpacing),
          0
        );

        const matrix = new THREE.Matrix4();
        matrix.setPosition(position);
        this.model.mesh.setMatrixAt(index, matrix);

        const color = new THREE.Color(this.model.config.baseColor);
        this.model.mesh.setColorAt(index, color);
      }
    }
    this.model.mesh.instanceColor.needsUpdate = true;
    this.model.meshGroup.add(this.model.mesh);

    // 创建背景平面的几何体
    this.model.backgroundGeometry = new THREE.PlaneGeometry(
      this.model.config.matrixWidthTotal + this.model.config.ledSize,
      this.model.config.matrixHeightTotal + this.model.config.ledSize
    );
    this.model.backgroundMaterial = new THREE.MeshBasicMaterial({
      color: "#000000",
    });
    this.model.backgroundMesh = new THREE.Mesh(
      this.model.backgroundGeometry,
      this.model.backgroundMaterial
    );
    this.model.backgroundMesh.position.z = -0.001;
    this.model.meshGroup.add(this.model.backgroundMesh);

    this.model.meshGroup.position.set(0.2, 0.75, -0.46);
    this.scene.add(this.model.meshGroup);

    if (this.debug) {
      this.debugFolder.addBlade({
        view: "separator",
      });
      this.debugFolder.addInput(
        this.model.material.uniforms.uColorStrength,
        "value",
        {
          label: "整体亮度",
          min: 0,
          max: 1,
          step: 0.001,
        }
      );
      this.debugFolder
        .addInput(this.model.config, "baseColor", {
          label: "LED视觉基础色",
        })
        .on("change", () => {
          this.model.material.uniforms.uBaseColor.value.set(
            this.model.config.baseColor
          );
        });
      this.debugFolder.addInput(this.model.config, "color", {
        label: "LED默认颜色",
      });
    }
  }

  /**
   * 设置显示模式
   */
  setModes() {
    this.modes = {};
    // 'default' | 'clock' | 'fans' |'...'
    this.modes.mode = this.localStorage ? this.localStorage.modes.mode : "fans";

    if (this.debug) {
      this.debugFolder.addBlade({
        view: "separator",
      });
      this.debugFolder.addInput(this.modes, "mode", {
        label: "显示模式",
        options: {
          default: "default",
          clock: "clock",
          fans: "fans",
        },
      });
    }

    /**
     * 默认显示模式，单图
     */
    this.modes.default = {};
    this.modes.default.ledData = [];
    if (this.localStorage && this.localStorage.ledData.length > 0) {
      this.modes.default.ledData = this.localStorage.ledData;
    } else {
      this.modes.default.ledData = ledUtils.replaceBaseArrayColor(
        ledBaseArray.ckjdygc0,
        this.model.config.color
      );
    }

    this.modes.default.scrollMode = {};
    this.modes.default.scrollMode.mode = this.localStorage
      ? this.localStorage.scrollMode
      : 0;

    this.modes.default.scrollMode.intervalId = null;
    this.modes.default.scrollMode.left = () => {
      clearInterval(this.modes.default.scrollMode.intervalId);
      this.modes.default.scrollMode.intervalId = setInterval(() => {
        this.modes.default.ledData.push(this.modes.default.ledData.shift());
      }, 500);
    };
    this.modes.default.scrollMode.right = () => {
      clearInterval(this.modes.default.scrollMode.intervalId);
      this.modes.default.scrollMode.intervalId = setInterval(() => {
        this.modes.default.ledData.unshift(this.modes.default.ledData.pop());
      }, 500);
    };
    this.modes.default.scrollMode.stop = () => {
      clearInterval(this.modes.default.scrollMode.intervalId);
    };
    this.modes.default.scrollMode.start = () => {
      this.modes.default.scrollMode.stop();
      if (this.modes.default.scrollMode.mode === 1) {
        this.modes.default.scrollMode.right();
      } else if (this.modes.default.scrollMode.mode === -1) {
        this.modes.default.scrollMode.left();
      }
    };
    if (this.modes.mode === "default") this.modes.default.scrollMode.start();

    /**
     * 时间模式
     */
    this.modes.clock = {};
    this.modes.clock.ledData = Array(this.model.config.matrixWidth).fill(
      Array(this.model.config.matrixHeight).fill(0)
    );

    // 只在打开时获取一次
    this.modes.clock.weekData = ledUtils.getWeekArray();

    // 心跳显示数据 一大一小循环
    this.modes.clock.heartDataArr = [
      ledUtils.replaceBaseArrayColor(
        ledBaseArray.heart1,
        this.model.config.color
      ),
      ledUtils.replaceBaseArrayColor(
        ledBaseArray.heart2,
        this.model.config.color
      ),
    ];
    this.modes.clock.heartData = this.modes.clock.heartDataArr[0];

    this.modes.clock.timeData = ledUtils.replaceBaseArrayColor(
      ledUtils.getTimeArray(),
      this.model.config.color
    );

    // 爱心动画 播放顺序记录
    let currentIndex = 0;
    this.modes.clock.update = () => {
      // heartData 的值为当前数组索引对应的元素
      this.modes.clock.heartData = this.modes.clock.heartDataArr[currentIndex];

      this.modes.clock.timeData = ledUtils.replaceBaseArrayColor(
        ledUtils.getTimeArray(),
        this.model.config.color
      );

      this.modes.clock.ledData = ledUtils.mergeIntoArray(
        this.modes.clock.ledData,
        [
          { col: 0, row: 0, array: this.modes.clock.heartData },
          { col: 12, row: 1, array: this.modes.clock.timeData },
          { col: 12, row: 7, array: this.modes.clock.weekData },
        ]
      );

      // 更新索引，如果超过数组的长度，则重置为 0
      currentIndex = (currentIndex + 1) % this.modes.clock.heartDataArr.length;
    };

    // 更新间隔标识 用来暂停时间
    this.modes.clock.intervalId = null;
    this.modes.clock.start = () => {
      this.modes.clock.update();
      this.modes.clock.intervalId = setInterval(this.modes.clock.update, 1000);
    };
    this.modes.clock.stop = () => {
      clearInterval(this.modes.clock.intervalId);
    };
    if (this.modes.mode === "clock") this.modes.clock.start();

    /**
     * 粉丝模式
     */
    this.modes.fans = {};
    this.modes.fans.ledData = Array(this.model.config.matrixWidth).fill(
      Array(this.model.config.matrixHeight).fill(0)
    );
    this.modes.fans.bilibiliDataArray = [
      ledUtils.replaceBaseArrayColor(ledBaseArray.bilibili0, "#44a0fc"),
      ledUtils.replaceBaseArrayColor(ledBaseArray.bilibili1, "#44a0fc"),
    ];
    this.modes.fans.bilibiliData = this.modes.fans.bilibiliDataArray[0];

    this.modes.fans.fansNum = this.localStorage
      ? this.localStorage.fansNum
      : 666;
    this.modes.fans.numData = ledUtils.replaceBaseArrayColor(
      ledUtils.numToArray(this.modes.fans.fansNum, 7),
      this.model.config.color
    );
    // 目前是固定的情况
    this.modes.fans.numStartCol =
      (29 - this.modes.fans.numData.length) / 2 + 10;

    // B站动画播放
    let bilibiliCurrentIndex = 0;
    this.modes.fans.update = () => {
      this.modes.fans.bilibiliData =
        this.modes.fans.bilibiliDataArray[bilibiliCurrentIndex];

      this.modes.fans.ledData = ledUtils.mergeIntoArray(
        this.modes.fans.ledData,
        [
          {
            col: 1,
            row: 0,
            array: this.modes.fans.bilibiliData,
          },
          {
            col: this.modes.fans.numStartCol,
            row: 2,
            array: this.modes.fans.numData,
          },
        ]
      );

      // 更新索引，如果超过数组的长度，则重置为 0
      bilibiliCurrentIndex =
        (bilibiliCurrentIndex + 1) % this.modes.fans.bilibiliDataArray.length;
    };

    this.modes.fans.intervalId = null;
    this.modes.fans.start = () => {
      this.modes.fans.update();
      this.modes.fans.intervalId = setInterval(this.modes.fans.update, 500);
    };
    this.modes.fans.stop = () => {
      clearInterval(this.modes.fans.intervalId);
    };
    if (this.modes.mode === "fans") this.modes.fans.start();

    /**
     * 监听模式切换
     */
    window.addEventListener("message", (event) => {
      if (event.data.type === "matrix-led") {
        this.getLocalStorage();
        this.modes.clock.stop();
        this.modes.default.scrollMode.stop();
        this.modes.fans.stop();

        if (!this.localStorage) return;

        if (this.localStorage.modes.mode !== this.modes.mode) {
          this.modes.mode = this.localStorage.modes.mode;
        }

        if (this.modes.mode === "default") {
          this.modes.default.scrollMode.mode = this.localStorage.scrollMode;
          this.modes.default.scrollMode.start();

          if (this.localStorage.ledData.length <= 0) return;
          this.modes.default.ledData = this.localStorage.ledData;
        }

        if (this.modes.mode === "clock") this.modes.clock.start();

        if (this.modes.mode === "fans") this.modes.fans.start();

        gsap.fromTo(
          this.model.material.uniforms.uColorStrength,
          { value: 0 },
          { value: 1, duration: 1 }
        );
      }
    });
  }

  update() {
    // 一个二维数组[40][9] led显示的最终数据，不管什么模式直接赋值给这个就行
    this.modes.ledData = this.modes[this.modes.mode].ledData;

    for (let col = 0; col < this.model.config.matrixWidth; col++) {
      for (let row = 0; row < this.model.config.matrixHeight; row++) {
        const index = col * this.model.config.matrixHeight + row;
        const ledValue = this.modes.ledData[col][row];

        // 如果 ledValue 是 0 那么显示 baseColor
        // 如果 ledValue 是 1 那么显示 color
        // 如果是颜色就显示本身自己
        let color = this.model.config.baseColor;
        if (ledValue === 0) {
          color = this.model.config.baseColor;
        } else if (ledValue === 1) {
          color = this.model.config.color;
        } else {
          color = ledValue;
        }

        this.model.mesh.setColorAt(index, new THREE.Color(color));
      }
    }
    // 更新 mesh 的颜色
    this.model.mesh.instanceColor.needsUpdate = true;
  }
}
