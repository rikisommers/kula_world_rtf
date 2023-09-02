import * as THREE from 'three'
import { RigidBody } from "@react-three/rapier";
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import BlockBlock from './Block';

export default function BlockSpinner({
  position = [0, 0, 0],
  geometry,
  material,
  obstacleMaterial,
}) {


    const obstacle = useRef()
    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1))

    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
                obstacle.current.setNextKinematicRotation(rotation)
    })

  return (
    <group position={position}>
      {/* <mesh
        receiveShadow
        geometry={geometry}
        material={material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      /> */}
      {/* <boxGeometry args={ [ 4, 0.2, 4 ] } /> */}
      {/* <meshStandardMaterial color="limegreen" /> */}


      <RigidBody 
      ref={obstacle}
      type="kinematicPosition"
      position={ [ 0, 0.3, 0 ] }
      restitution={ 0.2 } 
      friction={ 0 }
      >
        <mesh
          castShadow
          receiveShadow
          geometry={geometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
}
