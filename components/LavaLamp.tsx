"use client";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ─── Glass Geometry Constants ─────────────────────────────────────────────────
const GLASS_RADIUS_TOP = 1.0;
const GLASS_RADIUS_BOTTOM = 1.87;
const GLASS_TOP = 2.7;
const GLASS_BOTTOM = -2.7;
const GLASS_HEIGHT = GLASS_TOP - GLASS_BOTTOM; // 5.4
const MAX_BLOBS = 8;
const BLOB_COUNT = 6;
const OFFSET_Y = 0.25;

// ─── Blob Type ────────────────────────────────────────────────────────────────
interface Blob {
    radius: number;
    homeX: number;
    homeZ: number;
    baseX: number;
    baseZ: number;
    ampX: number;
    ampY: number;
    ampZ: number;
    freqX: number;
    freqY: number;
    freqZ: number;
    phaseX: number;
    phaseY: number;
    phaseZ: number;
}

// ─── Blob Initialisation ──────────────────────────────────────────────────────
function initBlobs(count: number): Blob[] {
    return Array.from({ length: count }, (_, i) => {
        // Distribute blobs evenly around the lamp
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const spread = 0.4 + Math.random() * 0.6; // 0–1 of max radius
        const hx = Math.cos(angle) * spread;
        const hz = Math.sin(angle) * spread;

        return {
            radius: 0.5 + Math.random() * 0.38,
            homeX: hx,
            homeZ: hz,
            baseX: hx,
            baseZ: hz,
            // XZ orbit — kept modest so blobs stay inside the cone
            ampX: 0.15 + Math.random() * 0.25,
            ampZ: 0.15 + Math.random() * 0.25,
            // Y convection — full vertical travel, slow so motion feels lava-like
            ampY: 2.2 + Math.random() * 1,
            freqX: 0.04 + Math.random() * 0.06,
            freqY: 0.05 + Math.random() * 0.07,
            freqZ: 0.04 + Math.random() * 0.06,
            phaseX: (i / count) * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            phaseZ: Math.random() * Math.PI * 2,
        };
    });
}

// ─── Cone boundary helper ─────────────────────────────────────────────────────
function glassRadiusAt(y: number): number {
    return (
        GLASS_RADIUS_BOTTOM +
        ((y - GLASS_BOTTOM) * (GLASS_RADIUS_TOP - GLASS_RADIUS_BOTTOM)) /
            (GLASS_TOP - GLASS_BOTTOM)
    );
}

function confine(x: number, y: number, z: number, blobR: number) {
    // Allow blobs to sink to the floor (small bottom pad so flattening is visible)
    // but keep them from clipping above the top
    y = Math.max(GLASS_BOTTOM + blobR * 0.15, Math.min(GLASS_TOP - blobR, y));
    const maxR = Math.max(glassRadiusAt(y) - blobR * 0.75, 0);
    const r2d = Math.sqrt(x * x + z * z);
    if (r2d > maxR) {
        const s = maxR / Math.max(r2d, 0.0001);
        x *= s;
        z *= s;
    }
    return { x, y, z };
}

