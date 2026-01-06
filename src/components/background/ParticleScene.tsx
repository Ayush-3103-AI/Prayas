import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ParticleScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Fog
    const fog = new THREE.FogExp2(0x020604, 0.0015);
    scene.fog = fog;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(20, 20, 20);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x10b981, 1, 100);
    pointLight.position.set(-20, -10, 10);
    scene.add(pointLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle system
    const particles = new THREE.Group();
    particlesRef.current = particles;

    const geometry = new THREE.TetrahedronGeometry(1.2);
    
    // Create 120 particles
    for (let i = 0; i < 120; i++) {
      const isRare = Math.random() < 0.1; // 10% chance for gold
      
      const material = new THREE.MeshPhongMaterial({
        color: isRare ? 0xfbbf24 : 0x10b981,
        transparent: true,
        opacity: isRare ? 0.7 : 0.5,
        shininess: isRare ? 90 : 60,
      });

      const particle = new THREE.Mesh(geometry, material);
      
      // Random position in volume
      particle.position.x = (Math.random() - 0.5) * 120;
      particle.position.y = (Math.random() - 0.5) * 60;
      particle.position.z = (Math.random() - 0.5) * 40;
      
      // Store rotation speeds
      (particle as any).rotationSpeedX = (Math.random() - 0.5) * 0.02;
      (particle as any).rotationSpeedZ = (Math.random() - 0.5) * 0.02;
      (particle as any).driftSpeed = (Math.random() - 0.5) * 0.01;
      (particle as any).initialY = particle.position.y;

      particles.add(particle);
    }

    scene.add(particles);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = mouseX * 5;
      targetY = mouseY * 5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Global rotation
      particles.rotation.y += 0.002;

      // Individual particle animations
      particles.children.forEach((particle) => {
        const mesh = particle as THREE.Mesh & {
          rotationSpeedX: number;
          rotationSpeedZ: number;
          driftSpeed: number;
          initialY: number;
        };

        // Individual rotation
        mesh.rotation.x += mesh.rotationSpeedX;
        mesh.rotation.z += mesh.rotationSpeedZ;

        // Vertical drift
        mesh.position.y += mesh.driftSpeed;

        // Wrap around Y bounds
        if (mesh.position.y > 40) {
          mesh.position.y = -40;
        } else if (mesh.position.y < -40) {
          mesh.position.y = 40;
        }
      });

      // Parallax camera movement
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of Three.js resources
      geometry.dispose();
      particles.children.forEach((particle) => {
        const mesh = particle as THREE.Mesh;
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
        mesh.geometry.dispose();
      });

      renderer.dispose();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#020604' }}
    />
  );
}

