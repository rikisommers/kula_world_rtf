import * as THREE from "three";
import {
  useRapier,
  RigidBody,
} from "@react-three/rapier"; // Correct import for Quat and Euler
import { useFrame } from "@react-three/fiber";
import {
  useKeyboardControls,
  useGLTF,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import useGame from "./stores/useGame.jsx";
import { playFall, playLand, playStart } from "./Audio.jsx";
import {
  gravityDirectionDict,
} from "./stores/useGame.jsx";

export default function Player({
  onPlayerPositionChange,
  onPlayerDirectionChange,
  onCameraDirectionChange,
}) {
  const ball = useGLTF("./ball1.glb");

  const MovementState = {
    IDLE: "idle",
    FORWARD: "forward",
    BACKWARD: "backward",
    MOVE_LEFT: "move_left",
    MOVE_RIGHT: "move_right",
  };

  const cameraDirectionsTop = [
    { x: 0, y: 1, z: 3 }, // Forward
    { x: 3, y: 1, z: 0 }, // Move Left
    { x: 0, y: 1, z: -3 }, // Backward
    { x: -3, y: 1, z: 0 }, // Move Right
  ];

  const cameraDirectionsFront = [
     { x: 0, y: 3, z: 0 }, // Forward
     { x: 0, y: 0, z: 3 }, // Move Left
     { x: 0, y: -3, z: 0 }, // Backward
     { x: 0, y: 1, z: -3 }, // Move Right
  ];
  const cameraDirectionsLeft = [
    { x: 0, y: 1, z: 3 }, // Forward
    { x: 3, y: 1, z: 0 }, // Move Left
    { x: 0, y: 1, z: -3 }, // Backward
    { x: -3, y: 1, z: 0 }, // Move Right
    // { x: 0, y: 3, z: 0 }, // Forward
    // { x: 0, y: 0, z: 3 }, // Move Left
    // { x: 0, y: -3, z: -3 }, // Backward
    // { x: 0, y: 0, z: 3 }, // Move Right
 ];
 const cameraDirectionsRight = [
  { x: 0, y: 3, z: 0 }, // Forward
  { x: 0, y: 0, z: 3 }, // Move Left
  { x: 0, y: -3, z: -3 }, // Backward
  { x: 0, y: 0, z: 3 }, // Move Right
];

  const dist = 5;
  const playerMovementTop = [
    { x: 0, y: 0, z: -dist },
    { x: -dist, y: 0, z: 0 },
    { x: 0, y: 0, z: dist },
    { x: dist, y: 0, z: 0 },
  ];

  const playerMovementBottom = [
    { x: 0, y: 0, z: dist },
    { x: dist, y: 0, z: 0 },
    { x: 0, y: 0, z: -dist },
    { x: -dist, y: 0, z: 0 },
  ];

  const playerMovementFront = [
    { x: 0, y: -dist, z: 0 },
    { x: -dist, y: 0, z: 0 },
    { x: 0, y: dist, z: 0 },
    { x: dist, y: 0, z: 0 },
  ];

  const playerMovementBack = [
    { x: 0, y: dist, z: 0 },
    { x: -dist, y: 0, z: 0 },
    { x: 0, y: -dist, z: 0 },
    { x: dist, y: 0, z: 0 },
  ];

  const playerMovementLeft = [
    { x: 0, y: 0, z: -dist },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: dist },
    { x: -dist, y: 0, z: 0 },
  ];

  const playerMovementRight = [
    { x: 0, y: 0, z: -dist },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: dist },
    { x: dist, y: 0, z: 0 },
  ];




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
  const [cameraStateIndex, setCameraStateIndex] = useState(0);
  const cameraDirection = useGame((state) => state.cameraDirection);
  const gravityDirection = useGame((state) => state.gravityDirection);
  const [gd, setGd] = useState(gravityDirection);



  // move to state
  useEffect(() => {
    if (cameraStateIndex === 0) {
      onPlayerDirectionChange("forward");
      console.log("forward");
    } else if (cameraStateIndex === 1) {
      onPlayerDirectionChange("left");
      console.log("left");
    } else if (cameraStateIndex === 2) {
      onPlayerDirectionChange("back");
      console.log("back");
    } else if (cameraStateIndex === 3) {
      onPlayerDirectionChange("right");
      console.log("right");
    }
    // console.log(cameraStateIndex)
    // console.log('CD',cameraDirection)
  }, [cameraStateIndex]);



   useEffect(() => {

      setGd(gravityDirection)
      
      if (JSON.stringify(gravityDirection) === JSON.stringify(gravityDirectionDict.top)) {
        console.log("C-Top");
        setCamPosition(cameraDirectionsTop[cameraStateIndex])
      } 

      if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.front)) {
      console.log("C-Front");
        setCamPosition(cameraDirectionsFront[cameraStateIndex])
      } 

      if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.left)) {
        console.log("C-Left");
        setCamPosition(cameraDirectionsLeft[cameraStateIndex])
      } 


      if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.right)) {
        console.log("C-Right");
        setCamPosition(cameraDirectionsRight[cameraStateIndex])
      } 

   }, [gravityDirection,cameraStateIndex]);


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

  const setPlayerMove = (velocity) => {
    body.current.setLinvel(velocity);
  };

  // const setCameraMove = (direction) => {
  //   state.camera.position.copy(camPosition);
  // };

  const move = () => {

    if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.top)) {
      console.log("M-Top",cameraStateIndex);
      setPlayerMove(playerMovementTop[cameraStateIndex]);

    } 
    
    if (JSON.stringify(gravityDirection) === JSON.stringify(gravityDirectionDict.bottom)) {
      console.log("M-Bottom");
      setPlayerMove(playerMovementBottom[cameraStateIndex]);

    }
    
    if (JSON.stringify(gravityDirection) === JSON.stringify(gravityDirectionDict.left)) {
      setPlayerMove(playerMovementLeft[cameraStateIndex]);

    }
    
     if (JSON.stringify(gravityDirection) === JSON.stringify(gravityDirectionDict.right)) {
      console.log("M-Right");
      setPlayerMove(playerMovementRight[cameraStateIndex]);

    } 
    
    if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.front)) {
      console.log("M-Front");
      setPlayerMove(playerMovementFront[cameraStateIndex]);

    } 
    
    if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.back)) {
      setPlayerMove(playerMovementBack[cameraStateIndex]);
    }
  };




  const reset = () => {
    // body.current.setTranslation({ x: 0, y: 1, z: 0 });
    // body.current.setLinvel({ x: 0, y: 0, z: 0 });
    // body.current.setAngvel({ x: 0, y: 0, z: 0 });
    console.log('reset')
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
   
          //setMovementState(MovementState.MOVE_LEFT);
          setCameraStateIndex((prevIndex) => (prevIndex + 1) % 4);
        }
      }
    );

    const unsubscribeRight = subscribeKeys(
      (state) => state.rightward,
      (value) => {
        if (value) {
         // setMovementState(MovementState.MOVE_RIGHT);
          setCameraStateIndex((prevIndex) => (prevIndex - 1 + 4) % 4);
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

    //console.log('GG',gravityDirection)
    const playerPosition = new THREE.Vector3();
    if (body.current) {
      const playerPositionWorld = playerPosition.copy(
        body.current.translation()
      );
      onPlayerPositionChange(playerPosition);
    }

    
    if (forward) {
      move()
    }

    // if (bodyPosition.y < -14) {
    //   playFall();
    //   restart();
    // }

    let bodyPosition = body.current.translation();
    let cameraPosition = new THREE.Vector3();
    // const currentCameraState = cameraDirectionsFront[cameraStateIndex];
    // Update camera position based on the current camera state

    cameraPosition.copy(bodyPosition);
    cameraPosition.x += camPosition.x;
    cameraPosition.y += camPosition.y;
    cameraPosition.z += camPosition.z;


    let cameraTarget = new THREE.Vector3();
    cameraTarget = bodyPosition;
    //cameraTarget.y += 0.25;
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

  });

  return (
    <RigidBody
      ref={body}
      position={[0, 0, 0]}
      canSleep={false}
      colliders="ball"
      enabledRotations={[true, true, true]}
      mass={100}
      restitution={0.1}
      friction={10}
      linearDamping={10.5}
      angularDamping={0.5}

    >
      <mesh castShadow ref={player} scale={player.scale}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
