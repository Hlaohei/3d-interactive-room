import Experience from "../Experience";

import * as THREE from "three";

import vertexShader from "../shaders/teaSteam/vertex.glsl?raw";
import fragmentShader from "../shaders/teaSteam/fragment.glsl?raw";

export default class TeaSteam {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "茶水蒸汽",
        expanded: true,
      });
    }

    this.setModel();
  }

  setModel() {
    this.model = {};
    this.model.color = "#e5e5e5";

    this.model.material = new THREE.ShaderMaterial({
      wireframe: false,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTimeFrequency: { value: 0.0004 },
        uUvFrequency: { value: new THREE.Vector2(4, 5) },
        uColor: { value: new THREE.Color(this.model.color) },
      },
      vertexShader,
      fragmentShader,
    });

    this.model.mesh = this.resources.items.teaSteamModel.scene.children[0];
    this.model.mesh.material = this.model.material;
    this.model.mesh.rotation.z = Math.PI * 0.25;

    this.scene.add(this.model.mesh);

    // debug
    if (this.debug) {
      this.debugFolder.addInput(this.model.material, "wireframe", {
        label: "显示线条",
      });

      this.debugFolder
        .addInput(this.model, "color", {
          label: "颜色",
          view: "color",
        })
        .on("change", () => {
          this.model.material.uniforms.uColor.value.set(this.model.color);
        });

      this.debugFolder.addInput(
        this.model.material.uniforms.uTimeFrequency,
        "value",
        {
          label: "时间频率",
          min: 0.0001,
          max: 0.001,
          step: 0.0001,
        }
      );

      this.debugFolder.addInput(
        this.model.material.uniforms.uUvFrequency.value,
        "x",
        {
          label: "UV X",
          min: 0.001,
          max: 20,
          step: 0.001,
        }
      );

      this.debugFolder.addInput(
        this.model.material.uniforms.uUvFrequency.value,
        "y",
        {
          label: "UV Y",
          min: 0.001,
          max: 20,
          step: 0.001,
        }
      );
    }
  }

  update() {
    this.model.material.uniforms.uTime.value = this.time.elapsed;
  }
}
