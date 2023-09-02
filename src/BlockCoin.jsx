import * as THREE from 'three'
import { RigidBody } from "@react-three/rapier";
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef ,useState} from 'react'
import { playCoin } from './Audio';
import { gsap } from "gsap";

export default function BlockCoin({
  position = [0, 0, 0],
  geometry,
  material
}) {


  const [hit, setHit] = useState(false);
  const coin = useRef()

  if (coin.current) {
    coin.current.material.opacity = 0.5;
  }

  useEffect(() => {
    if (hit === true) {


      const tl = gsap.timeline();
      tl.add("anim_start", "+=0") // Here is your label.

      // Animate rotation
      .to(coin.current.rotation, {
        duration: 0.6,
        ease: 'power2.inOut',
        y: '+=10',
      })

      // Animate position
      .to(
        coin.current.position,
        {
          duration: 1,
          ease: 'power2.inOut',
          y: '+=0.5'
        },
        '-=0.6' 
      )
      // meshRef.current.material.opacity = opacity === 1 ? 0.5 : 1;

      // Animate opacity
      .to(
        coin.current.material,
        {
          duration: 0.6,
          ease: 'power2.inOut',
          opacity: 0,
        },
        '-=0.4' 
      )


    }
  }, [hit]);

  return (
    <group position={position}>
    <mesh scale={0.2}
    ref={coin}
    position={[0,1,0]}
    castShadow
    
    geometry={new THREE.SphereGeometry(1, 0.5,0.5)}
    >
        <meshStandardMaterial color="gold" opacity={1} transparent />

      </mesh>


  <RigidBody 
    type="fixed"
    colliders="cuboid"
    restitution={ 1 }
    friction={ 1  }
    position={ [ 0, 0, 0 ] }
    onCollisionEnter={({ manifold, target, other }) => {
      console.log(
        "coin",
       // manifold.solverContactPoint(0),
 
      );
      setHit(true),
      playCoin()

      if (other.rigidBodyObject) {
        // console.log(
        //   // this rigid body's Object3D
        //   target.rigidBodyObject.name,
        //   " collided with ",
        //   // the other rigid body's Object3D
        //   other.rigidBodyObject.name
        // );
      }
    }}
    >

    <mesh 
      receiveShadow
      geometry={geometry}
      material={material}
      />
</RigidBody>
    </group>
  );
}
