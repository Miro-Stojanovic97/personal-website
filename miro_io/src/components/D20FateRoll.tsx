"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type FacePoint = {
  value: number;
  normal: THREE.Vector3;
  up: THREE.Vector3;
};

// Normalize each face definition once so runtime orientation math stays stable.
function makeFacePoint(value: number, normal: THREE.Vector3, up: THREE.Vector3) {
  const normalizedNormal = normal.clone().normalize();
  const normalizedUp = up.clone().projectOnPlane(normalizedNormal).normalize();

  return {
    value,
    normal: normalizedNormal,
    up: normalizedUp.lengthSq() === 0 ? new THREE.Vector3(0, 0, 1) : normalizedUp,
  };
}

// Local-space face map used to orient any selected number toward the camera.
const facePoints: FacePoint[] = [
  makeFacePoint(20, new THREE.Vector3(-0.025, 0.984, 0.176), new THREE.Vector3(-0.009, 0.176, -0.984)),
  makeFacePoint(1, new THREE.Vector3(0.014, -0.982, -0.190), new THREE.Vector3(0.020, -0.189, 0.982)),
  makeFacePoint(2, new THREE.Vector3(0.577, 0.790, -0.206), new THREE.Vector3(0.650, -0.597, -0.470)),
  makeFacePoint(3, new THREE.Vector3(-0.931, -0.312, -0.192), new THREE.Vector3(-0.187, 0.855, -0.483)),
  makeFacePoint(4, new THREE.Vector3(0.572, 0.180, 0.800), new THREE.Vector3(0.643, -0.703, -0.302)),
  makeFacePoint(5, new THREE.Vector3(0.929, -0.319, -0.189), new THREE.Vector3(0.188, 0.844, -0.501)),
  makeFacePoint(6, new THREE.Vector3(-0.568, 0.176, 0.804), new THREE.Vector3(-0.646, -0.700, -0.304)),
  makeFacePoint(7, new THREE.Vector3(0.030, -0.632, -0.774), new THREE.Vector3(0.002, 0.775, -0.632)),
  makeFacePoint(8, new THREE.Vector3(-0.572, 0.796, -0.201), new THREE.Vector3(-0.643, -0.586, -0.493)),
  makeFacePoint(9, new THREE.Vector3(-0.344, -0.492, 0.800), new THREE.Vector3(0.469, 0.648, 0.600)),
  makeFacePoint(10, new THREE.Vector3(-0.363, 0.502, -0.785), new THREE.Vector3(0.455, -0.639, -0.620)),
  makeFacePoint(11, new THREE.Vector3(0.368, -0.504, 0.781), new THREE.Vector3(-0.451, 0.638, 0.624)),
  makeFacePoint(12, new THREE.Vector3(0.340, 0.477, -0.810), new THREE.Vector3(-0.478, -0.654, -0.586)),
  makeFacePoint(13, new THREE.Vector3(0.588, -0.780, 0.214), new THREE.Vector3(0.630, 0.607, 0.485)),
  makeFacePoint(14, new THREE.Vector3(0.011, 0.606, 0.796), new THREE.Vector3(0.005, -0.796, 0.606)),
  makeFacePoint(15, new THREE.Vector3(0.585, -0.201, -0.786), new THREE.Vector3(0.642, 0.706, 0.297)),
  makeFacePoint(16, new THREE.Vector3(-0.928, 0.320, 0.193), new THREE.Vector3(-0.189, -0.848, 0.495)),
  makeFacePoint(17, new THREE.Vector3(-0.587, -0.174, -0.791), new THREE.Vector3(-0.634, 0.706, 0.316)),
  makeFacePoint(18, new THREE.Vector3(0.934, 0.291, 0.206), new THREE.Vector3(0.158, -0.855, 0.494)),
  makeFacePoint(19, new THREE.Vector3(-0.604, -0.775, 0.184), new THREE.Vector3(-0.638, 0.609, 0.471)),
];

// In this component the camera stays centered on +Z and the die stays at origin,
// so "toward camera" is a constant world direction.
const TOWARD_CAMERA = new THREE.Vector3(0, 0, 1);
const FACE_20 = facePoints.find((face) => face.value === 20) ?? facePoints[0];

