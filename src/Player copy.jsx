import * as THREE from 'three';
import { useRapier, RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { world } = useRapier();

  const forwardImpulse = { x: 0, y: 0, z: -0.6 };
  const backwardImpulse = { x: 0, y: 0, z: 0.6 };
  const turnTorque = { x: 0, y: 1, z: 0 };

  useEffect(() => {
    const unsubscribeKeys = subscribeKeys();

    return () => {
      unsubscribeKeys();
    };
  }, []);

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulseStrength = 3 * delta;
    const torqueStrength = 1.5 * delta;

    if (forward) {
      body.current.applyImpulse(forwardImpulse.clone().multiplyScalar(impulseStrength));
    }

    if (backward) {
      body.current.applyImpulse(backwardImpulse.clone().multiplyScalar(impulseStrength));
    }

    if (leftward) {
      body.current.applyTorqueImpulse(turnTorque.clone().multiplyScalar(torqueStrength));
    }

    if (rightward) {
      body.current.applyTorqueImpulse(turnTorque.clone().multiplyScalar(-torqueStrength));
    }

    // Update camera position behind the player based on direction
    const bodyPosition = body.current.translation();
    const cameraPosition = bodyPosition.clone();
    cameraPosition.z -= 4;
    cameraPosition.y += 1;

    state.camera.position.lerp(cameraPosition, 0.1);
    state.camera.lookAt(bodyPosition);

    // ... Rest of your existing useFrame code
  });

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 0]}
      canSleep={false}
      colliders="ball"
      restitution={0.01}
      friction={100}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