// ─── Vertex Shader ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform int   uBlobCount;
  uniform vec4  uBlobs[8];
  uniform float uOffsetY;
  uniform float uGlassTop;
  uniform float uGlassBottom;
  uniform float uGlassRadiusTop;
  uniform float uGlassRadiusBottom;

  varying vec3 vWorldPos;

  // Colour palette
  const vec3 colBase = vec3(0.10, 0.10, 1.00); // #1a1aff
  const vec3 colHot  = vec3(0.38, 0.94, 1.00); // #13138a

  // ── Cone SDF helpers ────────────────────────────────────────────────────────
  float coneRadiusAt(float y) {
    float t = clamp((y - uGlassBottom) / (uGlassTop - uGlassBottom), 0.0, 1.0);
    return mix(uGlassRadiusBottom, uGlassRadiusTop, t);
  }

  // Returns positive outside the cone, negative inside
  float coneSDF(vec3 p) {
    float rAtY = coneRadiusAt(p.y);
    float dXZ  = length(p.xz) - rAtY;
    float dY   = max(uGlassBottom - p.y, p.y - uGlassTop);
    return max(dXZ, dY);
  }

  // ── Smooth-minimum (from LavaLampBackground) ────────────────────────────────
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // ── Sphere SDF ──────────────────────────────────────────────────────────────
  float sdSphere(vec3 p, vec3 c, float r) { return length(p - c) - r; }

  // ── Organic wobble (from LavaLampBackground) ────────────────────────────────
  // Lightweight hash-based noise — no heavy Perlin table needed
  float hash(vec3 p) {
    p  = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i),              hash(i+vec3(1,0,0)), u.x),
                   mix(hash(i+vec3(0,1,0)),  hash(i+vec3(1,1,0)), u.x), u.y),
               mix(mix(hash(i+vec3(0,0,1)),  hash(i+vec3(1,0,1)), u.x),
                   mix(hash(i+vec3(0,1,1)),  hash(i+vec3(1,1,1)), u.x), u.y), u.z) * 2.0 - 1.0;
  }

  float wobble(vec3 p) {
    float t = uTime * 0.4;
    return noise3(p * 3.5 + vec3(t, -t * 1.1, t * 0.7)) * 0.022;
  }

  // ── Squashed sphere SDF — flattens blob vertically near the floor ───────────
  float sdBlobSphere(vec3 p, vec3 c, float r) {
    // How close is the blob centre to the bottom cap? 0 = at floor, 1 = far away
    float floorProx = clamp((c.y - uGlassBottom) / (r * 2.5), 0.0, 1.0);
    // scaleY: 1.0 when mid-air, shrinks to 0.55 when sitting on the floor
    float scaleY = mix(0.55, 1.0, floorProx);
    // Stretch XZ slightly to conserve "volume" feel
    float scaleXZ = mix(1.28, 1.0, floorProx);
    vec3 q = (p - c) * vec3(scaleXZ, 1.0 / scaleY, scaleXZ);
    return length(q) - r;
  }

  // ── Metaball SDF (smooth-union of all blobs, clamped to cone) ───────────────
  float sdMetaballs(vec3 p) {
    float d = 1e6;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      // Wider smin kernel = blobs start merging from further away
      d = smin(d, sdBlobSphere(p, uBlobs[i].xyz, uBlobs[i].w), 0.55);
    }
    // Clip to the inside of the cone by taking the max with the cone SDF
    d = max(d, coneSDF(p));
    return d + wobble(p);
  }

  // ── Internal glow field (from LavaLampBackground) ───────────────────────────
  float internalGlow(vec3 p) {
    float g = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      float dist = length(p - uBlobs[i].xyz);
      g += (uBlobs[i].w * uBlobs[i].w) / (dist * dist + 0.02);
    }
    return g;
  }

  // ── Metaball potential (for volumetric glow in miss path) ───────────────────
  float mbPotential(vec3 p) {
    float f = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      float dist = max(length(p - uBlobs[i].xyz), 0.0005);
      f += (uBlobs[i].w * uBlobs[i].w) / (dist * dist);
    }
    return f;
  }

  // ── Central-difference normal ────────────────────────────────────────────────
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.004, 0.0);
    return normalize(vec3(
      sdMetaballs(p + e.xyy) - sdMetaballs(p - e.xyy),
      sdMetaballs(p + e.yxy) - sdMetaballs(p - e.yxy),
      sdMetaballs(p + e.yyx) - sdMetaballs(p - e.yyx)
    ));
  }

  // ── Cone intersection for ray clipping ─────────────────────────────────────
  vec2 cylinderIntersect(vec3 ro, vec3 rd, float radius) {
    float a    = rd.x*rd.x + rd.z*rd.z;
    float b    = 2.0*(ro.x*rd.x + ro.z*rd.z);
    float c    = ro.x*ro.x + ro.z*ro.z - radius*radius;
    float disc = b*b - 4.0*a*c;
    if (disc < 0.0) return vec2(-1.0);
    float sq = sqrt(disc);
    return vec2((-b - sq)/(2.0*a), (-b + sq)/(2.0*a));
  }

  // ── Raymarcher ──────────────────────────────────────────────────────────────
  const int   MAX_STEPS = 72;
  const float SURF_DIST = 0.003;
  const float MAX_DIST  = 12.0;

  float raymarch(vec3 ro, vec3 rd, out vec3 hitPos) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      vec3  p = ro + rd * t;
      float d = sdMetaballs(p);
      if (d < SURF_DIST) { hitPos = p; return t; }
      t += max(abs(d) * 0.85, 0.008);
      if (t > MAX_DIST) break;
    }
    return -1.0;
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  void main() {
    // Ray origin and direction from camera through this fragment.
    // Subtract mesh offset so the ray lives in the same space as the SDF.
    vec3 ro = cameraPosition - vec3(0.0, uOffsetY, 0.0);
    vec3 rd = normalize(vWorldPos - cameraPosition);

    // ── Clip ray to bounding cylinder (conservative, uses bottom radius) ──────
    vec2 ci = cylinderIntersect(ro, rd, uGlassRadiusBottom + 0.05);
    if (ci.y < 0.0 || ci.x > ci.y) { discard; return; }

    float tMin = max(ci.x, 0.0); // never start behind camera
    float tMax = ci.y;

    // ── Clip to vertical caps ──────────────────────────────────────────────────
    // Guard against horizontal rays (rd.y≈0) to avoid divide-by-zero.
    if (abs(rd.y) > 0.0001) {
      float tTop    = (uGlassTop    - ro.y) / rd.y;
      float tBottom = (uGlassBottom - ro.y) / rd.y;
      // entry cap = closer of the two; exit cap = farther of the two
      float tCapEntry = min(tTop, tBottom);
      float tCapExit  = max(tTop, tBottom);
      tMin = max(tMin, tCapEntry); // push start forward past near cap
      tMax = min(tMax, tCapExit);  // pull end back before far cap
    } else if (ro.y < uGlassBottom || ro.y > uGlassTop) {
      // Horizontal ray that starts outside the vertical range — nothing to draw.
      discard; return;
    }

    // Ensure tMin is never behind the camera
    tMin = max(tMin, 0.0);
    if (tMin >= tMax) { discard; return; }

    // ── March from tMin — do NOT advance by vWorldPos (that's the cone wall,
    //    not the interior entry point, and causes blobs near the axis to be skipped)
    vec3 ro2 = ro + rd * tMin;

    vec3  hitPos = vec3(0.0);
    float t = raymarch(ro2, rd, hitPos);

    if (t < 0.0) {
      // ── Miss path: render the liquid medium (volumetric glow) ─────────────
      // Sample glow along a shortened march to estimate scattered light
      float accGlow = 0.0;
      const int GLOW_STEPS = 24;
      float step = (tMax - tMin) / float(GLOW_STEPS);
      for (int i = 0; i < GLOW_STEPS; i++) {
        vec3 p = ro2 + rd * (float(i) * step);
        if (coneSDF(p) > 0.0) continue;
        accGlow += mbPotential(p);
      }
      float avgGlow     = accGlow / float(GLOW_STEPS);
      float glowIntensity = smoothstep(0.08, 0.55, avgGlow);

      float heatMid = clamp((vWorldPos.y - uGlassBottom) /
                            (uGlassTop   - uGlassBottom), 0.0, 1.0);
      vec3  liquidBase  = colBase * 0.2;
      vec3  bloomColor  = mix(colBase, colHot, heatMid) * 0.65;
      vec3  finalColor  = liquidBase + bloomColor * glowIntensity;
      float alpha       = max(0.15, glowIntensity * 0.55) * uOpacity;

      gl_FragColor = vec4(finalColor, alpha);
      return;
    }

    // ── Hit path: shade the blob surface ─────────────────────────────────────
    // heat is computed here — hitPos is guaranteed valid after the miss-path return above.
    float heat = clamp((hitPos.y - uGlassBottom) / (uGlassTop - uGlassBottom), 0.0, 1.0);
    vec3 n       = getNormal(hitPos);
    vec3 viewDir = -rd;
    vec3 lava    = mix(colBase, colHot, heat * heat);

    // Two-light wrap diffuse (from LavaLampBackground)
    vec3  lightA = normalize(vec3( 0.5,  0.9,  0.6));
    vec3  lightB = normalize(vec3(-0.6,  0.3,  0.8));
    float wrap   = 0.4;
    float diffA  = max((dot(n, lightA) + wrap) / (1.0 + wrap), 0.0);
    float diffB  = max((dot(n, lightB) + wrap) / (1.0 + wrap), 0.0);

    // Dual specular
    float specA  = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 72.0);
    float specB  = pow(max(dot(reflect(-lightB, n), viewDir), 0.0), 28.0);

    // Fresnel rim
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    // Internal glow layers (from LavaLampBackground)
    float ig        = internalGlow(hitPos);
    float fieldPot  = mbPotential(hitPos);
    float fieldGlow = smoothstep(0.6, 1.8, fieldPot);
    float inner     = clamp(mbPotential(hitPos - n * 0.07) * 0.18, 0.0, 1.0);

    vec3 diffuse  = lava * (0.12 + 0.88 * (diffA * 0.85 + diffB * 0.35));
    vec3 spec     = vec3(0.9) * (specA + 0.35 * specB);
    vec3 emission = lava * (0.2 + 0.8 * fresnel);
    emission     += lava * inner     * 0.8;
    emission     += lava * fieldGlow * 0.35;
    emission     += lava * ig        * 0.06;

    vec3 color = diffuse + spec * 0.75 + emission;
    // Contrast crush (from LavaLampBackground)
    color = mix(color, color * color * 1.3, 0.3);

    // Full opacity on blob surface — cone SDF already clips geometry cleanly,
    // so no edge fade needed (it caused grey fringing against the glass wall)
    gl_FragColor = vec4(color, uOpacity);
  }
