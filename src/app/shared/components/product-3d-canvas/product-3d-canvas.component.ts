import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  effect,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Product } from '../../../core/models/product.model';
import { TelemetryService } from '../../../core/services/telemetry.service';

export type LightingPreset = 'studio' | 'warm' | 'cyber';

@Component({
  selector: 'app-product-3d-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-3d-canvas.component.html',
  styleUrls: ['./product-3d-canvas.component.css']
})
export class Product3dCanvasComponent implements OnInit, OnDestroy {
  @Input({ required: true }) product!: Product;
  @Input() heightClass: string = 'h-96 md:h-[500px]';
  @Input() interactive: boolean = true;

  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  // UI state signals
  public readonly isLoading = signal<boolean>(true);
  public readonly loadingProgress = signal<number>(0);
  public readonly isAutoRotating = signal<boolean>(false);
  public readonly isWireframe = signal<boolean>(false);
  public readonly currentLighting = signal<LightingPreset>('studio');
  public readonly currentColorHex = signal<string>('');
  public readonly totalRotations = signal<number>(0);
  public readonly currentZoomLevel = signal<string>('1.0x');
  public readonly isFullscreen = signal<boolean>(false);

  // Three.js internal references
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: OrbitControls;
  private currentModel?: THREE.Group;
  private animationFrameId?: number;
  private dirLight?: THREE.DirectionalLight;
  private ambLight?: THREE.AmbientLight;
  private fillLight?: THREE.PointLight;
  private rimLight?: THREE.PointLight;
  private lastAzimuthAngle: number = 0;
  private rotationAccumulator: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit(): void {
    if (this.product.model3D.availableColors.length > 0) {
      this.currentColorHex.set(this.product.model3D.availableColors[0].hex);
    }
    this.initThree();
    this.loadModel();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.disposeThree();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.handleResize();
  }

  private initThree(): void {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8fafc); // slate-50

    // 2. Camera
    const [cx, cy, cz] = this.product.model3D.cameraPosition || [0, 0.5, 2];
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(cx, cy, cz);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 6.0;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.15; // prevent going too far below floor
    this.controls.enabled = this.interactive;

    // Track user rotation telemetry
    this.controls.addEventListener('change', () => {
      if (!this.controls) return;
      const angle = this.controls.getAzimuthalAngle();
      const diff = Math.abs(angle - this.lastAzimuthAngle);
      this.lastAzimuthAngle = angle;
      this.rotationAccumulator += diff;
      if (this.rotationAccumulator >= Math.PI / 2) {
        this.totalRotations.update(v => v + 1);
        this.telemetryService.recordRotation();
        this.rotationAccumulator = 0;
      }

      if (this.camera) {
        const dist = this.camera.position.distanceTo(this.controls.target);
        const normZoom = (2.2 / Math.max(0.5, dist)).toFixed(1);
        this.currentZoomLevel.set(`${normZoom}x`);
      }
    });

    // 5. Lights
    this.setupLighting();

    // 6. Subtle Floor Shadow Plane
    this.setupFloorShadow();

