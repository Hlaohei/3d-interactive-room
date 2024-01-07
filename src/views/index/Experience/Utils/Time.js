import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.playing = true;

    this.tick = this.tick.bind(this);
    this.tick();
  }

  /**
   * Tick 整体 动画帧 渲染方法 更新页面
   */
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);

    const current = Date.now();

    this.delta = current - this.current;
    this.elapsed += this.playing ? this.delta : 0;
    this.current = current;

    if (this.delta > 60) {
      this.delta = 60;
    }

    if (this.playing) {
      this.trigger("tick");
    }
  }

  play() {
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}
