import * as THREE from "three";
import {
  useRapier,
  RigidBody,
  quat,
  euler,
  RapierRigidBody,
} from "@react-three/rapier"; // Correct import for Quat and Euler
import { useFrame } from "@react-three/fiber";
import {
  useKeyboardControls,
  useGLTF,
  PivotControls,
  TransformControls,
  OrbitControls,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import useGame from "./stores/useGame.jsx";
import { useControls } from "leva";
import { degToRad } from "three/src/math/MathUtils.js";
import { gsap } from "gsap";
import { playFall, playLand, playStart } from "./Audio.jsx";

export default function Player({onPlayerPositionChange,onPlayerDirectionChange}) {

  const ball = useGLTF("./ball1.glb");
  const MovementState = {
    IDLE: "idle",
    FORWARD: "forward",
    BACKWARD: "backward",
    MOVE_LEFT: "move_left",
    MOVE_RIGHT: "move_right",
  };

  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const body = useRef();
  const player = useRef();

  const [movementState, setMovementState] = useState(MovementState.IDLE);
  const [camPosition, setCamPosition] = useState(new THREE.Vector3(10, 10, 10));


  //const body = useRef<RapierRigidBody>(null);
  // const positionArray = rigidBody.current.position;
  // const positionVec3 = new Vector3(positionArray[0], positionArray[1], positionArray[2]);

  // const positionArray = world.positions.getTranslation(handle); // Returns an array [x, y, z]
  // const positionVec3 = new Vector3(positionArray[0], positionArray[1], positionArray[2]);

  // Define movement states



 


  // Define an array of camera positions for different states
  const cameraStates = [
    { x: 0, y: 1, z: 3 }, // Forward
    { x: 3, y: 1, z: 0 }, // Move Left
    { x: 0, y: 1, z: -3 }, // Backward
    { x: -3, y: 1, z: 0 }, // Move Right
  ];





  // Maintain a variable to keep track of the current camera state index
  const [cameraStateIndex, setCameraStateIndex] = useState(0);

  useEffect(() => {
    if(cameraStateIndex === 0){
     onPlayerDirectionChange('world forward')
    }else if(cameraStateIndex === 1){
     onPlayerDirectionChange('world left')
 
    }else if(cameraStateIndex === 2){
     onPlayerDirectionChange('world back')
 
    }else if(cameraStateIndex === 3){
     onPlayerDirectionChange('world right')
    }
   }, [cameraStateIndex]);
 
 
   
  const jump = () => {
    //console.log('Yes, jump!')
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    //console.log(hit.toi)
    if (hit.toi < 0.15) playLand(); // Play the sound when the ball lands

    body.current.applyImpulse({ x: 0, y: 2, z: 0 });
    // body.current.setLinvel({ x: 0, y: 0.5, z: 1 })
  };

  // const rotationInRadians = (playerRotation + 90) * (Math.PI / 180);

  //let direction = new THREE.Vector3([])

  const move = () => {
    //console.log('going forward!');

    const dist = 5;


    // { x: 0, y: 1, z: 3 }, // Forward
    // { x: 3, y: 1, z: 0 }, // Move Left
    // { x: 0, y: 1, z: -3 }, // Backward
    // { x: -3, y: 1, z: 0 }, // Move Right

    if (cameraStateIndex === 0) {
      body.current.setLinvel({ x: 0, y: 0, z: -dist });

    } else if (cameraStateIndex === 1) {
      body.current.setLinvel({ x: -dist, y: 0, z: 0 });

    } else if (cameraStateIndex === 2) {
      body.current.setLinvel({ x: 0, y: 0, z: dist });

    } else if (cameraStateIndex === 3) {
      body.current.setLinvel({ x: dist, y: 0, z: 0 });
    }



    // console.log('Ball Pos', player.current.position)
    // console.log('Ball Pos', player.current.translation)
    // console.log('Rigid Body Position (Vector3):', positionVec3);

    // if (body.current) {
    //   // Access methods or properties on body.current here
    //   const playerPositionWorld = body.current.translation();
    //   console.log("Player Position (World):", playerPositionWorld);
    // } else {
    //   console.warn("body.current is not yet defined.");
    // }

    const playerPosition = new THREE.Vector3();
    if (body.current) {
        const playerPositionWorld = playerPosition.copy(body.current.translation());
        onPlayerPositionChange(playerPosition);
    }
  };

  const moveBack = () => {
    //console.log("going back!");
    const origin = body.current.translation();
  };

  const turnLeft = () => {
   // console.log("going left!");
  };

  const turnRight = () => {
   // console.log("going right!");
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if ((value === "ready") | "ended") reset();
      }
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    const unsubscribeBack = subscribeKeys(
      (state) => state.backward,
      (value) => {
        if (value) {
          setMovementState(MovementState.BACKWARD);
          moveBack();
        }
      }
    );


    const unsubscribeForward = subscribeKeys(
      (state) => state.forward,
      (value) => {
        if (value) {
          setMovementState(MovementState.FORWARD);
         // console.log("direction:", movementState);
        }
      }
    );

    const unsubscribeLeft = subscribeKeys(
      (state) => state.leftward,
      (value) => {
        if (value) {
          setMovementState(MovementState.MOVE_LEFT);
          setCameraStateIndex(
            (prevIndex) => (prevIndex + 1) % cameraStates.length
          );
          turnLeft();
        }
      }
    );

    const unsubscribeRight = subscribeKeys(
      (state) => state.rightward,
      (value) => {
        if (value) {
          setMovementState(MovementState.MOVE_RIGHT);
          setCameraStateIndex(
            (prevIndex) =>
              (prevIndex - 1 + cameraStates.length) % cameraStates.length
          );
          turnRight();
        }
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      }
    );
    return () => {
      unsubscribeJump();
      unsubscribeForward();
      unsubscribeBack();
      unsubscribeLeft();
      unsubscribeRight();
      unsubscribeAny();
      unsubscribeReset();
    };
  }, []);


  //set cam back
  const [smoothedCameraPosition] = useState(() => camPosition);
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    let bodyPosition = body.current.translation();
    let cameraPosition = new THREE.Vector3();
    const currentCameraState = cameraStates[cameraStateIndex];

    // Update camera position based on the current camera state
    cameraPosition.copy(bodyPosition);
    cameraPosition.x += currentCameraState.x;
    cameraPosition.y += currentCameraState.y;
    cameraPosition.z += currentCameraState.z;

    if (movementState === "idle") {
      //    console.log('idle')
    }

    if (movementState === "move_left") {
    }

    if (movementState === "move_right") {
    }

    if (forward) {
      move();
      //  console.log('forward',cameraStateIndex)
    }

    if (backward) {
      //  console.log('backward',cameraStateIndex)
    }

    if (leftward) {
      //  console.log('left',cameraStateIndex)
    }

    if (rightward) {
      //    console.log('right',cameraStateIndex)
    }

    if (bodyPosition.y < -4) {
      //  console.log('AAAAHHHH!!!')
      playFall();
      restart();
    }

    let cameraTarget = new THREE.Vector3();
    cameraTarget = bodyPosition;
    cameraTarget.y += 0.25;
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // body.current.applyTorqueImpulse(torque)
  });

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 0]}
      canSleep={false}
      colliders="ball"
      enabledRotations={[true, true, true]}
      mass={100}
      restitution={0.1}
      friction={10}
      linearDamping={10.5}
      angularDamping={0.5}
      onCollisionEnter={({ manifold, target, other }) => {
        // console.log(
        //   "Collision at world position ",
        //   manifold.solverContactPoint(0)
        // );

        if (other.rigidBodyObject) {
          //   console.log(
          //     // this rigid body's Object3D
          //     " collided with ",
          //     // the other rigid body's Object3D
          //     other.rigidBodyObject.name
          //   );
        }
      }}
      onCollisionExit={(payload) => {
        /* ... */
        console.log("exit");
      }}
    >
      {/* <primitive
        castShadow
        ref={player}
        object={ball.scene.clone()}
        scale={[0.26, 0.26, 0.26]}
      /> */}

      <mesh castShadow ref={player} scale={player.scale}>
                    <icosahedronGeometry args={[0.3, 1]} />
                    <meshStandardMaterial flatShading color="mediumpurple" />
                </mesh>
             
    </RigidBody>
  );
}
