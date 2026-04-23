'use client';

import { MeshDistortMaterial } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Configurações de Física Gooey (ajuste aqui)
const GOO_SETTINGS = {
  viscosity: 4,           // O quão devagar ele segue o mouse (mais alto = mais pesado/viscoso)
  baseDistort: 0.4,       // Distorção quando parado (coeso)
  stretchDistort: 0.15,   // Distorção quando esticado (liso nas laterais)
  baseNoiseSpeed: 1.5,    // Velocidade do borbulhar parado
  stretchNoiseSpeed: 6,   // Velocidade do fluxo superficial correndo
  transmission: 0.6,     // Translucidez da gosma (0 a 1)
};

function GooeyBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // Variáveis matemáticas para a física
  const [targetPosition] = useState(() => new THREE.Vector3());
  const [currentVelocity] = useState(() => new THREE.Vector3());

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // 1. Captação do Mouse e Conversão para 3D
    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const mouseY = (state.pointer.y * state.viewport.height) / 2;
    targetPosition.set(mouseX, mouseY, 0);

    // 2. FÍSICA DE VISCOSIDADE (Inércia)
    // O Lerp cria o atraso pesado ("peso") necessário para a gosma.
    meshRef.current.position.lerp(targetPosition, delta * GOO_SETTINGS.viscosity);

    // 3. CÁLCULO DE VELOCIDADE
    const velocityX = targetPosition.x - meshRef.current.position.x;
    const velocityY = targetPosition.y - meshRef.current.position.y;
    currentVelocity.set(velocityX, velocityY, 0);
    const speed = currentVelocity.length(); // Velocidade atual escalar

    // 4. FÍSICA DE TENSÃO SUPERFICIAL E SQUASH & STRETCH (Estica e Esmaga)
    // Usamos a velocidade para calcular o fator de estiramento físico.
    const stretchFactor = 1 + speed * 0.15; 
    const squashFactor = 1 / Math.sqrt(stretchFactor); // Mantém o volume constante

    // Aplica a escala física no blob
    meshRef.current.scale.set(squashFactor, stretchFactor, squashFactor);

    // Rotaciona o blob para alinhar o estiramento com a direção do movimento
    if (speed > 0.05) {
      const angle = Math.atan2(currentVelocity.y, currentVelocity.x);
      meshRef.current.rotation.z = angle - Math.PI / 2; // Aponta na direção Z
    }

    // 5. MODULAÇÃO GOOEY DO SHADER (O segredo do realismo)
    // Nós mapeamos a velocidade para os parâmetros do Shader.
    
    // Quando CORRE: A distorção diminui (esticado e liso), mas a textura flui RÁPIDO.
    // Quando PÁRA: A distorção aumenta (massa coesa), mas a textura borbulha DEVAGAR.
    const currentDistort = THREE.MathUtils.mapLinear(
      speed, 
      0, 2, // Range de velocidade esperado
      GOO_SETTINGS.baseDistort, GOO_SETTINGS.stretchDistort // Mapeamento do Shader
    );

    const currentNoiseSpeed = THREE.MathUtils.mapLinear(
      speed,
      0, 2,
      GOO_SETTINGS.baseNoiseSpeed, GOO_SETTINGS.stretchNoiseSpeed
    );

    // Suaviza a aplicação dos parâmetros do Shader para não dar pulos
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, currentDistort, delta * 4);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, currentNoiseSpeed, delta * 4);
  });

  return (
    <mesh ref={meshRef} scale={1.5}>
      {/* Geometria de Icosaedro para distorção suave */}
      <icosahedronGeometry args={[2, 25]} />
      
      {/* Visual de Gosma pegajosa e translúcida */}
      <MeshDistortMaterial
        ref={materialRef}
        color="#ff3366" // Cor da gosma
        roughness={0.4} // Ligeiramente úmida, não totalmente fosca
        metalness={0}   // Nada metálico
        transmission={GOO_SETTINGS.transmission} // Semi-transparente
        thickness={1}   // Espessura da translucidez
        clearcoat={0.3} // Dá um brilho úmido superficial
        distort={GOO_SETTINGS.baseDistort} // Distorção inicial
        speed={GOO_SETTINGS.baseNoiseSpeed} // Velocidade inicial
      />
    </mesh>
  );
}

export default function InteractiveBlobContainer() {
  return (
    // Container escuro para destacar a translucidez da gosma
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', overflow: 'hidden' }}>
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }} gl={{ alpha: true }}>
        {/* Iluminação Quente de LavaLamp */}
        <ambientLight intensity={1.0} color="#ffddbb" />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1.5} color="#ffaa66" />
        
        <GooeyBlob />
      </Canvas>
    </div>
  );
}