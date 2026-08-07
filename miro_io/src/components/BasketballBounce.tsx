"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Vec2 = {
  // Horizontal position/velocity component in world space.
  x: number;
  // Vertical position/velocity component in world space.
  y: number;
};

type SceneBounds = {
  // Left-most x where ball center can move.
  left: number;
  // Right-most x where ball center can move.
  right: number;
  // Floor y where the ball should bounce/settle.
  floor: number;
  // Upper y limit (kept infinite for open ceiling behavior).
  ceiling: number;
};

// Visual diameter target for the imported basketball model in scene units.
const TARGET_BALL_DIAMETER = 4;
// Camera distance from origin; also used when deriving visible world bounds.
const CAMERA_Z = 12;
// Downward acceleration (world units / s^2).
const GRAVITY = 70;
// Extra spacing above the visual bottom edge so the model does not clip.
const BOTTOM_CLEARANCE = 0.35;
// Horizontal margin so the model does not clip against left/right edges.
const SIDE_CLEARANCE = 0.25;
// Energy retained after floor impacts.
const FLOOR_BOUNCE = 0.90;
// Energy retained after side-wall impacts.
const WALL_BOUNCE = 0.75;
// Horizontal speed damping applied on floor impact.
const FLOOR_FRICTION = 0.94;
// Per-frame damping for free motion in air.
const AIR_DRAG = 0.996;
// Threshold under which motion is considered effectively stopped.
const REST_SPEED = 0.12;
// Small vertical rebounds are snapped to zero to avoid jitter.
const BOUNCE_STOP_SPEED = 0.18;
// Scales release velocity estimated from pointer movement.
const RELEASE_VELOCITY_SCALE = 1.08;
// Maps translational velocity into visual spin at release.
const SPIN_SCALE = 0.35;
// Spin damping applied each frame.
const SPIN_DAMPING = 0.985;

function clamp(value: number, min: number, max: number) {
  // Utility clamp used for bounds-safe positions.
  return Math.max(min, Math.min(max, value));
}

function worldPointFromPointer(
  clientX: number,
  clientY: number,
  container: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
) {
  // Convert screen pointer coordinates into normalized device coordinates.
  const rect = container.getBoundingClientRect();
  const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);

  // Unproject into world space and intersect the z=0 interaction plane.
  const point = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
  const direction = point.sub(camera.position).normalize();
  const distance = -camera.position.z / direction.z;

  return camera.position.clone().add(direction.multiplyScalar(distance));
}

