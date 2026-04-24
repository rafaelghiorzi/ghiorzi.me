"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform int   uBlobCount;
  uniform vec4  uBlobs[8];
  uniform float uGlow;
  uniform vec3  uBaseColor;
  uniform vec3  uHotColor;
  uniform vec3  uCamPos;
  uniform vec3  uCamRight;
  uniform vec3  uCamUp;
  uniform vec3  uCamForward;
  uniform float uFov;

  const int   MAX_STEPS = 56;
  const float SURF_DIST = 0.002;
  const float MAX_DIST  = 8.0;

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float sdSphere(vec3 p, vec3 c, float r) { return length(p - c) - r; }

  float wobble(vec3 p) {
    float t = uTime * 0.5;
    return sin(p.x * 4.0 + t) * sin(p.y * 3.7 - t * 1.1) * 0.018;
  }

  float sdMetaballs(vec3 p) {
    float d = 10.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      d = smin(d, sdSphere(p, uBlobs[i].xyz, uBlobs[i].w), 0.18);
    }
    return d + wobble(p);
  }

  float metaballField(vec3 p) {
    float f = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      float dist = max(length(p - uBlobs[i].xyz), 0.0005);
      f += (uBlobs[i].w * uBlobs[i].w) / (dist * dist);
    }
    return f;
  }

  float internalGlow(vec3 p) {
    float g = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      float dist = length(p - uBlobs[i].xyz);
      g += (uBlobs[i].w * uBlobs[i].w) / (dist * dist + 0.02);
    }
    return g;
  }

  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      sdMetaballs(p + e.xyy) - sdMetaballs(p - e.xyy),
      sdMetaballs(p + e.yxy) - sdMetaballs(p - e.yxy),
      sdMetaballs(p + e.yyx) - sdMetaballs(p - e.yyx)
    ));
  }

  float raymarch(vec3 ro, vec3 rd, out vec3 hitPos, out float field) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      vec3  p = ro + rd * t;
      float d = sdMetaballs(p);
      if (d < SURF_DIST) { hitPos = p; field = metaballField(p); return t; }
      t += max(d, 0.01);
      if (t > MAX_DIST) break;
    }
    field = 0.0;
    return -1.0;
  }

  void main() {
    vec2 uv  = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
    vec3 ro  = uCamPos;
    vec3 rd  = normalize(uCamForward + uv.x * uCamRight * uFov + uv.y * uCamUp * uFov);

    vec3  hitPos;
    float field;
    float t = raymarch(ro, rd, hitPos, field);

    if (t > 0.0) {
      vec3  n       = getNormal(hitPos);
      vec3  viewDir = normalize(ro - hitPos);

      float heat  = clamp(hitPos.y * 0.5 + 0.5, 0.0, 1.0);
      vec3  lava  = mix(uBaseColor, uHotColor, heat * heat);

      vec3  lightA = normalize(vec3( 0.5,  0.9, 0.6));
      vec3  lightB = normalize(vec3(-0.6,  0.3, 0.8));
      float specA  = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 72.0);
      float specB  = pow(max(dot(reflect(-lightB, n), viewDir), 0.0), 28.0);
      float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

      float wrap  = 0.4;
      float wrapA = max((dot(n, lightA) + wrap) / (1.0 + wrap), 0.0);
      float wrapB = max((dot(n, lightB) + wrap) / (1.0 + wrap), 0.0);

      float ig        = internalGlow(hitPos);
      float fieldGlow = smoothstep(0.6, 1.8, field);
      float inner     = clamp(metaballField(hitPos - n * 0.07) * 0.18, 0.0, 1.0);

      vec3 diffuse  = lava * (0.12 + 0.88 * (wrapA * 0.85 + wrapB * 0.35));
      vec3 spec     = vec3(0.9) * (specA + 0.35 * specB);
      vec3 emission = lava * (0.2 + 0.8 * fresnel) * uGlow;
      emission     += lava * inner     * 0.8  * uGlow;
      emission     += lava * fieldGlow * 0.35 * uGlow;
      emission     += lava * ig        * 0.06 * uGlow;

      vec3 color = diffuse + spec * 0.75 + emission;
      color = mix(color, color * color * 1.3, 0.3);

      float edgeFade = clamp(1.0 - smoothstep(0.8, 1.05, length(hitPos.xy) / 2.2), 0.0, 1.0);
      gl_FragColor = vec4(color, edgeFade);
    } else {
      gl_FragColor = vec4(0.0);
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Blob {
    pos: THREE.Vector3;
    radius: number;
    baseX: number;
    baseY: number;
    homeX: number;
    homeY: number;
    ampX: number;
    ampY: number;
    freqX: number;
    freqY: number;
    phaseX: number;
    phaseY: number;
    mouseSensitivity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_BLOBS = 8;
const CAM_Z = 5;
const CAM_FOV = 40;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
    let t = seed >>> 0;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

/** Visible half-extents at z=0 for our fixed camera setup */
function visibleBounds(aspect: number) {
    const halfH = Math.tan(THREE.MathUtils.degToRad(CAM_FOV * 0.5)) * CAM_Z;
    const halfW = halfH * aspect;
    return { halfW, halfH };
}

function initBlobs(
    rand: () => number,
    randSize: () => number,
    aspect: number,
): Blob[] {
    const { halfW, halfH } = visibleBounds(aspect);

    return Array.from({ length: MAX_BLOBS }, () => {
        const sizeFactor = randSize();
        const radius = 0.1 + sizeFactor * 0.22;

        // 80% of screen edges so blobs are fully visible on spawn
        const bx = (rand() - 0.5) * 2 * halfW * 0.8;
        const by = (rand() - 0.5) * 2 * halfH * 0.8;

        return {
            pos: new THREE.Vector3(0, 0, 0),
            radius,
            baseX: bx,
            baseY: by,
            homeX: bx, // permanent anchor — blobs always spring back here
            homeY: by,
            ampX: 0.18 + rand() * 0.32,
            ampY: 0.14 + rand() * 0.28,
            freqX: 0.1 + rand() * 0.12,
            freqY: 0.08 + rand() * 0.1,
            phaseX: rand() * Math.PI * 2,
            phaseY: rand() * Math.PI * 2,
            mouseSensitivity: rand() * 0.8,
        };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LavaLampBackgroundProps {
    baseColor?: string;
    hotColor?: string;
    glow?: number;
    bloom?: number;
    blobCount?: number;
    className?: string;
}

export default function LavaLampBackground({
    baseColor = "#1a1aff",
    hotColor = "#60efff",
    glow = 0.55,
    bloom = 0.18,
    blobCount = 8,
    className = "",
}: LavaLampBackgroundProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = mountRef.current!;
        if (!container) return;

        const BLOB_COUNT = Math.min(blobCount, MAX_BLOBS);

        // ── Renderer ──────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);

        // ── Scene & camera ────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.PerspectiveCamera(CAM_FOV, aspect, 0.01, 20);
        camera.position.set(0, 0, CAM_Z);
        camera.lookAt(0, 0, 0);

        // ── Blobs — spawned after camera aspect is known ──────────────────────
        const rand = mulberry32(42);
        const randSize = mulberry32(139);
        const blobs = initBlobs(rand, randSize, aspect);

        // ── Mouse → world coords ──────────────────────────────────────────────
        let mouseX = 0;
        let mouseY = 0;

        function screenToWorld(clientX: number, clientY: number) {
            const { halfW, halfH } = visibleBounds(camera.aspect);
            mouseX = (clientX / container.clientWidth - 0.5) * 2 * halfW;
            mouseY = -(clientY / container.clientHeight - 0.5) * 2 * halfH;
        }

        function onMouseMove(e: MouseEvent) {
            screenToWorld(e.clientX, e.clientY);
        }
        function onTouchMove(e: TouchEvent) {
            screenToWorld(e.touches[0].clientX, e.touches[0].clientY);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove, { passive: true });

        // ── Scroll parallax ───────────────────────────────────────────────────
        function onScroll() {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
            camera.position.y = -progress * 0.6;
            camera.lookAt(0, camera.position.y, 0);
        }
        window.addEventListener("scroll", onScroll);

        // ── Uniforms ──────────────────────────────────────────────────────────
        const blobUniforms = Array.from(
            { length: MAX_BLOBS },
            () => new THREE.Vector4(),
        );

        const uniforms = {
            uResolution: {
                value: new THREE.Vector2(
                    container.clientWidth,
                    container.clientHeight,
                ),
            },
            uTime: { value: 0 },
            uBlobCount: { value: BLOB_COUNT },
            uBlobs: { value: blobUniforms },
            uGlow: { value: glow },
            uBaseColor: { value: new THREE.Color(baseColor) },
            uHotColor: { value: new THREE.Color(hotColor) },
            uCamPos: { value: new THREE.Vector3() },
            uCamRight: { value: new THREE.Vector3() },
            uCamUp: { value: new THREE.Vector3() },
            uCamForward: { value: new THREE.Vector3() },
            uFov: { value: 1.0 },
        };

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
            }),
        );
        mesh.frustumCulled = false;
        scene.add(mesh);

        // ── Post-processing ───────────────────────────────────────────────────
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, screenCamera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(
                container.clientWidth / 2,
                container.clientHeight / 2,
            ),
            bloom,
            0.5,
            0.2,
        );
        composer.addPass(bloomPass);

        // ── Camera uniforms ───────────────────────────────────────────────────
        const _pos = new THREE.Vector3();
        const _right = new THREE.Vector3();
        const _up = new THREE.Vector3();
        const _forward = new THREE.Vector3();

        function syncCameraUniforms() {
            camera.updateMatrixWorld();
            camera.getWorldPosition(_pos);
            camera.getWorldDirection(_forward);
            _right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
            _up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();

            uniforms.uCamPos.value.copy(_pos);
            uniforms.uCamForward.value.copy(_forward);
            uniforms.uCamRight.value.copy(_right);
            uniforms.uCamUp.value.copy(_up);
            uniforms.uFov.value = Math.tan(
                THREE.MathUtils.degToRad(camera.fov * 0.5),
            );
        }

        // ── Simulation ────────────────────────────────────────────────────────
        const REPEL = 0.008;
        const RETURN = 0.012; // stronger than repel so blobs always drift home

        function stepSimulation(time: number) {
            for (let i = 0; i < BLOB_COUNT; i++) {
                const b = blobs[i];

                // push away from cursor
                const dx = b.baseX - mouseX;
                const dy = b.baseY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const falloff = 1.0 / (1.0 + dist * dist * 8.0);
                b.baseX += dx * REPEL * b.mouseSensitivity * falloff;
                b.baseY += dy * REPEL * b.mouseSensitivity * falloff;

                // spring back toward home
                b.baseX += (b.homeX - b.baseX) * RETURN;
                b.baseY += (b.homeY - b.baseY) * RETURN;

                // lazy sine-wave orbit around the drifting base
                b.pos.x =
                    b.baseX + Math.sin(time * b.freqX + b.phaseX) * b.ampX;
                b.pos.y =
                    b.baseY + Math.cos(time * b.freqY + b.phaseY) * b.ampY;
                b.pos.z = 0;
            }
        }

        function syncBlobUniforms() {
            for (let i = 0; i < MAX_BLOBS; i++) {
                if (i < BLOB_COUNT) {
                    const b = blobs[i];
                    blobUniforms[i].set(b.pos.x, b.pos.y, b.pos.z, b.radius);
                } else {
                    blobUniforms[i].set(0, -99, 0, 0.001);
                }
            }
        }

        // ── Render loop ───────────────────────────────────────────────────────
        let animFrameId: number;
        let time = 0;
        let lastTime = performance.now();

        function animate(now: number) {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            time += dt;

            stepSimulation(time);
            syncBlobUniforms();
            uniforms.uTime.value = time;
            syncCameraUniforms();
            composer.render();
            animFrameId = requestAnimationFrame(animate);
        }

        animFrameId = requestAnimationFrame(animate);

        // ── Resize ────────────────────────────────────────────────────────────
        const observer = new ResizeObserver(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            const pr = renderer.getPixelRatio();
            renderer.setSize(w, h);
            composer.setSize(w, h);
            bloomPass.setSize(w / 2, h / 2);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            uniforms.uResolution.value.set(w * pr, h * pr);
        });
        observer.observe(container);

        // ── Cleanup ───────────────────────────────────────────────────────────
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(animFrameId);
            observer.disconnect();
            renderer.dispose();
            composer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={mountRef}
            className={className}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: -1,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "transparent",
                pointerEvents: "none",
            }}
        />
    );
}
