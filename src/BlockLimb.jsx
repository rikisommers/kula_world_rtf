import * as THREE from 'three'
import { RigidBody } from "@react-three/rapier";
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function BlockAxe({
  position = [0, 0, 0],
  geometry,
  material,
  obstacleMaterial,
}) {

    const obstacle = useRef()
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset) * 1.25
   // obstacle.current.setNextKinematicTranslation({ x: 0, y: y, z: 0 })
    obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    
    })

  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={geometry}
        material={material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
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
          scale={ [ 1.5, 1.5, 0.3 ] }
        />
      </RigidBody>
    </group>
  );
}
