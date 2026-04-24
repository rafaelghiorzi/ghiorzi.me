"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// ─── Shaders ──────────────────────────────────────────────────────────────────

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
  uniform vec4  uBlobs[50];
  uniform float uGlow;
  uniform float uTubeRadius;
  uniform float uTubeHeight;
  uniform vec3  uBaseColor;
  uniform vec3  uHotColor;
  uniform vec3  uCamPos;
  uniform vec3  uCamRight;
  uniform vec3  uCamUp;
  uniform vec3  uCamForward;
  uniform float uFov;
  uniform float uMaxDist;

  const int   MAX_STEPS = 140;
  const float SURF_DIST = 0.0018;

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float sdSphere(vec3 p, vec3 c, float r) { return length(p - c) - r; }

  float sdCylinder(vec3 p, float r, float h) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
  }

  float wobble(vec3 p) {
    vec3 q = p * 3.5;
    float t = uTime * 0.6;
    float w = sin(q.x + t) * sin(q.y - t * 1.2) * sin(q.z + t * 0.8);
    w += 0.35 * sin(q.x * 1.7 - t * 0.7) * cos(q.z * 1.3 + t * 0.6);
    return w;
  }

  float metaballField(vec3 p) {
    float field = 0.0;
    for (int i = 0; i < 50; i++) {
      if (i >= uBlobCount) break;
      vec3  c    = uBlobs[i].xyz;
      float r    = uBlobs[i].w;
      float dist = max(length(p - c), 0.0005);
      field += (r * r) / (dist * dist);
    }
    return field;
  }

  float sdMetaballs(vec3 p) {
    float d = 10.0;
    for (int i = 0; i < 50; i++) {
      if (i >= uBlobCount) break;
      d = smin(d, sdSphere(p, uBlobs[i].xyz, uBlobs[i].w), 0.2);
    }
    return d + wobble(p) * 0.02;
  }

  float internalPointLight(vec3 p) {
    float glow = 0.0;
    for (int i = 0; i < 50; i++) {
      if (i >= uBlobCount) break;
      float dist = length(p - uBlobs[i].xyz);
      glow += (uBlobs[i].w * uBlobs[i].w) / (dist * dist + 0.02);
    }
    return glow;
  }

  float subsurfaceThickness(vec3 p, vec3 n) {
    float thickness = 0.0;
    float stepSize  = 0.06;
    for (int i = 1; i <= 5; i++) {
      float d = sdMetaballs(p - n * stepSize * float(i));
      thickness += smoothstep(0.0, 0.08, -d);
    }
    return thickness / 5.0;
  }

  /* camera is INSIDE the tube, so we raycast the metaballs freely */
  float sdScene(vec3 p) {
    float dMeta = sdMetaballs(p);
    float dTube = sdCylinder(p, uTubeRadius, uTubeHeight);
    return max(dMeta, dTube);
  }

  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      sdScene(p + e.xyy) - sdScene(p - e.xyy),
      sdScene(p + e.yxy) - sdScene(p - e.yxy),
      sdScene(p + e.yyx) - sdScene(p - e.yyx)
    ));
  }

  float raymarch(vec3 ro, vec3 rd, out vec3 hitPos, out float field) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      vec3  p = ro + rd * t;
      float d = sdScene(p);
      if (d < SURF_DIST) { hitPos = p; field = metaballField(p); return t; }
      t += d;
      if (t > uMaxDist) break;
    }
    field = 0.0;
    return -1.0;
  }

  /* Deep dark interior background — subtle vertical glow */
  vec3 insideBackground(vec3 rd) {
    float upness = rd.y * 0.5 + 0.5;
    vec3  deep   = vec3(0.01, 0.01, 0.015);
    vec3  warm   = uBaseColor * 0.06;
    vec3  bg     = mix(deep, warm, upness * upness);
    /* faint radial vignette so edges are darker */
    float rim = 1.0 - smoothstep(0.6, 1.0, length(rd.xz));
    return bg * rim;
  }

  void main() {
    vec2 uv  = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
    vec2 ndc = uv * 2.0;

    vec3 ro = uCamPos;
    vec3 rd = normalize(uCamForward + ndc.x * uCamRight * uFov + ndc.y * uCamUp * uFov);

    vec3  hitPos;
    float field;
    float t = raymarch(ro, rd, hitPos, field);

    vec3 bg = insideBackground(rd);

    if (t > 0.0) {
      vec3  n       = getNormal(hitPos);
      vec3  viewDir = normalize(ro - hitPos);
      float heat    = clamp((hitPos.y / uTubeHeight) * 0.5 + 0.5, 0.0, 1.0);
      vec3  lava    = mix(uBaseColor, uHotColor, heat);

      vec3  lightA = normalize(vec3( 0.6,  0.8, 0.4));
      vec3  lightB = normalize(vec3(-0.4,  0.2, 0.9));
      float specA  = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 80.0);
      float specB  = pow(max(dot(reflect(-lightB, n), viewDir), 0.0), 30.0);
      float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

      float inner      = clamp(metaballField(hitPos - n * 0.08) * 0.2, 0.0, 1.0);
      float fieldGlow  = smoothstep(0.75, 1.6, field);
      float thickness  = subsurfaceThickness(hitPos, n);
      float internalG  = internalPointLight(hitPos);

      float wrap  = 0.35;
      float wrapA = max((dot(n, lightA) + wrap) / (1.0 + wrap), 0.0);
      float wrapB = max((dot(n, lightB) + wrap) / (1.0 + wrap), 0.0);

      vec3 diffuse  = lava * (0.15 + 0.85 * (wrapA * 0.9 + wrapB * 0.4));
      vec3 spec     = vec3(1.0) * (specA + 0.4 * specB);
      vec3 emission = lava * (0.25 + 0.75 * fresnel) * uGlow;
      emission += lava * inner     * 0.9  * uGlow;
      emission += lava * fieldGlow * 0.4  * uGlow;
      emission += lava * thickness * (0.35 + internalG * 0.2) * uGlow;
      emission += lava * internalG * 0.08 * uGlow;

      vec3 color = diffuse + spec * 0.8 + emission;
      color = mix(color, color * color * 1.35, 0.35);

      gl_FragColor = vec4(color, 1.0);
    } else {
      gl_FragColor = vec4(bg, 1.0);
    }
  }
