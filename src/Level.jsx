import * as THREE from "three";
import { useMemo, useState, useRef, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";

import Block from "./Block";
import Player from "./Player";
import Background from "./Background";
import useGame from "./stores/useGame.jsx";
import { gravityDirectionDict } from "./stores/useGame.jsx";
export default function Level({
  count,
  seed = 0,
  types = [Block],
  onGravityDirectionChange,
  onLevelRotationChange,
}) {
  const level = useRef();

  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  const setGravityDirection = useGame((state) => state.setGravityDirection);
  const gameGravityDirection = useGame((state) => state.gravityDirection);
  const [gd, setGd] = useState(gameGravityDirection);

  const positions = [
    /// Level 1

    [0, -1, 0, "cube"], 
    [0, -1, -1, "cube"],
    [0, -1, -2, "cube"],
    [0, -1, -3, "cube"],

    [1, -1, -2, "cube"],
    [2, -1, -2, "cube"],
    [3, -1, -2, "cube"],
    [4, -1, -2, "cube"],
    
  

    [-1, -1, -2, "cube"],
    [-2, -1, -2, "cube"],
    [-3, -1, -2, "cube"],
    [-4, -1, -2, "cube"],


    [0, -1, -4, "cube"],
    [0, -2, -4, "cube"],
    [0, -3, -4, "cube"],
    [0, -4, -4, "cube"], 

    [0, -4, -4, "cube"],
    [0, -4, -3, "cube"],
    [0, -4, -2, "cube"],
    [0, -4, -1, "cube"], 

    [0, -4, -0, "cube"],
    [0, -3, -0, "cube"],
    [0, -2, -0, "cube"],
  ];



  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3());
  const [playerDirection, setPlayerDirection] = useState("forward");

  useEffect(() => {
    const roundedPosition = new THREE.Vector3(
      playerPosition.x.toFixed(2),
      playerPosition.y.toFixed(2),
      playerPosition.z.toFixed(2)
    );
    cgd(playerDirection, playerPosition);
  }, [playerPosition, gameGravityDirection]);


  // Function to find the matching direction
  function findMatchingDirection(target) {
    for (const direction in gravityDirectionDict) {
      if (
        JSON.stringify(gravityDirectionDict[direction]) ===
        JSON.stringify(target)
      ) {
        return direction;
      }
    }
    return null; // Return null if no match is found
  }

  const cgd = (direction, position) => {
    const ex = positions[0].slice(0, 1)[0];
    const ez = positions[0].slice(2, 3)[0];
    const ey = positions[0].slice(1, 2)[0];

    const px = parseInt(position.x);
    const pz = parseInt(position.z);
    const py = parseInt(position.y - 1);

    // console.log("x", px, ex);
    // console.log("z", pz, ez);
    // console.log("y", py, ey);
    //console.log("GDD", findMatchingDirection(gameGravityDirection));
    //  console.log("pd",direction);

    const threshold = 1.4;


    if (JSON.stringify(gd) === JSON.stringify(gravityDirectionDict.top)) {

      if (direction === "forward") {
        if (py <= -threshold) {
          setGravityDirection(gravityDirectionDict.front);
        }
      }

      if(direction === "left"){
        if (py <= -threshold) {
        setGravityDirection(gravityDirectionDict.left)
        }
      }

      if(direction === "right"){
        if (py <= -threshold) {
        setGravityDirection(gravityDirectionDict.right)
        }
      }

      if(direction === "back"){
        if (py <= -threshold) {
        setGravityDirection(gravityDirectionDict.back)
        }
      }
    }

    ///...
    
   
  };


  return (
    <>
      <Player
        onPlayerPositionChange={setPlayerPosition}
        onPlayerDirectionChange={setPlayerDirection}
      />

      <Background />
      <group ref={level}>
        {positions.map((position, index) => (
          <RigidBody
            type="fixed"
            colliders="cuboid"
            restitution={1}
            friction={1}
            position={[0, 0, 0]}
          >
            <Block
              key={index}
              position={position.slice(0, 3)}
              blockType={position[3]}
            />
          </RigidBody>
        ))}
      </group>
    </>
  );
}
