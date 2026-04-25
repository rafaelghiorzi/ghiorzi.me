"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
    EffectComposer,
    RenderPass,
    UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

// ─── SHADERS (unchanged from your original) ───────────────────────────────────

const vertexShader = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform int uBlobCount;
uniform vec4 uBlobs[8];
uniform vec3 uBaseColor;
uniform vec3 uHotColor;

float smin(float a, float b, float k) {
float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
return mix(b, a, h) - k * h * (1.0 - h);
}

float sdSphere(vec3 p, vec3 c, float r) {
return length(p - c) - r;
}

float sdMetaballs(vec3 p) {
float d = 10.0;
for (int i = 0; i < 8; i++) {
if (i >= uBlobCount) break;
d = smin(d, sdSphere(p, uBlobs[i].xyz, uBlobs[i].w), 0.25);
}
return d;
}

vec3 getNormal(vec3 p) {
float e = 0.001;
return normalize(vec3(
sdMetaballs(p + vec3(e,0,0)) - sdMetaballs(p - vec3(e,0,0)),
sdMetaballs(p + vec3(0,e,0)) - sdMetaballs(p - vec3(0,e,0)),
sdMetaballs(p + vec3(0,0,e)) - sdMetaballs(p - vec3(0,0,e))
));
}

void main() {
vec3 ro = vec3(0.0,0.0,3.0);
vec3 rd = normalize(vec3(vUv - 0.5, -1.0));

float t = 0.0;
vec3 p;

for(int i=0;i<60;i++){
p = ro + rd * t;
float d = sdMetaballs(p);
if(d < 0.002) break;
t += d;
}

vec3 n = getNormal(p);
float heat = clamp(p.y * 0.5 + 0.5, 0.0, 1.0);
vec3 col = mix(uBaseColor, uHotColor, heat);

float light = dot(n, normalize(vec3(0.3,0.8,0.5)));
col *= light * 0.8 + 0.2;

gl_FragColor = vec4(col, 1.0);
}
`;

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Blob {
    pos: THREE.Vector3;
    radius: number;
    phase: number;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function LavaLamp({ className = "" }: { className?: string }) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = mountRef.current!;
        if (!container) return;

        // ─── Renderer ────────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // ─── Scene ───────────────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#1a0022");

        // ─── Camera (slightly top-down) ──────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(
            35,
            container.clientWidth / container.clientHeight,
            0.1,
            100,
        );
        camera.position.set(0, 2.2, 4);
        camera.lookAt(0, 1, 0);

        // ─── LIGHTING ────────────────────────────────────────────────────────────
        const ambient = new THREE.AmbientLight("#ffffff", 0.2);
        scene.add(ambient);

        const dir = new THREE.DirectionalLight("#ffffff", 0.6);
        dir.position.set(3, 5, 2);
        scene.add(dir);

        const point = new THREE.PointLight("#fff5cc", 3, 10);
        point.position.set(0, 0.6, 0);
        scene.add(point);

        // ─── BASE ────────────────────────────────────────────────────────────────
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.3, 0.6, 64),
            new THREE.MeshStandardMaterial({
                color: "#111",
                metalness: 0.9,
                roughness: 0.2,
            }),
        );
        base.position.y = 0;
        scene.add(base);

        // ─── LIGHT DISK ──────────────────────────────────────────────────────────
        const lightDisk = new THREE.Mesh(
            new THREE.CylinderGeometry(1.0, 1.0, 0.15, 64),
            new THREE.MeshStandardMaterial({
                color: "#ffffff",
                emissive: "#fff5cc",
                emissiveIntensity: 3,
            }),
        );
        lightDisk.position.y = 0.35;
        scene.add(lightDisk);

        // ─── GLASS ───────────────────────────────────────────────────────────────
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            roughness: 0,
            metalness: 0,
            thickness: 0.5,
            ior: 1.5,
            transparent: true,
        });

        const glassBody = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 3, 64, 1, true),
            glassMaterial,
        );
        glassBody.position.y = 1.8;
        scene.add(glassBody);

        const glassTop = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            glassMaterial,
        );
        glassTop.position.y = 3.3;
        scene.add(glassTop);

        // ─── LAVA (shader inside) ────────────────────────────────────────────────
        const MAX_BLOBS = 6;

        const blobs: Blob[] = Array.from({ length: MAX_BLOBS }, (_, i) => ({
            pos: new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                Math.random() * 1.5,
                (Math.random() - 0.5) * 0.5,
            ),
            radius: 0.25 + Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2,
        }));

        const blobUniforms = Array.from(
            { length: 8 },
            () => new THREE.Vector4(),
        );

        const shaderMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uBlobCount: { value: MAX_BLOBS },
                uBlobs: { value: blobUniforms },
                uBaseColor: { value: new THREE.Color("#ff2d00") },
                uHotColor: { value: new THREE.Color("#ffff66") },
            },
            vertexShader,
            fragmentShader,
        });

        const lava = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 64, 64),
            shaderMat,
        );
        lava.position.y = 1.2;
        scene.add(lava);

        // ─── POST FX ─────────────────────────────────────────────────────────────
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const bloom = new UnrealBloomPass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            0.35,
            0.5,
            0.2,
        );
        composer.addPass(bloom);

        // ─── ANIMATION ───────────────────────────────────────────────────────────
        let frameId: number;
        let time = 0;

        function animate() {
            time += 0.016;

            blobs.forEach((b, i) => {
                b.pos.y += Math.sin(time + b.phase) * 0.002;
                blobUniforms[i].set(b.pos.x, b.pos.y, b.pos.z, b.radius);
            });

            shaderMat.uniforms.uTime.value = time;

            composer.render();
            frameId = requestAnimationFrame(animate);
        }

        animate();

        // ─── RESIZE ──────────────────────────────────────────────────────────────
        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            composer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", resize);

        // ─── CLEANUP ─────────────────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resize);
            renderer.dispose();
            composer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className={className} />;
}
