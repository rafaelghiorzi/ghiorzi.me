"use client";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ─── Dimensões Reais do Modelo Refinadas ─────────────────────────────────────
// Mantemos as constantes matemáticas de limite, mas ajustamos a geometria física
const GLASS_RADIUS_TOP = 1; // Tronco de cone: menor em cima
const GLASS_RADIUS_BOTTOM = 1.87; // Maior embaixo
const GLASS_TOP = 2.7;
const GLASS_BOTTOM = -2.7;
const MAX_BLOBS = 8;
const BLOB_COUNT = 6;
const OFFSET_Y = 0.25;

interface Blob {
    radius: number;
    ampX: number;
    ampY: number;
    freqX: number;
    freqY: number;
    phaseX: number;
    phaseY: number;
    offsetX: number;
    offsetZ: number;
}

function initBlobs(count: number): Blob[] {
    return Array.from({ length: count }, (_, i) => ({
        // Raio e Dispersão Horizontal (Ajustados para o formato cônico)
        radius: 0.4 + Math.random() * 0.45,
        ampX: 1.0 + Math.random() * 1.8,

        // TRUQUE DA CONVECÇÃO: Amplitude maior que os limites para criar "pausas"
        ampY: 3.5 + Math.random() * 2.0,

        // VELOCIDADE REDUZIDA: Frequências muito baixas para o movimento lânguido
        freqX: 0.015 + Math.random() * 0.3,
        freqY: 0.02 + Math.random() * 0.1,

        phaseX: (i / count) * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,

        // Posições iniciais espalhadas para evitar concentração no centro
        offsetX: (Math.random() - 0.5) * 3.5,
        offsetZ: (Math.random() - 0.5) * 3.5,
    }));
}

function glassRadiusAt(y: number): number {
    // Matemática simples de tronco de cone
    // r_at_y = r_base + (y - y_base) * (r_topo - r_base) / (y_topo - y_base)
    return (
        GLASS_RADIUS_BOTTOM +
        ((y - GLASS_BOTTOM) * (GLASS_RADIUS_TOP - GLASS_RADIUS_BOTTOM)) /
            (GLASS_TOP - GLASS_BOTTOM)
    );
}

