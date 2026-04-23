"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BlobScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- SCENE ---
    const scene = new THREE.Scene();

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // --- LIGHTING (mais realista) ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffe0c0, 0.6);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    // --- GEOMETRY ---
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const basePositions = geometry.attributes.position.array.slice();

    // --- MATERIAL (cera) ---
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffd7a1,
      roughness: 0.7,
      metalness: 0.0,
      transmission: 0.0,
      thickness: 0.5,
      clearcoat: 0.0,
      sheen: 0.3,
      sheenColor: new THREE.Color(0xffc58a),
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- MOUSE ---
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener("mousemove", onMouseMove);

    // --- RAYCAST ---
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();

    // --- MOTION ---
    const velocity = new THREE.Vector3();
    const temp = new THREE.Vector3();

    // --- TIMER ---
    const timer = new THREE.Timer();
    const vertex = new THREE.Vector3();

    // --- VIEW BOUNDS ---
    const getViewBounds = () => {
      const distance = camera.position.z;
      const vFOV = (camera.fov * Math.PI) / 180;

      const viewHeight = 2 * Math.tan(vFOV / 2) * distance;
      const viewWidth = viewHeight * camera.aspect;

      return { width: viewWidth, height: viewHeight };
    };

    // --- CONFIG ---
    const margin = 0.4;
    const containStrength = 0.04;
    const bounce = 0.4;

    const animate = () => {
      requestAnimationFrame(animate);

      timer.update();
      const time = timer.getElapsed();

      const { width, height } = getViewBounds();

      const bounds = {
        x: width / 2,
        y: height / 2,
      };

      // --- Mouse → world ---
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, target);

      // --- MOTION ---
      temp.copy(target).sub(mesh.position);

      const distance = temp.length();
      const force = Math.min(distance * 0.01, 0.03);

      velocity.add(temp.normalize().multiplyScalar(force));
      velocity.multiplyScalar(0.85);
      mesh.position.add(velocity);

      // --- SOFT CONTAINMENT ---
      if (mesh.position.x > bounds.x - margin) {
        velocity.x -= (mesh.position.x - (bounds.x - margin)) * containStrength;
      }
      if (mesh.position.x < -bounds.x + margin) {
        velocity.x += ((-bounds.x + margin) - mesh.position.x) * containStrength;
      }

      if (mesh.position.y > bounds.y - margin) {
        velocity.y -= (mesh.position.y - (bounds.y - margin)) * containStrength;
      }
      if (mesh.position.y < -bounds.y + margin) {
        velocity.y += ((-bounds.y + margin) - mesh.position.y) * containStrength;
      }

      // --- HARD COLLISION ---
      if (mesh.position.x > bounds.x) {
        mesh.position.x = bounds.x;
        velocity.x *= -bounce;
      }
      if (mesh.position.x < -bounds.x) {
        mesh.position.x = -bounds.x;
        velocity.x *= -bounce;
      }

      if (mesh.position.y > bounds.y) {
        mesh.position.y = bounds.y;
        velocity.y *= -bounce;
      }
      if (mesh.position.y < -bounds.y) {
        mesh.position.y = -bounds.y;
        velocity.y *= -bounce;
      }

      // --- DEFORMATION + ACHATAMENTO ---
      const position = geometry.attributes.position;

      const dir = velocity.clone().normalize();
      const speed_deform = Math.min(velocity.length() * 2.0, 1);

      for (let i = 0; i < position.count; i++) {
        vertex.fromArray(basePositions, i * 3);

        // noise base
        const noise =
          Math.sin(vertex.x * 3 + time * 1.1) +
          Math.sin(vertex.y * 2 + time * 0.7 + 10) +
          Math.sin(vertex.z * 4 + time * 1.3 + 20);

        let scale = 1 + noise * 0.1;

        // movimento direcional
        if (speed_deform > 0.0001) {
          const normal = vertex.clone().normalize();
          const influence = normal.dot(dir);

          if (influence > 0) {
            scale += influence * speed_deform * 0.8;
          }
        }

        const tension = 0.5;
        const finalRadius = 1 + (scale - 1) * (1 - tension);

        vertex.normalize().multiplyScalar(finalRadius);

        // --- WORLD POSITION ---
        const worldVertex = vertex.clone().add(mesh.position);

        const softness = 0.25;

        // colisões por vértice (ACHATA)
        if (worldVertex.x > bounds.x) {
          const penetration = worldVertex.x - bounds.x;
          vertex.x -= penetration * (1 + softness);
        }

        if (worldVertex.x < -bounds.x) {
          const penetration = -bounds.x - worldVertex.x;
          vertex.x += penetration * (1 + softness);
        }

        if (worldVertex.y > bounds.y) {
          const penetration = worldVertex.y - bounds.y;
          vertex.y -= penetration * (1 + softness);
        }

        if (worldVertex.y < -bounds.y) {
          const penetration = -bounds.y - worldVertex.y;
          vertex.y += penetration * (1 + softness);
        }

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      position.needsUpdate = true;
      geometry.computeVertexNormals();

      // --- STRETCH ---
      if (speed_deform > 0.0001) {
        const dir = velocity.clone().normalize();

        const base = 0.3 * (1 + Math.sin(time * 0.5) * 0.05);
        const stretch = speed_deform * 1.5;

        mesh.scale.set(
          base + Math.abs(dir.x) * stretch,
          base + Math.abs(dir.y) * stretch,
          base + Math.abs(dir.z) * stretch
        );
      } else {
        const base = 0.3 * (1 + Math.sin(time * 0.5) * 0.05);
        mesh.scale.set(base, base, base);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "500px",
        height: "500px",
        background: "#f5f5f5",
      }}
    />
  );
}