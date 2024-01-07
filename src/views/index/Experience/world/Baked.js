import Experience from "../Experience";

import * as THREE from "three";
import gsap from "gsap";

import vertexShader from "../shaders/baked/vertex.glsl?raw";
import fragmentShader from "../shaders/baked/fragment.glsl?raw";

export default class Baked {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "基础模型显示",
        expanded: true,
      });
    }

    this.getLocalStorage();
    this.setModel();
  }

  getLocalStorage() {
    this.localStorage = JSON.parse(localStorage.getItem("light-control"));
  }

  setModel() {
    this.model = {};

    this.model.mesh = this.resources.items.finalModel.scene;

    this.model.bakedLightOffTexture = this.resources.items.bakedLightOffTexture;
    this.model.bakedLightOffTexture.flipY = false;
    // this.model.bakedLightOffTexture.colorSpace = THREE.SRGBColorSpace;

    this.model.bakedLightOnTexture = this.resources.items.bakedLightOnTexture;
    this.model.bakedLightOnTexture.flipY = false;
    // this.model.bakedLightOnTexture.colorSpace = THREE.SRGBColorSpace;

    this.model.bakedLightsTexture = this.resources.items.bakedLightsTexture;
    this.model.bakedLightsTexture.flipY = false;
    this.model.bakedLightsTexture.colorSpace = THREE.SRGBColorSpace;

    this.colors = {};
    this.colors.lights = this.localStorage
      ? this.localStorage.deskLightColor
      : "#ff74de";

    this.model.material = new THREE.ShaderMaterial({
      // transparent: true,
      // 显示线条
      wireframe: false,
      uniforms: {
        uBakedLightOffTexture: { value: this.model.bakedLightOffTexture },
        uBakedLightOnTexture: { value: this.model.bakedLightOnTexture },
        uBakedLightsTexture: { value: this.model.bakedLightsTexture },

        uLightMix: {
          value: this.localStorage ? this.localStorage.roomLightIntensity : 0,
        },

        uLightColor: { value: new THREE.Color(this.colors.lights) },
        uLightStrength: {
          value: this.localStorage ? this.localStorage.deskLightIntensity : 1,
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type === "light-control") {
          this.getLocalStorage();

          if (
            this.localStorage.roomLightIntensity !==
            this.model.material.uniforms.uLightMix.value
          ) {
            gsap.to(this.model.material.uniforms.uLightMix, {
              value: this.localStorage.roomLightIntensity,
              duration: 1,
            });
          }

          if (this.localStorage.deskLightColor !== this.colors.lights) {
            gsap.to(this.colors, {
              lights: this.localStorage.deskLightColor,
              duration: 1,
              onUpdate: () => {
                this.model.material.uniforms.uLightColor.value.set(
                  this.colors.lights
                );
              },
            });
          }

          if (
            this.localStorage.deskLightIntensity !==
            this.model.material.uniforms.uLightStrength.value
          ) {
            gsap.to(this.model.material.uniforms.uLightStrength, {
              value: this.localStorage.deskLightIntensity,
              duration: 1,
            });
          }
        }
      },
      false
    );

    if (this.debug) {
      this.debugFolder.addInput(
        this.model.material.uniforms.uLightMix,
        "value",
        {
          label: "房间开灯",
          min: 0,
          max: 1,
        }
      );

      this.debugFolder.addInput(this.model.material, "wireframe", {
        label: "显示线条",
      });

      this.debugFolder
        .addInput(this.colors, "lights", {
          label: "灯光颜色",
        })
        .on("change", () => {
          this.model.material.uniforms.uLightColor.value.set(
            this.colors.lights
          );
        });

      this.debugFolder.addInput(
        this.model.material.uniforms.uLightStrength,
        "value",
        {
          label: "灯光强度",
          min: 0,
          max: 1.5,
        }
      );
    }

    this.model.mesh.traverse((child) => {
      if (child.isMesh) {
        child.material = this.model.material;
      }
    });

    this.scene.add(this.model.mesh);
  }
}