function confine(x: number, y: number, z: number, blobR: number) {
    y = Math.max(GLASS_BOTTOM + blobR, Math.min(GLASS_TOP - blobR, y));
    const maxR = Math.max(glassRadiusAt(y) - blobR, 0);
    const r2d = Math.sqrt(x * x + z * z);
    if (r2d > maxR) {
        const s = maxR / Math.max(r2d, 0.0001);
        x *= s;
        z *= s;
    }
    return { x, y, z };
}

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  
  void main() {
    // Calcula a posição real da geometria no mundo 3D
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    
    // Projeta corretamente com a câmera do Three.js
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform int   uBlobCount;
  uniform vec4  uBlobs[8];
  uniform float uOffsetY;

  // Uniforms de limites adicionados
  uniform float uGlassTop;
  uniform float uGlassBottom;
  uniform float uGlassRadiusTop;
  uniform float uGlassRadiusBottom;

  varying vec3 vWorldPos;

  // Cores Azuis escolhidas
  const vec3 colBase = vec3(0.10, 0.10, 1.00); // baseColor = "#1a1aff"
  const vec3 colHot  = vec3(0.38, 0.94, 1.00); // hotColor  = "#60efff"

  // ── Perlin Noise 3D Implementation (Ligeira para Shader) ──────────────────
  // Baseado em GLSL Noise de Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float noise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  // ── Física de Limites (Cálculo do Vidro Cônico) ──────────────────────────
  float coneRadiusAtY(float y) {
    float yRange = uGlassTop - uGlassBottom;
    float yRatio = (y - uGlassBottom) / yRange;
    return mix(uGlassRadiusBottom, uGlassRadiusTop, yRatio);
  }

  // ── Metaball field ─────────────────────────────────────────────────────────
  float mbField(vec3 p) {
    float f = 0.0;
    float totalSize = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uBlobCount) break;
      vec3 blobCenter = uBlobs[i].xyz;
      float d = length(p - blobCenter);
      float r = uBlobs[i].w;
      
      // 4. ATUALIZADO: Introduzimos Noise para Geoide e movimento interno
      float geoideOffset = 0.03 * noise(p * 2.0 + blobCenter + uTime * 0.3);
      float effectiveR = r * (1.0 + geoideOffset);
      
      f += (effectiveR * effectiveR) / (d * d + 0.01);
    }

    // 5. ADICIONADO: Campo Negativo do Vidro (Phisical Wall Boundary)
    // Calcula a distância planar até a parede do vidro
    float dWallPlanar = length(p.xz) - coneRadiusAtY(p.y);
    
    // Campo negativo agressivo perto da parede para deformação
    if (dWallPlanar > -0.2) { // Zona de contato
      float wallFactor = 80.0; 
      f -= wallFactor / (abs(dWallPlanar) * 50.0 + 0.001);
    }

    return f;
  }

  vec3 mbNormal(vec3 p) {
    float e = 0.01;
    return normalize(vec3(
      mbField(p + vec3(e,0,0)) - mbField(p - vec3(e,0,0)),
      mbField(p + vec3(0,e,0)) - mbField(p - vec3(0,e,0)),
      mbField(p + vec3(0,0,e)) - mbField(p - vec3(0,0,e))
    ));
  }

  // ── Interseção raio-cilindro para clipping inicial ────────────────────
  vec2 cylinderIntersect(vec3 ro, vec3 rd, float radius) {
    float a = rd.x*rd.x + rd.z*rd.z;
    float b = 2.0*(ro.x*rd.x + ro.z*rd.z);
    float c = ro.x*ro.x + ro.z*ro.z - radius*radius;
    float disc = b*b - 4.0*a*c;
    if (disc < 0.0) return vec2(-1.0);
    float sq = sqrt(disc);
    return vec2((-b - sq)/(2.0*a), (-b + sq)/(2.0*a));
  }

  void main() {
    vec3 ro = cameraPosition - vec3(0.0, uOffsetY, 0.0);
    vec3 rd = normalize(vWorldPos - cameraPosition);

    vec2 ci = cylinderIntersect(ro, rd, 3.85); // Cliping do Ray Origin
    if (ci.y < 0.0 || ci.x > ci.y) { discard; return; }

    float tMin = max(ci.x, 0.0);
    float tMax = ci.y;

    if (rd.y != 0.0) {
      float tTop    = (uGlassTop  - ro.y) / rd.y;
      float tBottom = (uGlassBottom - ro.y) / rd.y;
      float tCapMin = min(tTop, tBottom);
      float tCapMax = max(tTop, tBottom);
      tMin = max(tMin, tCapMin);
      tMax = min(tMax, tCapMax);
    } else if (ro.y < uGlassBottom || ro.y > uGlassTop) {
      discard; return;
    }

    float tCurrent = length(vWorldPos - cameraPosition);
    tMin = max(tMin, tCurrent - 0.1); 

    if (tMin > tMax) { discard; return; }

    const int STEPS = 64;
    float stepSize  = (tMax - tMin) / float(STEPS);
    float t         = tMin;
    float hit       = -1.0;
    vec3  hitP;
    
    // 6. ATUALIZADO: Threshold menor para fusão rápida (blobs grudam mais)
    const float THRESHOLD = 1.05; 
    
    float accumulatedGlow = 0.0;

    for (int i = 0; i < STEPS; i++) {
      vec3  p = ro + rd * t;
      
      // 7. ATUALIZADO: Clipping súbito para garantir que nada apareça fora
      if (length(p.xz) > coneRadiusAtY(p.y) + 0.1) { t += stepSize; continue; }

      float f = mbField(p);
      accumulatedGlow += pow(f, 0.6); // Soma energia volumétrica suavizada
      
      if (f > THRESHOLD) { hit = t; hitP = p; break; }
      t += stepSize;
    }

    float heat = clamp(vWorldPos.y / 2.70 * 0.5 + 0.5, 0.0, 1.0);

    // ── Shading ────────────────────────────────────────────────────────────

    // SE NÃO BATEU NA CERA: Renderiza a água mais transparente (Bloom sutil)
    if (hit < 0.0) { 
      float avgGlow = accumulatedGlow / float(STEPS);
      
      // 8. ATUALIZADO: Bloom volumétrico muito mais contido e profundo
      float glowIntensity = smoothstep(0.1, 0.6, avgGlow); 
      
      // Água com tom azul extremamente sutil (base limpa)
      vec3 liquidBase = colBase * 0.25; 
      // Halo de luz mais orgânico
      vec3 bloomColor = mix(colBase, colHot, heat) * 0.6; 
      
      vec3 finalLiquidColor = liquidBase + (bloomColor * glowIntensity);
      
      // Alpha: Mínimo de 8% para a água, aumenta ligeiramente perto das bolhas
      float liquidAlpha = max(0.18, glowIntensity * 0.6) * uOpacity;
      
      gl_FragColor = vec4(finalLiquidColor, liquidAlpha);
      return; 
    }

    // SE BATEU NA CERA: Renderiza a bolha geóide sólida
    vec3  n       = mbNormal(hitP);
    vec3  viewDir = -rd;

    vec3  lava    = mix(colBase, colHot, heat); 

    vec3  lightA  = normalize(vec3( 0.4, 1.0, 0.6));
    vec3  lightB  = normalize(vec3(-0.5, 0.2, 0.8));
    float wrap    = 0.4;
    float diffA   = max((dot(n, lightA) + wrap) / (1.0 + wrap), 0.0);
    float diffB   = max((dot(n, lightB) + wrap) / (1.0 + wrap), 0.0) * 0.4;
    float specA   = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
    
    // O brilho interior da bolha
    float innerGlow = smoothstep(THRESHOLD, THRESHOLD * 2.0, mbField(hitP));

    vec3 color    = lava * (0.15 + 0.85 * (diffA + diffB));
    color        += vec3(0.95) * specA * 0.7; // Reflexo branco
    color        += lava * fresnel * 0.5;
    color        += lava * innerGlow * 0.8;
    color         = mix(color, color * color * 1.3, 0.25);

    gl_FragColor = vec4(color, uOpacity);
  }