`;

// ─── MetaBalls Component ──────────────────────────────────────────────────────
function MetaBalls({ blobCount = BLOB_COUNT }: { blobCount?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const count = Math.max(1, Math.min(blobCount, MAX_BLOBS));
    const blobs = useRef<Blob[]>(initBlobs(count));

    // Spring simulation state
    const simState = useRef(
        blobs.current.map((b) => ({ baseX: b.homeX, baseZ: b.homeZ })),
    );

    const blobUniforms = useRef(
        Array.from(
            { length: MAX_BLOBS },
            () => new THREE.Vector4(0, -99, 0, 0.001),
        ),
    );

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 0.97 },
            uBlobCount: { value: count },
            uBlobs: { value: blobUniforms.current },
            uOffsetY: { value: OFFSET_Y },
            uGlassTop: { value: GLASS_TOP },
            uGlassBottom: { value: GLASS_BOTTOM },
            uGlassRadiusTop: { value: GLASS_RADIUS_TOP },
            uGlassRadiusBottom: { value: GLASS_RADIUS_BOTTOM },
        }),
        [count],
    );

    useFrame(({ clock }) => {
        const mat = meshRef.current?.material as
            | THREE.ShaderMaterial
            | undefined;
        if (!mat) return;

        const t = clock.getElapsedTime();

        for (let i = 0; i < MAX_BLOBS; i++) {
            if (i >= count) {
                blobUniforms.current[i].set(0, -99, 0, 0.001);
                continue;
            }

            const b = blobs.current[i];
            const sim = simState.current[i];

            // Spring-return toward home position (prevents drift accumulation)
            const RETURN = 0.018;
            sim.baseX += (b.homeX - sim.baseX) * RETURN;
            sim.baseZ += (b.homeZ - sim.baseZ) * RETURN;

            // Sine-wave orbit around the drifting base
            const rx = sim.baseX + Math.sin(t * b.freqX + b.phaseX) * b.ampX;
            const rz = sim.baseZ + Math.cos(t * b.freqZ + b.phaseZ) * b.ampZ;
            // Full vertical travel for proper lava convection
            const ry = Math.sin(t * b.freqY + b.phaseY) * b.ampY;

            const { x, y, z } = confine(rx, ry, rz, b.radius);
            blobUniforms.current[i].set(x, y, z, b.radius);
        }

        mat.uniforms.uTime.value = t;
        mat.uniforms.uBlobs.value = blobUniforms.current;
        mat.uniformsNeedUpdate = true;
    });

    return (
        <mesh ref={meshRef} renderOrder={1} position={[0, OFFSET_Y, 0]}>
            {/* Frustum volume that the raymarcher samples inside */}
            <cylinderGeometry
                args={[
                    GLASS_RADIUS_TOP,
                    GLASS_RADIUS_BOTTOM,
                    GLASS_HEIGHT,
                    64,
                    1,
                    true,
                ]}
            />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                depthTest={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// ─── Glass Model ──────────────────────────────────────────────────────────────
function Model() {
    const { scene } = useGLTF("/glass.glb");

    useMemo(() => {
        scene.traverse((child) => {
            if (!(child as THREE.Mesh).isMesh) return;
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;

            if (mat?.name === "Glass_Material") {
                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0.85, 0.92, 1.0),
                    transmission: 0.98,
                    roughness: 0.02,
                    metalness: 0.0,
                    ior: 1.52,
                    thickness: 0.4,
                    transparent: true,
                    opacity: 0.12,
                    envMapIntensity: 1.5,
                    reflectivity: 0.8,
                    depthWrite: false,
                });
                mesh.renderOrder = 2;
            }

            if (mat?.name === "Base_Material" || mat?.name === "Cap_Material") {
                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0.65, 0.7, 0.75),
                    metalness: 1.0,
                    roughness: 0.12,
                    envMapIntensity: 2.0,
                });
                mesh.renderOrder = 3;
            }
        });
    }, [scene]);

    return <primitive object={scene} />;
}

// ─── Scene Animation & Rigging ────────────────────────────────────────────────
function LampScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        // Very slow rotation (approx 6 degrees per second)
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
        // Maintain the camera focus previously handled by OrbitControls
        state.camera.lookAt(0, -1.5, 0);
    });

    return (
        <group ref={groupRef}>
            <MetaBalls blobCount={BLOB_COUNT} />
            <Model />
        </group>
    );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
export default function LavaLamp() {
    return (
        <Canvas
            className="transition-all"
            style={{ pointerEvents: "none" }}
            camera={{ position: [25, 2, 5], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[2, 4, 2]} intensity={1.5} />

            <pointLight
                position={[0, -3, 0]}
                color="#656565"
                intensity={10}
                distance={10}
            />
            <pointLight
                position={[0, 3, 0]}
                color="#686868"
                intensity={4}
                distance={8}
            />

            <Environment preset="studio" />

            <ContactShadows
                position={[0, -9, 0]}
                opacity={0.5}
                scale={20}
                blur={3}
                far={15}
                color="#000000"
            />
            <LampScene />
        </Canvas>
    );
}