export default function BasketballBounce() {
  // DOM node where the WebGL canvas is mounted.
  const sceneContainerRef = useRef<HTMLDivElement | null>(null);
  // Renderer instance reference for resize/cleanup.
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  // Camera reference for pointer-to-world conversion and resize updates.
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  // Scene reference retained for completeness/debugging.
  const sceneRef = useRef<THREE.Scene | null>(null);
  // Parent group for the basketball model so position/spin can be controlled together.
  const basketballGroupRef = useRef<THREE.Group | null>(null);
  // Cached physical radius used for collision bounds.
  const ballRadiusRef = useRef(TARGET_BALL_DIAMETER / 2);
  // Dynamic world-space movement limits, derived from camera frustum and container size.
  const boundsRef = useRef<SceneBounds>({
    left: -3,
    right: 3,
    floor: -2,
    ceiling: Number.POSITIVE_INFINITY,
  });
  const lastTimeRef = useRef<number | null>(null);
  // Drag state is kept in refs to avoid high-frequency re-renders.
  const isDraggingRef = useRef(false);
  // Marks when the ball has fully settled so physics can pause.
  const isSettledRef = useRef(false);
  // Used to progressively reduce bounce height over repeated impacts.
  const bounceCountRef = useRef(0);
  // Linear velocity in world units/second.
  const velocityRef = useRef<Vec2>({ x: 0, y: 0 });
  // Angular velocity-like values used for visual spin.
  const spinRef = useRef({ x: 0, y: 0, z: 0 });
  // Current world-space center position of the ball.
  const positionRef = useRef<Vec2>({ x: 0, y: 0 });
  // Pointer-to-ball offset so drags feel anchored where user grabbed.
  const dragOffsetRef = useRef<Vec2>({ x: 0, y: 0 });
  // Sliding window of recent pointer samples for release velocity estimation.
  const pointerHistoryRef = useRef<{ x: number; y: number; time: number }[]>([]);
  // Ensures physics only runs after the model is loaded.
  const modelLoadedRef = useRef(false);
  // UI-only flag for loading text visibility.
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const syncBallToScene = () => {
    // Push latest simulated position into the rendered group transform.
    const group = basketballGroupRef.current;
    if (!group) {
      return;
    }

    group.position.set(positionRef.current.x, positionRef.current.y, 0);
  };

  const updateBounds = useCallback((width: number, height: number) => {
    const camera = cameraRef.current;
    if (!camera) {
      return;
    }

    // Compute the visible world extents at z=0 from camera FOV and container aspect ratio.
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAMERA_Z;
    const visibleWidth = visibleHeight * (width / height);
    const radius = ballRadiusRef.current;

    // Bounds track where the ball center is allowed, with configurable visual clearances.
    boundsRef.current = {
      left: -visibleWidth / 2 + radius + SIDE_CLEARANCE,
      right: visibleWidth / 2 - radius - SIDE_CLEARANCE,
      floor: -visibleHeight / 2 + radius + BOTTOM_CLEARANCE,
      ceiling: Number.POSITIVE_INFINITY,
    };

    // Keep the existing ball position legal after any resize.
    positionRef.current = {
      x: clamp(positionRef.current.x, boundsRef.current.left, boundsRef.current.right),
      y: clamp(positionRef.current.y, boundsRef.current.floor, boundsRef.current.ceiling),
    };
    syncBallToScene();
  }, []);

  const resetThrowState = useCallback(() => {
    // Reset all motion to a clean state before drag starts or when parking at rest.
    velocityRef.current = { x: 0, y: 0 };
    spinRef.current = { x: 0, y: 0, z: 0 };
    bounceCountRef.current = 0;
    isSettledRef.current = false;
  }, []);

  const placeBallAtRest = useCallback(() => {
    // Put the ball on the floor at center and mark simulation as settled.
    resetThrowState();
    positionRef.current = {
      x: 0,
      y: boundsRef.current.floor,
    };
    isSettledRef.current = true;
    lastTimeRef.current = null;
    syncBallToScene();
  }, [resetThrowState]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Require fully initialized scene objects before allowing interaction.
    const container = sceneContainerRef.current;
    const camera = cameraRef.current;
    const group = basketballGroupRef.current;
    if (!container || !camera || !group) {
      return;
    }

    const worldPoint = worldPointFromPointer(event.clientX, event.clientY, container, camera);
    // Capture grab offset so the model follows the exact contact point.
    dragOffsetRef.current = {
      x: worldPoint.x - positionRef.current.x,
      y: worldPoint.y - positionRef.current.y,
    };

    // Seed pointer history for release velocity and enter drag mode.
    pointerHistoryRef.current = [{ x: worldPoint.x, y: worldPoint.y, time: performance.now() }];
    resetThrowState();
    isDraggingRef.current = true;
    // Pointer capture keeps drag stable even if cursor leaves the element.
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Ignore move events unless this component currently owns the drag.
    if (!isDraggingRef.current) {
      return;
    }

    const container = sceneContainerRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) {
      return;
    }

    const worldPoint = worldPointFromPointer(event.clientX, event.clientY, container, camera);
    // Convert pointer motion into clamped world-space position.
    const nextPosition = {
      x: clamp(worldPoint.x - dragOffsetRef.current.x, boundsRef.current.left, boundsRef.current.right),
      y: clamp(worldPoint.y - dragOffsetRef.current.y, boundsRef.current.floor, boundsRef.current.ceiling),
    };

    // Keep a short recent sample window for robust velocity estimation.
    pointerHistoryRef.current = [
      ...pointerHistoryRef.current,
      { x: worldPoint.x, y: worldPoint.y, time: performance.now() },
    ].slice(-6);

    positionRef.current = nextPosition;
    syncBallToScene();
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Ignore release if we were not in an active drag.
    if (!isDraggingRef.current) {
      return;
    }

    // Derive release speed from oldest/newest samples in the short history window.
    const history = pointerHistoryRef.current;
    const firstPoint = history[0];
    const lastPoint = history[history.length - 1];
    const elapsed = Math.max((lastPoint?.time ?? 0) - (firstPoint?.time ?? 0), 16);

    // Convert pointer delta/time into world units per second.
    velocityRef.current = {
      x: ((((lastPoint?.x ?? positionRef.current.x) - (firstPoint?.x ?? positionRef.current.x)) / elapsed) * 1000) * RELEASE_VELOCITY_SCALE,
      y: ((((lastPoint?.y ?? positionRef.current.y) - (firstPoint?.y ?? positionRef.current.y)) / elapsed) * 1000) * RELEASE_VELOCITY_SCALE,
    };

    // Seed a spin impulse that visually matches the release direction.
    spinRef.current = {
      x: velocityRef.current.y * SPIN_SCALE,
      y: velocityRef.current.x * SPIN_SCALE,
      z: velocityRef.current.x * 0.25,
    };

    pointerHistoryRef.current = [];
    isDraggingRef.current = false;

    // Release pointer capture only if this element still owns it.
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    // Scene setup runs once; all animation/interaction mutates refs after that.
    const container = sceneContainerRef.current;
    if (!container) {
      return;
    }

    // Create base Three.js primitives.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, CAMERA_Z);
    camera.lookAt(0, 0, 0);

    // Transparent renderer to blend with page artwork.
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    sceneRef.current = scene;

    // Lighting stack tuned for readable seams and warm scroll palette.
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xfff4dc, 0x3a1f11, 1.2);
    scene.add(fillLight);

    const courtGlow = new THREE.PointLight(0xffb47a, 1.2, 30);
    courtGlow.position.set(0, -2, 8);
    scene.add(courtGlow);

    const basketballGroup = new THREE.Group();
    basketballGroupRef.current = basketballGroup;
    scene.add(basketballGroup);

    const loader = new GLTFLoader();
    // Cleanup guards for async load and RAF lifecycle.
    let destroyed = false;
    let animationFrameId = 0;

    // Mount and configure canvas.
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.display = "block";

    const resizeScene = () => {
      // Resize may fire before refs are fully wired.
      if (!sceneContainerRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }

      // Keep camera projection and simulated bounds in lockstep with DOM size.
      const nextWidth = Math.max(sceneContainerRef.current.clientWidth, 1);
      const nextHeight = Math.max(sceneContainerRef.current.clientHeight, 1);

      cameraRef.current.aspect = nextWidth / nextHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nextWidth, nextHeight);
      updateBounds(nextWidth, nextHeight);
    };

    const resizeObserver = new ResizeObserver(resizeScene);
    resizeObserver.observe(container);
    // Initialize bounds once before first interaction.
    resizeScene();

    loader.load(
      "/basketball/scene.gltf",
      (gltf) => {
        if (destroyed) {
          return;
        }

        // Normalize imported model to a predictable centered scale.
        const basketball = gltf.scene;
        const box = new THREE.Box3().setFromObject(basketball);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const scale = TARGET_BALL_DIAMETER / maxDimension;

        // Center and orient seams for the intended starting look.
        basketball.position.sub(center);
        basketball.scale.setScalar(scale);
        basketball.rotation.z = -Math.PI / 2;
        basketball.rotation.y = -Math.PI / 6;
        basketballGroup.add(basketball);
        // Cache radius and enable physics/render state.
        ballRadiusRef.current = TARGET_BALL_DIAMETER / 2;
        modelLoadedRef.current = true;
        setIsModelLoaded(true);
        placeBallAtRest();
      },
      undefined,
      (error) => {
        // Keep load failures visible in console for asset debugging.
        console.error("Failed to load basketball model", error);
      },
    );

    const step = (time: number) => {
      // Wait until camera and model group are ready before simulating.
      const ballGroup = basketballGroupRef.current;
      const cameraInstance = cameraRef.current;
      if (!ballGroup || !cameraInstance) {
        animationFrameId = window.requestAnimationFrame(step);
        return;
      }

      if (lastTimeRef.current === null) {
        // Seed first frame timestamp.
        lastTimeRef.current = time;
      }

      // Clamp delta to avoid giant jumps after tab inactivity.
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.032);
      lastTimeRef.current = time;

      // Run physics only when model is loaded, not being dragged, and not fully settled.
      if (!isDraggingRef.current && modelLoadedRef.current && !isSettledRef.current) {
        // Gravity accelerates downward every frame.
        velocityRef.current.y -= GRAVITY * delta;

        let nextX = positionRef.current.x + velocityRef.current.x * delta;
        let nextY = positionRef.current.y + velocityRef.current.y * delta;
        let nextVelocityX = velocityRef.current.x * AIR_DRAG;
        let nextVelocityY = velocityRef.current.y * AIR_DRAG;

        // Pull current collision bounds snapshot.
        const { left, right, floor, ceiling } = boundsRef.current;

        // Left/right wall collisions reflect horizontal velocity with damping.
        if (nextX <= left) {
          nextX = left;
          nextVelocityX = Math.abs(nextVelocityX) * WALL_BOUNCE;
        } else if (nextX >= right) {
          nextX = right;
          nextVelocityX = -Math.abs(nextVelocityX) * WALL_BOUNCE;
        }

        // Ceiling remains available even though it is configured as infinity.
        if (nextY >= ceiling) {
          nextY = ceiling;
          nextVelocityY = -Math.abs(nextVelocityY) * WALL_BOUNCE;
        }

        // Floor collision adds bounce loss, friction, and spin impulse.
        if (nextY <= floor) {
          nextY = floor;
          bounceCountRef.current += 1;

          // Gradually reduce bounce strength across repeated impacts.
          const floorBounce = bounceCountRef.current > 1
            ? Math.max(0.45, FLOOR_BOUNCE - ((bounceCountRef.current - 1) * 0.04))
            : FLOOR_BOUNCE;

          nextVelocityY = Math.abs(nextVelocityY) * floorBounce;
          nextVelocityX *= FLOOR_FRICTION;
          spinRef.current.z += nextVelocityX * 0.025;

          // Snap tiny rebounds to zero so the ball doesn't chatter forever.
          if (Math.abs(nextVelocityY) < BOUNCE_STOP_SPEED) {
            nextVelocityY = 0;
          }
        }

        // Apply global damping after collisions.
        nextVelocityX *= AIR_DRAG;
        nextVelocityY *= AIR_DRAG;

        // If motion is tiny on the floor, settle fully.
        const nearFloor = nextY <= floor + 0.02;
        const nearlyStill = Math.abs(nextVelocityX) < REST_SPEED && Math.abs(nextVelocityY) < REST_SPEED;
        if (nearFloor && nearlyStill) {
          nextX = clamp(nextX, left, right);
          nextY = floor;
          nextVelocityX = 0;
          nextVelocityY = 0;
          spinRef.current = { x: 0, y: 0, z: 0 };
          bounceCountRef.current = 0;
          isSettledRef.current = true;
        }

        // Commit integrated position/velocity for next frame.
        positionRef.current = {
          x: clamp(nextX, left, right),
          y: clamp(nextY, floor, ceiling),
        };
        velocityRef.current = {
          x: nextVelocityX,
          y: nextVelocityY,
        };
        syncBallToScene();
      }

      // Always update spin visual even when translation is paused.
      ballGroup.rotation.x += spinRef.current.x * delta;
      ballGroup.rotation.y += spinRef.current.y * delta;
      ballGroup.rotation.z += spinRef.current.z * delta;
      spinRef.current.x *= SPIN_DAMPING;
      spinRef.current.y *= SPIN_DAMPING;
      spinRef.current.z *= SPIN_DAMPING;

      renderer.render(scene, cameraInstance);
      animationFrameId = window.requestAnimationFrame(step);
    };

    // Start render/physics loop.
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      // Prevent async loader work from mutating unmounted state.
      destroyed = true;
      // Stop observing layout and animation work.
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      lastTimeRef.current = null;
      // Free GL resources and detach canvas.
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [placeBallAtRest, updateBounds]);

  return (
    // Full-size wrapper keeps scene aligned with parent slot.
    <div className="h-full w-full">
      <div
        ref={sceneContainerRef}
        // Interaction surface for pointer-driven dragging/throwing.
        className="relative h-full w-full overflow-hidden bg-transparent"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Loading hint stays above canvas until model finishes loading. */}
        {!isModelLoaded && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold text-black/50">
            Loading basketball...
          </div>
        )}
      </div>
    </div>
  );
}
