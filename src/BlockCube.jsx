import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";


export default function BlockCube({
  position = [0, 0, 0],
}) {

    const cube = useGLTF("./cube1.glb");


  return (
    <RigidBody 
    type="fixed"
    colliders="cuboid"
    restitution={ 1 }
    friction={ 1  }
    position={ [ 0, 0, 0 ] }
    onCollisionEnter={({ manifold, target, other }) => {
      console.log(
        "cube",
        
      );

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
        <primitive
        object={cube.scene.clone()} // Clone the scene for each instance
        scale={ 0.50 } 
        position={position} 
    />
    </RigidBody>
  );
}

