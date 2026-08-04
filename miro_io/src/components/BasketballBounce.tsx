"use client";

import { useEffect, useRef, useState } from "react";

// Shared sizing and physics values for the bounce area.
const DEFAULT_BOX_WIDTH = 420;
const DEFAULT_BOX_HEIGHT = 260;
// The floor sits at the bottom edge of the box in this version.
const FLOOR_HEIGHT = 0;
// Ball size controls rendering and collision boundaries.
const BALL_SIZE = 216;
// A real basketball is about 24cm in diameter.
const BASKETBALL_DIAMETER_METERS = 0.24;
// Convert visual ball size into a rough pixels-per-meter scale.
const PIXELS_PER_METER = BALL_SIZE / BASKETBALL_DIAMETER_METERS;
// Earth gravity converted from m/s^2 into px/s^2.
const GRAVITY = 9.8 * PIXELS_PER_METER;
// Basketballs keep a lively first bounce on hardwood.
const FLOOR_BOUNCE = 0.86;
// Walls and ceiling should feel softer than the floor.
const WALL_BOUNCE = 0.68;
// Sideways rolling should die out fairly quickly after contact.
const FLOOR_ROLL_DAMPING = 0.86;
// Pointer release is only slightly boosted so throws do not feel overpowered.
const RELEASE_VELOCITY_SCALE = 1.08;
// Small tolerances help the ball settle cleanly on the floor.
const FLOOR_EPSILON = 0.5;
const REST_SPEED = 18;
// Kill small rebounds so the ball does not chatter on the floor forever.
const FLOOR_BOUNCE_STOP_SPEED = 180;
// Each floor impact should lose a bit more energy than the last.
const FLOOR_BOUNCE_DECAY_PER_HIT = 0.04;
// After a few bounces, low-energy impacts should settle immediately.
const MAX_BOUNCES_BEFORE_FORCE_SETTLE = 6;
const FORCE_SETTLE_VERTICAL_SPEED = 420;
const INITIAL_POSITION = { x: 48, y: DEFAULT_BOX_HEIGHT - FLOOR_HEIGHT - BALL_SIZE };

