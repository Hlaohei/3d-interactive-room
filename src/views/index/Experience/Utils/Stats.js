import StatsJs from "stats.js";

export default class Stats {
  constructor(_active) {
    this.instance = new StatsJs();
    this.instance.showPanel(0);

    this.active = false;
    this.max = 40;
    this.ignoreMaxed = true;

    if (_active) {
      this.activate();
    }
  }

  /**
   * 激活 stats 帧率显示
   */
  activate() {
    this.active = true;
    document.body.appendChild(this.instance.domElement);
  }

  /**
   * 停止 stats 帧率显示
   */
  deactivate() {
    this.active = false;
    document.body.removeChild(this.instance.domElement);
  }

  /**
   * 更新 stats 帧率显示
   */
  update() {
    if (!this.active) {
      return;
    }
    this.instance.update();
  }

  /**
   * 销毁 stats 帧率显示
   */
  destroy() {
    this.deactivate();
  }
}