`;

// ─── MetaBalls ────────────────────────────────────────────────────────────────

function MetaBalls({ blobCount = BLOB_COUNT }: { blobCount?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const count = Math.max(1, Math.min(blobCount, MAX_BLOBS));
    const blobsRef = useRef<Blob[]>(initBlobs(count));

    const blobUniforms = useRef(
        Array.from(
            { length: MAX_BLOBS },
            () => new THREE.Vector4(0, -99, 0, 0.001),
        ),
    );

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 0.95 },
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

        // Blobs
        for (let i = 0; i < MAX_BLOBS; i++) {
            if (i < count) {
                const b = blobsRef.current[i];

                // Movimento super lento e disperso
                const rx =
                    b.offsetX + Math.sin(t * b.freqX + b.phaseX) * b.ampX;
                const ry = Math.sin(t * b.freqY + b.phaseY) * b.ampY;
                const rz =
                    b.offsetZ +
                    Math.cos(t * b.freqX * 0.8 + b.phaseX) * (b.ampX * 0.6);

                const { x, y, z } = confine(rx, ry, rz, b.radius);
                blobUniforms.current[i].set(x, y, z, b.radius);
            } else {
                blobUniforms.current[i].set(0, -99, 0, 0.001);
            }
        }

        mat.uniforms.uTime.value = t;
        mat.uniforms.uBlobCount.value = count;
        mat.uniforms.uBlobs.value = blobUniforms.current;
        mat.uniformsNeedUpdate = true;
    });

    return (
        <mesh ref={meshRef} renderOrder={1} position={[0, OFFSET_Y, 0]}>
            {/* GEOMETRIA FÍSICA CORRIGIDA: Tronco de Cone [raioTopo, raioBase, altura, segmentos] */}
            <cylinderGeometry
                args={[GLASS_RADIUS_TOP, GLASS_RADIUS_BOTTOM, 5.4, 32, 1, true]}
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

// ─── Model ────────────────────────────────────────────────────────────────────
function Model() {
    const { scene } = useGLTF("/glass.glb");

    // Usamos useMemo para processar a cena apenas quando o modelo é carregado,
    // evitando processamento desnecessário e mutações durante o render puro.
    useMemo(() => {
        scene.traverse((child) => {
            if (!(child as THREE.Mesh).isMesh) return;
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;

            // Vidro mais cristalino e menos opaco para realçar o azul
            if (mat?.name === "Glass_Material") {
                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0.85, 0.92, 1.0),
                    transmission: 0.98,
                    roughness: 0.02,
                    metalness: 0.0,
                    ior: 1.52,
                    thickness: 0.4,
                    transparent: true,
                    opacity: 0.12, // Vidro muito claro
                    envMapIntensity: 1.5,
                    reflectivity: 0.8,
                    depthWrite: false,
                });
                mesh.renderOrder = 2;
            }

            if (mat?.name === "Base_Material" || mat?.name === "Cap_Material") {
                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0.65, 0.7, 0.75), // Metal mais frio
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

// ─── Canvas ───────────────────────────────────────────────────────────────────

export default function LavaLamp() {
    return (
        <Canvas
            className="bg-[radial-gradient(circle_at_50%_50%,#252e45_0%,#252526_55%)]"
            camera={{ position: [25, 2, 5], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
        >
                <ambientLight intensity={0.4} />
                <directionalLight position={[2, 4, 2]} intensity={1.5} />

                {/* LUZES DO AMBIENTE AJUSTADAS PARA AZUL */}
                <pointLight
                    position={[0, -3, 0]}
                    color="#60efff" // hotColor
                    intensity={10}
                    distance={10}
                />
                <pointLight
                    position={[0, 3, 0]}
                    color="#1a1aff" // baseColor
                    intensity={4}
                    distance={8}
                />

                <Environment preset="studio" />

                <MetaBalls blobCount={BLOB_COUNT} />
                <Model />
                <OrbitControls target={[0, -1.5, 0]} />
        </Canvas>
    );
}
