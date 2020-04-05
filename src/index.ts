import * as THREE from "three";
export default abstract class ThreeForVue {
  public currentScene?: THREE.Scene | null;
  public currentCamera?: THREE.Camera | null;
  public resizeInterval: number;
  public mouseX: number = 0;
  public mouseY: number = 0;
  public mouseRatioX: number = 0;
  public mouseRatioY: number = 0;
  private _renderer?: THREE.WebGLRenderer | null;
  private _width: number;
  private _height: number;
  private resizeTime: number;
  private animating: boolean;
  private prevTime: number;
  constructor() {
    this.resizeInterval = 100;
    this._width = 0;
    this._height = 0;
    this.resizeTime = 0;
    this.animating = false;
    this.prevTime = 0;
  }
  private execAnimate(time: number) {
    if (!this.animating) return;
    // calculate deltaTime
    const deltaTime = (time > 0 && this.prevTime > 0) ? time - this.prevTime : 0;
    this.prevTime = time;
    // delayed changeSize
    if (this.resizeTime + this.resizeInterval < time) {
      this.resizeTime = time;
      this.changeSize();
    }
    // animate and render
    this.animate(deltaTime);
    if (this._renderer && this.currentCamera && this.currentScene) {
      this._renderer.render(this.currentScene, this.currentCamera);
    }
    // next frame
    requestAnimationFrame((t) => {
      this.execAnimate(t);
    });
  }
  private destroyRenderer() {
    if (this._renderer) {
      this._renderer.dispose();
      this._renderer = null;
    }
  }
  private createRenderer(canvas: HTMLCanvasElement) {
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas
    });
  }
  private changeSize() {
    if (!this._renderer) return;
    if (this._width == this._renderer.domElement.width && this._height == this._renderer.domElement.height) return;
    this._renderer.setSize(this._width, this._height, false);
    this._renderer.domElement.style.width = `${this._width}px`;
    this._renderer.domElement.style.height = `${this._height}px`;
    this.resize(this._renderer.domElement.width, this._renderer.domElement.height);
  }
  private createMouseEvent() {
    if (!this._renderer) return;
    this._renderer.domElement.addEventListener('mousedown', this._mouseDown);
    this._renderer.domElement.addEventListener('mousemove', this._mouseMove);
    this._renderer.domElement.addEventListener('mouseup', this._mouseUp);
  }
  private removeMouseEvent() {
    if (!this._renderer) return;
    this._renderer.domElement.removeEventListener('mousedown', this._mouseDown);
    this._renderer.domElement.removeEventListener('mousemove', this._mouseMove);
    this._renderer.domElement.removeEventListener('mouseup', this._mouseUp);
  }
  private _mouseDown = (event: MouseEvent) => {
    this.updateMouse(event);
    this.mouseDown(event);
  }
  private _mouseMove = (event: MouseEvent) => {
    this.updateMouse(event);
    this.mouseMove(event);
  }
  private _mouseUp = (event:MouseEvent) => {
    this.mouseUp(event);
  }
  private updateMouse(event: MouseEvent) {
    if (!this._renderer) return;
    this.mouseRatioX = event.offsetX / this._width;
    this.mouseRatioY = event.offsetY / this._height;
    this.mouseX = this.mouseRatioX * this._renderer.domElement.width;
    this.mouseY = this.mouseRatioY * this._renderer.domElement.height;
  }
  public mouseDown(event: MouseEvent) { event; }
  public mouseMove(event: MouseEvent) { event; }
  public mouseUp(event: MouseEvent) { event; }
  public abstract animate(deltaTime: number): void;
  public abstract resize(width: number, height: number): void;
  public setSize(width: number, height: number, force: boolean = false) {
    if (width < 0) width = 0;
    if (height < 0) height = 0;
    this._width = width;
    this._height = height;
    if (force) {
      this.changeSize();
    }
  }
  public mount(canvas: HTMLCanvasElement) {
    this.destroy();
    this.createRenderer(canvas);
    this.createMouseEvent();
    this.changeSize();
    this.animating = true;
    this.execAnimate(-1);
  }
  public destroy() {
    this.removeMouseEvent();
    this.destroyRenderer();
    this.animating = false;
  }
  public get width() {
    return this._width;
  }
  public get height() {
    return this._height;
  }
  public get renderer() {
    return this._renderer;
  }
}