`;

// ─── Constants & helpers ──────────────────────────────────────────────────────

const MAX_BLOBS = 50;
const BLOB_COUNT = 6;
const TUBE_RADIUS = 1;
const TUBE_HEIGHT = 2;

function mulberry32(seed: number) {
    let t = seed >>> 0;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function randFloatSpread(range: number, rand: () => number) {
    return (rand() - 0.5) * range * 2;
}

interface Blob {
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    sizeFactor: number;
    radius: number;
    seed: number;
    phase: number;
    temp: number;
}

function randomInTube(radius: number, rand: () => number): THREE.Vector3 {
    const angle = rand() * Math.PI * 2;
    const safeRadius = Math.max(TUBE_RADIUS - radius * 1.2, 0.05);
    const r = Math.sqrt(rand()) * safeRadius;
    const y = THREE.MathUtils.lerp(
        -TUBE_HEIGHT + radius,
        TUBE_HEIGHT - radius,
        rand(),
    );
    return new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);
}

function initBlobs(rand: () => number, randSize: () => number): Blob[] {
    return Array.from({ length: MAX_BLOBS }, () => {
        const sizeFactor = randSize();
        const radius = THREE.MathUtils.lerp(0.08, 0.2, sizeFactor);
        return {
            pos: randomInTube(radius, rand),
            vel: new THREE.Vector3(
                randFloatSpread(0.2, rand),
                randFloatSpread(0.2, rand),
                randFloatSpread(0.2, rand),
            ),
            sizeFactor,
            radius,
            seed: rand() * 10,
            phase: rand() * Math.PI * 2,
            temp: rand(),
        };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LavaLampBackgroundProps {
    /** Primary blob colour. Default: warm orange-red */
    baseColor?: string;
    /** Hot (top) blob colour. Default: bright yellow-orange */
    hotColor?: string;
    /** Glow intensity 0–2. Default: 0.85 */
    glow?: number;
    /** Bloom strength 0–1. Default: 0.2 */
    bloom?: number;
    /** Speed multiplier. Default: 0.13 */
    speed?: number;
    className?: string;
}

export default function LavaLampBackground({
    baseColor = "#ff4820",
    hotColor = "#ffb040",
    glow = 0.6,
    bloom = 0.2,
    speed = 0.13,
    className = "",
}: LavaLampBackgroundProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        // ── Renderer ──────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.4, 3));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        container.appendChild(renderer.domElement);

        // ── Scene & cameras ───────────────────────────────────────────────────
        const scene = new THREE.Scene();
        const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        /* Camera sitting INSIDE the tube, slightly below centre, tilted up */
        const orbitCamera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.02,
            50,
        );
        orbitCamera.position.set(0, 0, 3.5);
        orbitCamera.lookAt(0, 0, 0);

        // ── Blob simulation ───────────────────────────────────────────────────
        const rand = mulberry32(42);
        const randSize = mulberry32(139);
        const blobs = initBlobs(rand, randSize);

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
            uTubeRadius: { value: TUBE_RADIUS },
            uTubeHeight: { value: TUBE_HEIGHT },
            uBaseColor: { value: new THREE.Color(baseColor) },
            uHotColor: { value: new THREE.Color(hotColor) },
            uCamPos: { value: new THREE.Vector3() },
            uCamRight: { value: new THREE.Vector3() },
            uCamUp: { value: new THREE.Vector3() },
            uCamForward: { value: new THREE.Vector3() },
            uFov: { value: 1.0 },
            uMaxDist: { value: 12.0 },
        };

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
            }),
        );
        mesh.frustumCulled = false;
        scene.add(mesh);

        // ── Post-processing ───────────────────────────────────────────────────
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, screenCamera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            bloom,
            0.6,
            0.15,
        );
        composer.addPass(bloomPass);

        // ── Camera vectors (reused every frame) ───────────────────────────────
        const camPos = new THREE.Vector3();
        const camRight = new THREE.Vector3();
        const camUp = new THREE.Vector3();
        const camForward = new THREE.Vector3();
        const tempVec = new THREE.Vector3();

        function updateCameraUniforms() {
            orbitCamera.updateMatrixWorld();
            orbitCamera.getWorldPosition(camPos);
            orbitCamera.getWorldDirection(camForward);
            camRight
                .setFromMatrixColumn(orbitCamera.matrixWorld, 0)
                .normalize();
            camUp.setFromMatrixColumn(orbitCamera.matrixWorld, 1).normalize();

            uniforms.uCamPos.value.copy(camPos);
            uniforms.uCamForward.value.copy(camForward);
            uniforms.uCamRight.value.copy(camRight);
            uniforms.uCamUp.value.copy(camUp);
            uniforms.uFov.value = Math.tan(
                THREE.MathUtils.degToRad(orbitCamera.fov * 0.5),
            );
            uniforms.uMaxDist.value = camPos.length() + TUBE_HEIGHT * 3 + 6;
        }

        // ── Simulation step ───────────────────────────────────────────────────
        function stepSimulation(dt: number, time: number) {
            const swirl = 0.9 * speed;
            const buoyancy = 1.1 * speed;
            const jitter = 0.25 * speed;
            const heatRate = 0.35 * speed;
            const coolRate = 0.32 * speed;
            const relaxRate = 0.25 * speed;
            const heatZone = -TUBE_HEIGHT * 0.35;
            const coolZone = TUBE_HEIGHT * 0.35;

            for (let i = 0; i < BLOB_COUNT; i++) {
                const blob = blobs[i];

                if (blob.pos.y < heatZone)
                    blob.temp = Math.min(1, blob.temp + heatRate * dt);
                else if (blob.pos.y > coolZone)
                    blob.temp = Math.max(0, blob.temp - coolRate * dt);
                else blob.temp += (0.5 - blob.temp) * relaxRate * dt;

                const thermal = (blob.temp - 0.5) * 2.0;
                const pulse = Math.sin(time * 0.6 + blob.phase) * 0.2 * speed;

                blob.vel.y += (thermal * buoyancy + pulse) * dt;
                blob.vel.x += -blob.pos.z * swirl * dt;
                blob.vel.z += blob.pos.x * swirl * dt;
                blob.vel.x += Math.sin(time * 0.7 + blob.seed) * jitter * dt;
                blob.vel.z +=
                    Math.cos(time * 0.6 + blob.seed * 1.3) * jitter * dt;
                blob.vel.multiplyScalar(1.0 - 0.75 * dt);

                tempVec.copy(blob.vel).multiplyScalar(dt);
                blob.pos.add(tempVec);

                // tube boundary
                const radial = Math.hypot(blob.pos.x, blob.pos.z);
                const limit = Math.max(TUBE_RADIUS - blob.radius * 0.9, 0.02);
                if (radial > limit) {
                    const s = limit / radial;
                    blob.pos.x *= s;
                    blob.pos.z *= s;
                    blob.vel.x *= -0.35;
                    blob.vel.z *= -0.35;
                }
                if (blob.pos.y > TUBE_HEIGHT - blob.radius) {
                    blob.pos.y = TUBE_HEIGHT - blob.radius;
                    blob.vel.y *= -0.35;
                } else if (blob.pos.y < -TUBE_HEIGHT + blob.radius) {
                    blob.pos.y = -TUBE_HEIGHT + blob.radius;
                    blob.vel.y *= -0.35;
                }
            }
        }

        function updateBlobUniforms() {
            for (let i = 0; i < MAX_BLOBS; i++) {
                const blob = blobs[i];
                if (i < BLOB_COUNT) {
                    blobUniforms[i].set(
                        blob.pos.x,
                        blob.pos.y,
                        blob.pos.z,
                        blob.radius,
                    );
                } else {
                    blobUniforms[i].set(0, -10, 0, 0);
                }
            }
        }

        // ── Slow camera drift — feels like we're floating inside ──────────────
        let time = 0;
        let lastTime = performance.now();
        const baseCamY = -0.2;
        const baseCamZ = 0.55;

        function animate(now: number) {
            const dt = Math.min((now - lastTime) / 1000, 0.033);
            lastTime = now;
            time += dt;

            stepSimulation(dt, time);
            updateBlobUniforms();
            uniforms.uTime.value = time;
            updateCameraUniforms();

            composer.render();
            animFrameId = requestAnimationFrame(animate);
        }

        let animFrameId = requestAnimationFrame(animate);

        // ── Resize ────────────────────────────────────────────────────────────
        const observer = new ResizeObserver(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            composer.setSize(w, h);
            bloomPass.setSize(w, h);
            orbitCamera.aspect = w / h;
            orbitCamera.updateProjectionMatrix();
            uniforms.uResolution.value.set(
                w * renderer.getPixelRatio(),
                h * renderer.getPixelRatio(),
            );
        });
        observer.observe(container);

        // ── Cleanup ───────────────────────────────────────────────────────────
        return () => {
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