// Build a quaternion that maps one face's local basis (right/up/normal)
// to a camera-facing world basis while keeping the face upright.
function getCameraFacingUprightQuaternion(face: FacePoint, towardCamera: THREE.Vector3) {
  // Face-local orthonormal basis: normal is "out of face", up is "text upright", right completes the frame.
  const normal = face.normal.clone().normalize();
  const localUp = face.up.clone().projectOnPlane(normal).normalize();
  const localRight = new THREE.Vector3().crossVectors(localUp, normal).normalize();

  // Desired world basis: point the face toward camera, then pick an upright direction on that view plane.
  const worldNormal = towardCamera.clone().normalize();
  const worldUp = new THREE.Vector3(0, 1, 0).projectOnPlane(worldNormal).normalize();
  const worldRight = new THREE.Vector3().crossVectors(worldUp, worldNormal).normalize();

  // Convert basis triplets into matrices so we can solve a single local->world rotation.
  const localBasis = new THREE.Matrix4().makeBasis(localRight, localUp, normal);
  const worldBasis = new THREE.Matrix4().makeBasis(worldRight, worldUp, worldNormal);

  return new THREE.Quaternion().setFromRotationMatrix(
    worldBasis.multiply(localBasis.invert()),
  );
}

export default function D20FateRoll() {
  const modelContainerRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const rollRef = useRef<{
    active: boolean;
    startTimeMs: number;
    durationMs: number;
    mainAxis: THREE.Vector3;
    totalAngle: number;
    startQuaternion: THREE.Quaternion;
    targetQuaternion: THREE.Quaternion;
    value: number | null;
  }>({
    active: false,
    startTimeMs: 0,
    durationMs: 1300,
    mainAxis: new THREE.Vector3(0, 1, 0),
    totalAngle: 0,
    startQuaternion: new THREE.Quaternion(),
    targetQuaternion: new THREE.Quaternion(),
    value: null,
  });

  // One-click roll flow: always start on face 20, then rotate to random face.
  const rollDice = () => {
    const model = modelRef.current;

    // Block until scene is ready, prevent double-rolls, and enforce one-roll flow.
    if (!model || rollRef.current.active || hasRolled) return;

    const startQuaternion = getCameraFacingUprightQuaternion(FACE_20, TOWARD_CAMERA);
    model.quaternion.copy(startQuaternion);

    const randomFace = facePoints[Math.floor(Math.random() * facePoints.length)];
    const targetQuaternion = getCameraFacingUprightQuaternion(randomFace, TOWARD_CAMERA);

    // Build a smooth single-axis path from face 20 to the selected face,
    // then add whole turns so the roll looks physical before landing.
    const deltaQuaternion = startQuaternion.clone().invert().multiply(targetQuaternion).normalize();
    // Quaternion -> axis/angle conversion starts with w = cos(theta/2), so clamp guards floating-point drift.
    const clampedW = THREE.MathUtils.clamp(deltaQuaternion.w, -1, 1);
    // Base rotation angle between start and target.
    let baseAngle = 2 * Math.acos(clampedW);
    // sin(theta/2) tells us whether axis extraction is numerically stable.
    const sinHalf = Math.sqrt(Math.max(0, 1 - clampedW * clampedW));
    let mainAxis = new THREE.Vector3(0, 1, 0);

    if (sinHalf > 1e-5) {
      // Axis comes from quaternion xyz normalized by sin(theta/2).
      mainAxis = new THREE.Vector3(
        deltaQuaternion.x / sinHalf,
        deltaQuaternion.y / sinHalf,
        deltaQuaternion.z / sinHalf,
      ).normalize();
    }

    // Re-map to the shortest signed angle so added full turns are predictable.
    if (baseAngle > Math.PI) {
      baseAngle -= Math.PI * 2;
    }

    // Keep spin direction consistent with shortest path unless the delta is exactly zero.
    const direction = baseAngle === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(baseAngle);
    // Number of extra complete revolutions before the die settles onto the selected face.
    const preTurns = THREE.MathUtils.randInt(3, 5);
    const totalAngle = baseAngle + direction * preTurns * Math.PI * 2;

    // Store everything needed by the per-frame animator.
    rollRef.current.active = true;
    rollRef.current.startTimeMs = performance.now();
    rollRef.current.durationMs = 2500 + Math.random() * 500;
    rollRef.current.mainAxis = mainAxis;
    rollRef.current.totalAngle = totalAngle;
    rollRef.current.startQuaternion = startQuaternion.clone();
    rollRef.current.targetQuaternion = targetQuaternion.clone();
    rollRef.current.value = randomFace.value;

    // UI state moves to rolling immediately; result is shown after final snap.
    setIsRolling(true);
    setResult(null);
  };

  // Three.js scene setup and render loop lifecycle.
  useEffect(() => {
    const container = modelContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(14, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.85;
    const loader = new GLTFLoader();

    let object: THREE.Object3D | null = null;
    let animationFrameId = 0;

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    camera.position.z = 34;

    // Lighting
    const frontLight = new THREE.PointLight(0xa31d00, 400, 0, 0);
    frontLight.position.set(0, 4, 22);
    scene.add(frontLight);

    const topLight = new THREE.PointLight(0xffffff, 2, 0, 0);
    topLight.position.set(0, 16, 24);
    scene.add(topLight);


    loader.load(
      "/d20/scene.gltf",
      (gltf) => {
        object = gltf.scene;

        // Normalize material response so texture detail stays visible with bright lights.
        object.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) {
            return;
          }

          const materials = Array.isArray(child.material) ? child.material : [child.material];
          for (const material of materials) {
            if (!(material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial)) {
              continue;
            }

            if (material.map) {
              material.map.colorSpace = THREE.SRGBColorSpace;
            }

            material.color.multiplyScalar(1.28);
            material.envMapIntensity = 1.5;
            material.metalness = Math.max(material.metalness, 0.38);
            material.roughness = Math.min(material.roughness, 0.34);
            if (material instanceof THREE.MeshPhysicalMaterial) {
              material.clearcoat = Math.max(material.clearcoat, 0.6);
              material.clearcoatRoughness = Math.min(material.clearcoatRoughness, 0.25);
            }
            material.needsUpdate = true;
          }
        });

        object.scale.setScalar(0.04);

        // Set deterministic initial pose with face 20 aimed at the camera.
        const uprightQuaternion = getCameraFacingUprightQuaternion(FACE_20, TOWARD_CAMERA);
        object.quaternion.copy(uprightQuaternion);

        modelRef.current = object;
        scene.add(object);
      },
      undefined,
      (error) => {
        console.error("An error happened", error);
      }
    );

    const animate = (now: number) => {
      animationFrameId = window.requestAnimationFrame(animate);

      if (object && rollRef.current.active) {
        // Time-based easing to drive one continuous roll trajectory.
        const elapsed = now - rollRef.current.startTimeMs;
        // Normalized animation progress in [0, 1].
        const t = Math.min(elapsed / rollRef.current.durationMs, 1);
        // Cubic ease-out: fast start, slower finish.
        const eased = 1 - Math.pow(1 - t, 3);
        // Convert eased progress into the current angle around the precomputed axis.
        const mainAngle = rollRef.current.totalAngle * eased;
        const mainQuaternion = new THREE.Quaternion().setFromAxisAngle(rollRef.current.mainAxis, mainAngle);

        // Compose current frame orientation from fixed start pose + animated axis-angle rotation.
        object.quaternion
          .copy(rollRef.current.startQuaternion)
          .multiply(mainQuaternion);

        if (t >= 1) {
          // Snap to exact target to avoid floating-point drift at the end.
          object.quaternion.copy(rollRef.current.targetQuaternion);
          // Finalize roll lifecycle and expose result in UI.
          rollRef.current.active = false;
          setIsRolling(false);
          setResult(rollRef.current.value);
          setHasRolled(true);
        }
      }

      // Draw the frame after any orientation updates.
      renderer.render(scene, camera);
    };

    animate(performance.now());

    const handleResize = () => {
      if (!container) return;
      // Keep camera projection and canvas dimensions aligned to responsive layout.
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup canvas/resources/listeners on unmount.
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      if (object) {
        scene.remove(object);
      }
    };
  }, []);

  return (
    <div className="w-full border border-black/20">
      <h2 className="text-center text-base font-bold">Roll the d20</h2>

      <button
        type="button"
        onClick={rollDice}
        className="mt-4 block h-64 w-full cursor-pointer"
        aria-label="Roll the d20"
        disabled={isRolling || hasRolled}
      >
        <div ref={modelContainerRef} className="h-full w-full" />
      </button>

      <div className="mt-3 pb-2 text-center text-sm font-semibold">
        {isRolling ? "Rolling..." : result ? `Result: ${result}` : "Click the dice to roll"}
      </div>
    </div>
  );
}