    // 7. Responsive Observer
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(container);
    }

    // 8. Start Loop
    this.animate();
  }

  private setupLighting(): void {
    if (!this.scene) return;

    this.ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(this.ambLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    this.dirLight.position.set(3, 6, 4);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 15;
    this.dirLight.shadow.bias = -0.001;
    this.scene.add(this.dirLight);

    this.fillLight = new THREE.PointLight(0xffffff, 0.8, 10);
    this.fillLight.position.set(-3, 2, -2);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.PointLight(0x38bdf8, 1.2, 8);
    this.rimLight.position.set(0, 3, -3);
    this.scene.add(this.rimLight);

    this.applyLightingPreset(this.currentLighting());
  }

  private setupFloorShadow(): void {
    if (!this.scene) return;
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.65;
    shadowMesh.receiveShadow = true;
    this.scene.add(shadowMesh);

    // Subtle grid guide
    const grid = new THREE.GridHelper(6, 20, 0xe2e8f0, 0xf1f5f9);
    grid.position.y = -0.651;
    this.scene.add(grid);
  }

  private loadModel(): void {
    this.isLoading.set(true);
    this.loadingProgress.set(10);

    const loader = new GLTFLoader();
    const modelUrl = this.product.model3D.modelUrl;

    loader.load(
      modelUrl,
      (gltf) => {
        this.loadingProgress.set(100);
        this.isLoading.set(false);

        const model = gltf.scene;
        this.currentModel = model;

        const [rx, ry, rz] = this.product.model3D.initialRotation || [0, 0, 0];
        const [px, py, pz] = this.product.model3D.initialPosition || [0, 0, 0];
        const scale = this.product.model3D.scale || 1.0;

        model.scale.set(scale, scale, scale);
        model.rotation.set(rx, ry, rz);
        model.position.set(px, py, pz);

        // Center and normalize geometry bounds
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.2, mat.roughness ?? 0.5);
              mat.metalness = Math.min(0.9, mat.metalness ?? 0.1);
              mat.needsUpdate = true;
            }
          }
        });

        if (this.scene) {
          this.scene.add(model);
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          this.loadingProgress.set(percent);
        }
      },
      (error) => {
        console.warn('GLTF loading error, activating high-fidelity fallback procedural mesh:', error);
        this.buildFallbackProductMesh();
        this.isLoading.set(false);
      }
    );
  }

  /**
   * Resilient Fallback: If external network is slow, generates a high-fidelity 3D PBR mesh
   */
  private buildFallbackProductMesh(): void {
    if (!this.scene) return;
    const group = new THREE.Group();

    if (this.product.id.includes('sneaker')) {
      // High detail procedural sneaker
      const soleGeo = new THREE.BoxGeometry(0.8, 0.18, 1.8);
      const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.position.set(0, -0.2, 0);
      sole.castShadow = true;
      group.add(sole);

      const upperGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 24);
      const upperMat = new THREE.MeshStandardMaterial({ color: 0xd92323, roughness: 0.4, metalness: 0.1 });
      const upper = new THREE.Mesh(upperGeo, upperMat);
      upper.position.set(0, 0.2, -0.1);
      upper.rotation.x = 0.2;
      upper.castShadow = true;
      group.add(upper);

      const toeGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const toe = new THREE.Mesh(toeGeo, upperMat);
      toe.position.set(0, 0.05, 0.5);
      toe.scale.set(0.9, 0.6, 1.2);
      toe.castShadow = true;
      group.add(toe);
    } else if (this.product.id.includes('chair')) {
      // Procedural modern velvet lounge chair
      const seatGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x1e483e, roughness: 0.6 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.set(0, 0, 0);
      seat.castShadow = true;
      group.add(seat);

      const backGeo = new THREE.BoxGeometry(1.2, 1.1, 0.2);
      const back = new THREE.Mesh(backGeo, seatMat);
      back.position.set(0, 0.55, -0.5);
      back.rotation.x = -0.1;
      back.castShadow = true;
      group.add(back);

      // 4 wooden legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.8, 16);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
      const offsets = [
        [-0.45, -0.4, 0.45],
        [0.45, -0.4, 0.45],
        [-0.45, -0.4, -0.45],
        [0.45, -0.4, -0.45]
      ];
      offsets.forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        leg.rotation.z = x > 0 ? -0.15 : 0.15;
        leg.castShadow = true;
        group.add(leg);
      });
    } else {
      // Procedural thermal bottle
      const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 32);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.85, roughness: 0.25 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      group.add(body);

      const capGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.3, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.5, roughness: 0.4 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(0, 0.85, 0);
      cap.castShadow = true;
      group.add(cap);
    }

    this.currentModel = group;
    this.scene.add(group);
  }

  // --- Interactive Toolbar Actions ---

  public toggleAutoRotate(): void {
    const next = !this.isAutoRotating();
    this.isAutoRotating.set(next);
    if (this.controls) {
      this.controls.autoRotate = next;
      this.controls.autoRotateSpeed = 2.5;
    }
    if (next) {
      this.telemetryService.recordRotation();
    }
  }

  public toggleWireframe(): void {
    const next = !this.isWireframe();
    this.isWireframe.set(next);
    if (this.currentModel) {
      this.currentModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => {
              if ('wireframe' in m) {
                (m as THREE.MeshStandardMaterial).wireframe = next;
              }
            });
          } else if (mesh.material && 'wireframe' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).wireframe = next;
          }
        }
      });
    }
  }

  public setLighting(preset: LightingPreset): void {
    this.currentLighting.set(preset);
    this.applyLightingPreset(preset);
  }

  private applyLightingPreset(preset: LightingPreset): void {
    if (!this.ambLight || !this.dirLight || !this.fillLight || !this.rimLight || !this.scene) return;

    if (preset === 'studio') {
      this.scene.background = new THREE.Color(0xf8fafc);
      this.ambLight.color.setHex(0xffffff);
      this.ambLight.intensity = 1.3;
      this.dirLight.color.setHex(0xffffff);
      this.dirLight.intensity = 2.2;
      this.fillLight.color.setHex(0xe2e8f0);
      this.rimLight.color.setHex(0x38bdf8);
      this.rimLight.intensity = 1.0;
    } else if (preset === 'warm') {
      this.scene.background = new THREE.Color(0xfbf8f3);
      this.ambLight.color.setHex(0xfff3e0);
      this.ambLight.intensity = 1.4;
      this.dirLight.color.setHex(0xffe0b2);
      this.dirLight.intensity = 2.5;
      this.fillLight.color.setHex(0xffcc80);
      this.rimLight.color.setHex(0xfbbf24);
      this.rimLight.intensity = 0.8;
    } else if (preset === 'cyber') {
      this.scene.background = new THREE.Color(0x0f172a); // dark slate
      this.ambLight.color.setHex(0x1e293b);
      this.ambLight.intensity = 0.8;
      this.dirLight.color.setHex(0xa855f7); // neon purple
      this.dirLight.intensity = 3.0;
      this.fillLight.color.setHex(0x06b6d4); // cyan
      this.rimLight.color.setHex(0xec4899); // hot pink
      this.rimLight.intensity = 2.5;
    }
  }

  public changeColor(hex: string): void {
    this.currentColorHex.set(hex);
    this.telemetryService.recordColorChange();

    if (!this.currentModel) return;

    const targetColor = new THREE.Color(hex);

    this.currentModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = mesh.name.toLowerCase();

        // Target the main body or visible materials
        const isTargetMesh =
          meshName.includes('shoe') ||
          meshName.includes('upper') ||
          meshName.includes('seat') ||
          meshName.includes('cushion') ||
          meshName.includes('bottle') ||
          meshName.includes('body') ||
          meshName.includes('fabric') ||
          meshName.includes('leather') ||
          !meshName;

        if (isTargetMesh && mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ('color' in mat) (mat as THREE.MeshStandardMaterial).color.set(targetColor);
            });
          } else if ('color' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(targetColor);
          }
        }
      }
    });
  }

  public zoomIn(): void {
    if (!this.camera || !this.controls) return;
    const factor = 0.8;
    this.camera.position.sub(this.controls.target).multiplyScalar(factor).add(this.controls.target);
    this.controls.update();
    this.telemetryService.recordZoom();
  }

  public zoomOut(): void {
    if (!this.camera || !this.controls) return;
    const factor = 1.25;
    this.camera.position.sub(this.controls.target).multiplyScalar(factor).add(this.controls.target);
    this.controls.update();
    this.telemetryService.recordZoom();
  }

  public resetCamera(): void {
    if (!this.camera || !this.controls) return;
    const [cx, cy, cz] = this.product.model3D.cameraPosition || [0, 0.4, 2];
    this.camera.position.set(cx, cy, cz);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  public toggleFullscreen(): void {
    const el = this.containerRef.nativeElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => this.isFullscreen.set(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => this.isFullscreen.set(false)).catch(() => {});
    }
  }

  private handleResize(): void {
    const container = this.containerRef?.nativeElement;
    if (!container || !this.renderer || !this.camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    if (this.controls) {
      this.controls.update();
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private disposeThree(): void {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
    if (this.scene) {
      this.scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
    }
  }
}