export default function BasketballBounce() {
  // Animation frame id so the loop can be cancelled cleanly.
  const frameRef = useRef<number | null>(null);
  // Tracks whether the ball is fully settled so the loop can stop.
  const isSettledRef = useRef(false);
  // Counts repeated floor impacts during the current throw.
  const bounceCountRef = useRef(0);
  // Tracks drag state synchronously outside React renders.
  const isDraggingRef = useRef(false);
  // Last frame timestamp used to compute delta time.
  const lastTimeRef = useRef<number | null>(null);
  // Velocity lives in a ref so the animation loop can update it without rerendering.
  const velocityRef = useRef({ x: 0, y: 0 });
  // Position lives in a ref so animation does not trigger rerenders.
  const positionRef = useRef(INITIAL_POSITION);
  // Drag offset keeps the pointer anchored to the same spot on the ball.
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  // Recent pointer points are used to turn a release into throw velocity.
  const pointerHistoryRef = useRef<{ x: number; y: number; time: number }[]>([]);
  // This ref points at the element that defines the bounce area.
  const boxRef = useRef<HTMLDivElement | null>(null);
  // This ref points at the rendered ball element.
  const ballRef = useRef<HTMLDivElement | null>(null);

  // Current measured size of the bounce area.
  const [boxSize, setBoxSize] = useState({ width: DEFAULT_BOX_WIDTH, height: DEFAULT_BOX_HEIGHT });

  // The largest allowed top position before the ball hits the floor.
  const floorY = boxSize.height - FLOOR_HEIGHT - BALL_SIZE;
  // This flag pauses physics while the user is holding the ball.
  const [isDragging, setIsDragging] = useState(false);

  // Apply the current ball position directly to the DOM element.
  function renderBall(position: { x: number; y: number }, dragging: boolean) {
    const ball = ballRef.current;
    if (!ball) {
      return;
    }

    ball.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    ball.style.cursor = dragging ? "grabbing" : "grab";
  }

  // Resize the bounce area when the container changes size.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) {
      return;
    }

    // Measure the live element and fall back to defaults if needed.
    const updateSize = () => {
      const nextWidth = Math.round(box.clientWidth || DEFAULT_BOX_WIDTH);
      const nextHeight = Math.round(box.clientHeight || DEFAULT_BOX_HEIGHT);

      setBoxSize((current) => {
        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    // Run once so physics has the correct starting bounds.
    updateSize();

    // Watch future size changes from layout or viewport updates.
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(box);

    return () => {
      // Stop observing when the component unmounts.
      resizeObserver.disconnect();
    };
  }, []);

  // Clamp the ball after size changes and render its current position.
  useEffect(() => {
    const nextPosition = {
      x: Math.max(0, Math.min(boxSize.width - BALL_SIZE, positionRef.current.x)),
      y: Math.max(0, Math.min(floorY, positionRef.current.y)),
    };

    positionRef.current = nextPosition;
    renderBall(nextPosition, isDraggingRef.current);
  }, [boxSize.width, floorY]);

  // Run the gravity and wall-bounce simulation when the ball is free.
  useEffect(() => {
    if (isDragging) {
      // Stop the loop while the user is directly controlling the ball.
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      // Reset timing so the first post-drag frame does not jump.
      lastTimeRef.current = null;
      return;
    }

    // Restart physics after a new release.
    isSettledRef.current = false;

    // One animation step advances the ball using elapsed time.
    const step = (time: number) => {
      if (isSettledRef.current) {
        frameRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        // Seed the timer on the first frame.
        lastTimeRef.current = time;
      }

      // Cap delta so tab switches do not create giant physics jumps.
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.032);
      lastTimeRef.current = time;

      const current = positionRef.current;

      // If the ball is already settled on the floor, skip extra work.
      const isAlreadyResting = current.y >= floorY - FLOOR_EPSILON && Math.abs(velocityRef.current.y) < REST_SPEED && Math.abs(velocityRef.current.x) < REST_SPEED;
      if (isAlreadyResting) {
        const settledPosition = { x: Math.round(current.x), y: floorY };
        velocityRef.current = { x: 0, y: 0 };
        positionRef.current = settledPosition;
        renderBall(settledPosition, false);
        isSettledRef.current = true;
      } else {
        isSettledRef.current = false;

        // Treat tiny vertical motion on the floor as a grounded rolling state.
        const isGrounded = current.y >= floorY - FLOOR_EPSILON && Math.abs(velocityRef.current.y) < REST_SPEED;

        // Move from the current position using the stored velocity.
        let nextX = current.x + velocityRef.current.x * delta;
        let nextY = isGrounded ? floorY : current.y + velocityRef.current.y * delta;
        // Start from the current velocity before applying collisions.
        let nextVelocityX = velocityRef.current.x;
        // Gravity increases downward speed every frame unless the ball is grounded.
        let nextVelocityY = isGrounded ? 0 : velocityRef.current.y + GRAVITY * delta;

        // Let grounded horizontal motion decay smoothly without re-bouncing vertically.
        if (isGrounded) {
          nextVelocityX *= 0.94;
          if (Math.abs(nextVelocityX) < REST_SPEED) {
            nextVelocityX = 0;
          }
        }

        // Bounce off the left wall.
        if (nextX <= 0) {
          nextX = 0;
          nextVelocityX *= -WALL_BOUNCE;
        }

        // Bounce off the right wall.
        if (nextX >= boxSize.width - BALL_SIZE) {
          nextX = boxSize.width - BALL_SIZE;
          nextVelocityX *= -WALL_BOUNCE;
        }

        // Bounce off the ceiling.
        if (nextY <= 0) {
          nextY = 0;
          nextVelocityY *= -WALL_BOUNCE;
        }

        // Bounce off the floor and apply a little horizontal damping.
        if (!isGrounded && nextY >= floorY - FLOOR_EPSILON) {
          bounceCountRef.current += 1;
          nextY = floorY;
          const floorBounceForThisHit = Math.max(0.45, FLOOR_BOUNCE - ((bounceCountRef.current - 1) * FLOOR_BOUNCE_DECAY_PER_HIT));
          nextVelocityY *= -floorBounceForThisHit;

          // Kill small rebounds so the ball settles like a real dribble ending.
          if (Math.abs(nextVelocityY) < FLOOR_BOUNCE_STOP_SPEED) {
            nextVelocityY = 0;
          }

          // After a few bounces, low-energy impacts should settle immediately.
          if (bounceCountRef.current >= MAX_BOUNCES_BEFORE_FORCE_SETTLE && Math.abs(nextVelocityY) < FORCE_SETTLE_VERTICAL_SPEED) {
            nextVelocityY = 0;
          }

          // Reduce sideways speed on each floor hit so rolling dies out quickly.
          nextVelocityX *= FLOOR_ROLL_DAMPING;
          // Snap tiny sideways drift to zero.
          if (Math.abs(nextVelocityX) < REST_SPEED) {
            nextVelocityX = 0;
          }
        }

        // If both speeds are tiny on the floor, fully settle the ball.
        const isRestingOnFloor = nextY >= floorY - FLOOR_EPSILON && Math.abs(nextVelocityY) < REST_SPEED && Math.abs(nextVelocityX) < REST_SPEED;
        if (isRestingOnFloor) {
          nextY = floorY;
          nextVelocityY = 0;
          nextVelocityX = 0;
          bounceCountRef.current = 0;
          isSettledRef.current = true;
        }

        const nextPosition = { x: Math.round(nextX), y: Math.round(nextY) };

        // Save velocity and position for the next animation frame.
        velocityRef.current = { x: nextVelocityX, y: nextVelocityY };
        positionRef.current = nextPosition;
        renderBall(nextPosition, false);
      }

      // Queue the next frame only while motion is still active.
      if (!isSettledRef.current) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
      }
    };

    // Start the animation loop.
    frameRef.current = requestAnimationFrame(step);

    return () => {
      // Cancel any pending frame during cleanup.
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      // Clear timing state for the next loop start.
      lastTimeRef.current = null;
    };
  }, [boxSize.width, floorY, isDragging]);

  // Convert pointer coordinates into a ball position inside the box.
  function clampPosition(clientX: number, clientY: number) {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) {
      return null;
    }

    // Translate viewport pointer coordinates into local box coordinates.
    const x = clientX - box.left - dragOffsetRef.current.x;
    const y = clientY - box.top - dragOffsetRef.current.y;

    // Keep the dragged ball fully inside the allowed area.
    return {
      x: Math.max(0, Math.min(boxSize.width - BALL_SIZE, x)),
      y: Math.max(0, Math.min(floorY, y)),
    };
  }

  // Move the ball with the pointer while it is being dragged.
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    // Convert the pointer into a safe ball position.
    const nextPosition = clampPosition(event.clientX, event.clientY);
    if (!nextPosition) {
      return;
    }

    // Keep only a small recent history for a smoother throw speed.
    const now = performance.now();
    pointerHistoryRef.current = [...pointerHistoryRef.current, { x: event.clientX, y: event.clientY, time: now }].slice(-5);
    // Follow the pointer immediately during drag.
    positionRef.current = nextPosition;
    renderBall(nextPosition, true);
  }

  // Use recent pointer motion to turn the release into a throw velocity.
  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    // Compare the oldest and newest recent pointer samples.
    const history = pointerHistoryRef.current;
    const lastPoint = history[history.length - 1];
    const firstPoint = history[0];
    // Guard against tiny time windows when computing speed.
    const elapsed = Math.max((lastPoint?.time ?? 0) - (firstPoint?.time ?? 0), 16);

    // Convert pointer travel per millisecond into pixels per second.
    velocityRef.current = {
      x: ((((lastPoint?.x ?? event.clientX) - (firstPoint?.x ?? event.clientX)) / elapsed) * 1000) * RELEASE_VELOCITY_SCALE,
      y: ((((lastPoint?.y ?? event.clientY) - (firstPoint?.y ?? event.clientY)) / elapsed) * 1000) * RELEASE_VELOCITY_SCALE,
    };

    // Clear drag-only data and hand control back to physics.
    pointerHistoryRef.current = [];
    isDraggingRef.current = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  // Start dragging and reset motion so the user can throw the ball again.
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Measure the ball so the grab point stays under the pointer.
    const ball = event.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - ball.left,
      y: event.clientY - ball.top,
    };
    // Start a short pointer history for release velocity.
    pointerHistoryRef.current = [{ x: event.clientX, y: event.clientY, time: performance.now() }];
    // Clear any old motion from the previous throw.
    velocityRef.current = { x: 0, y: 0 };
    bounceCountRef.current = 0;
    isSettledRef.current = false;
    isDraggingRef.current = true;
    lastTimeRef.current = null;
    // Switch from free physics to direct pointer control.
    setIsDragging(true);
    // Keep receiving pointer events even if the pointer moves fast.
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return (
    <div className="h-full w-full">
      {/* Transparent container that defines the bounce area. */}
      <div
        ref={boxRef}
        className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-transparent bg-transparent"
      >
        {/* Draggable ball whose position is driven by drag input or the physics loop. */}
        <div
          ref={ballRef}
          className="absolute z-10 overflow-hidden rounded-full"
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
            left: 0,
            top: 0,
            transform: `translate3d(${INITIAL_POSITION.x}px, ${INITIAL_POSITION.y}px, 0)`,
            willChange: "transform",
            touchAction: "none",
            cursor: isDragging ? "grabbing" : "grab",
            backgroundColor: "#e97821",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path d="M50 4 C43 24 43 76 50 96" fill="none" stroke="#6a2f0c" strokeWidth="3" strokeLinecap="round" />
            <path d="M4 50 C24 43 76 43 96 50" fill="none" stroke="#6a2f0c" strokeWidth="3" strokeLinecap="round" />
            <path d="M17 6 C35 28 35 72 17 94" fill="none" stroke="#6a2f0c" strokeWidth="3" strokeLinecap="round" />
            <path d="M83 6 C65 28 65 72 83 94" fill="none" stroke="#6a2f0c" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}