# three-for-vue
# Install
```
npm install @takumus/three-for-vue
```
# Sample
### Create class
simpleBox.ts
```ts
import ThreeForVue from './@threeForVue';
import * as THREE from "three";
export default class SimpleBox extends ThreeForVue {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private box: THREE.Mesh;
  private time: number;
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,   // fov
      1,    // aspect
      0.01, // near
      10    // far
    );
    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshNormalMaterial()
    );
    this.scene.add(this.box);
    this.camera.position.y = 0.4;
    this.camera.lookAt(this.box.position);
    this.time = 0;
    // attach
    this.currentScene = this.scene;
    this.currentCamera = this.camera;
  }
  public animate(deltaTime: number) {
    this.box.rotation.x += deltaTime * 0.001;
    this.box.rotation.y += deltaTime * 0.002;
  }
  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
```
### Create Vue component
simpleBoxComponent.vue
```vue
<template>
  <div class="parent" ref="parent">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<style>
  .parent {
    width: 100%;
    height: 300px;
  }
</style>
<script lang="ts">
import SimpleBox from './simpleBox';
import { Component, Vue, Ref } from 'vue-property-decorator';
@Component
export default class About extends Vue {
  // refs
  @Ref() canvas!: HTMLCanvasElement;
  @Ref() parent!: HTMLElement;
  // datas
  rotatingBox = new SimpleBox();
  mounted() {
    this.rotatingBox.mount(this.canvas);
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  destroyed() {
    this.rotatingBox.destroy();
    window.removeEventListener('resize', this.resize);
  }
  resize() {
    const rect = this.parent.getBoundingClientRect();
    this.rotatingBox.setSize(rect.width, rect.height);
  }
}
</script>
```
### Use
```vue
<SimpleBoxComponent></SimpleBoxComponent>
```
