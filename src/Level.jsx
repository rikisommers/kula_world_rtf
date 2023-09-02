import * as THREE from "three";
import { useMemo, useState, useRef, useEffect } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { addEffect } from '@react-three/fiber'
import useGame from "./stores/useGame";
import BlockStart from "./BlockStart";
import BlockSpinner from "./BlockSpinner";
import BlockLimbo from "./BlockLimbo";
import BlockAxe from "./BlockLimb";
import Block from "./Block";
import BlockEnd from "./BlockEnd";
import Player from "./Player";
import { fragmentShader } from "./shaders/fragmentShader";
import { vertexShader } from "./shaders/vertexShader";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });




export default function Level({
  count,
  seed = 0,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  const positions = [
    /// Level 1

    [0, -1, 0, "start"],
    [0, -1, -1, "cube"],
    [0, -1, -2, "cube"],
    [0, -1, -3, "cube"],
    [0, -1, -4, "coin"],

    [-1, -1, -4, "cube"],
    [-2, -1, -4, "cube"],
    [-3, -1, -4, "cube"],
    [-4, -1, -4, "coin"],

    [-4, -1, -3, "cube"],
    [-4, -1, -2, "cube"],
    [-4, -1, -1, "cube"],
    [-4, -1, 0, "enemy"],

    [-4, -1, 0, "cube"],
    [-3, -1, 0, "cube"],
    [-2, -1, 0, "coin"],
    [-1, -1, 0, "cube"],

    [-0, -1, -5, "cube"],

    [-0, -1, -6, "cube"],
    [-1, -1, -6, "cube"],
    [-2, -1, -6, "cube"],
    [-3, -1, -6, "cube"],
    [-4, -1, -6, "cube"],

    /// Level 2

    // [-0, -3, -6, "cube"],
    // [-1, -3, -6, "cube"],
    // [-2, -3, -6, "cube"],
    // [-3, -3, -6, "cube"],
    // [-4, -3, -6, "cube"],
  ];

 // Function to check if a cube has 1 or fewer direct neighbors
function hasFewNeighbors(cubePosition) {
    const [x, y, z] = cubePosition;
    let neighborCount = 0;
  
    // Check neighbors along the X-axis
    neighborCount += positions.filter(([nx, ny, nz]) => (
      (nx === x + 1 || nx === x - 1) && ny === y && nz === z
    )).length;
  
    // Check neighbors along the Y-axis
    neighborCount += positions.filter(([nx, ny, nz]) => (
      nx === x && (ny === y + 1 || ny === y - 1) && nz === z
    )).length;
  
    // Check neighbors along the Z-axis
    neighborCount += positions.filter(([nx, ny, nz]) => (
      nx === x && ny === y && (nz === z + 1 || nz === z - 1)
    )).length;
  
    // Return true if there are 1 or fewer neighbors
    return neighborCount <= 1;
  }

  
  // Find cubes that have 1 or fewer direct neighbors
  const cubesWithFewNeighbors = positions.filter((cubePosition) => {
    return hasFewNeighbors(cubePosition);
  });
  
  // Print the cubes that have 1 or fewer direct neighbors
  console.log("Cubes with 1 or fewer direct neighbors:", cubesWithFewNeighbors);
  

  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3());
  const [playerDirection, setPlayerDirection] = useState('world forward');

  useEffect(() => {
    const roundedPosition = new THREE.Vector3(
      playerPosition.x.toFixed(2),
      playerPosition.y.toFixed(2),
      playerPosition.z.toFixed(2)
    );

    console.log('level player position', roundedPosition);
//    console.log('level player dorection', playerDirection);
    detectGravityChange(playerPosition)

  }, [playerPosition]);



  useEffect(() => {
    console.log('level player direction', playerDirection);
  }, [playerDirection]);


  const detectGravityChange = (playerPosition) => {


    console.log('EX',cubesWithFewNeighbors[0].slice(0, 1)[0])
    console.log('EZ',cubesWithFewNeighbors[0].slice(2, 3)[0])
    console.log('PX',parseInt(playerPosition.x)-1)
    console.log('PZ',parseInt(playerPosition.z)-1)

    const ex = cubesWithFewNeighbors[0].slice(0, 1)[0]
    const ez = cubesWithFewNeighbors[0].slice(2, 3)[0]

    const px = parseInt(playerPosition.x)-1
    const pz = parseInt(playerPosition.z)-1

    if(px <= ex && pz <= ez){
      console.log('TTTTTTTTTTTTTTTTT')
    }else{
      return
    }
  }



  // function areArraysMatchingWithinThreshold(arr1, arr2, threshold) {
  //   // Check if arrays have the same length
  //   if (arr1.length !== arr2.length) {
  //     return false;
  //   }
  
  //   // Iterate through the arrays and compare vectors
  //   for (let i = 0; i < arr1.length; i++) {
  //     const vector1 = arr1[i];
  //     const vector2 = arr2[i];
  
  //     // Compare values along all axes
  //     if (
  //       Math.abs(vector1.x - vector2.x) > threshold ||
  //       Math.abs(vector1.y - vector2.y) > threshold ||
  //       Math.abs(vector1.z - vector2.z) > threshold
  //     ) {
  //       return false; // Values differ by more than the threshold
  //     }
  //   }
  
  //   // All vectors passed the comparison
  //   return true;
  // }
  
  // // Example usage:
  // const threshold = 1.0; // Define your threshold value
  // const vectorArray1 = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(4, 5, 6)];
  // const vectorArray2 = [new THREE.Vector3(1.1, 2.1, 2.9), new THREE.Vector3(4.2, 5.3, 6.1)];
  
  //const result = areArraysMatchingWithinThreshold(playerPosition, cubesWithFewNeighbors, threshold);
  


  // let myTime = 0

  // useEffect(() =>
  // {
  //     const unsubscribeEffect = addEffect(() =>
  //     {
  //         const state = useGame.getState()
  //         let elapsedTime = 0
  //         if(state.phase === 'playing')
  //         elapsedTime = Date.now() - state.startTime
  //         else if(state.phase === 'ended')
  //         elapsedTime = state.endTime - state.startTime
  //         elapsedTime /= 1000
  //         elapsedTime = elapsedTime.toFixed(2)

  //         myTime = elapsedTime * 5
  //         //console.log(elapsedTime)
  //     })
  //     return () =>
  //     {
  //         unsubscribeEffect()
  //     }

  // }, [])



  return (
    <>
      <Player 
      onPlayerPositionChange={setPlayerPosition} 
      onPlayerDirectionChange={setPlayerDirection}
      />

      {/* { blocks.map((Block, index) => 
            <Block 
            geometry={boxGeometry} 
            material={floor2Material} 
            key={ index } 
            position={ [ 0, 0, - (index + 1) * 4 ] }
            />
        ) } */}

      {/* <BlockStone 
        position={positions}
        /> */}
        

      {positions.map((position, index) => (
        <Block
          key={index}
          position={position.slice(0, 3)}
          blockType={position[3]}
        />
      ))}

      {/* <RigidBody 
             type="fixed"

             colliders="cuboid"
             restitution={ 0.01 }
             friction={ 10 }
             position={ [ 0, -5, 0 ] }
             >
                <mesh receiveShadow>
                <boxGeometry args={ [ 24, 0.2, 24 ] } /> 
                <meshStandardMaterial color="#333333" />
                </mesh>
            </RigidBody> */}
    
      {/* <meshBasicMaterial side={THREE.DoubleSide} transparent color="#333333" /> */}
      
      <mesh position={[0, 0, 0]} scale={3}>
        <sphereGeometry args={[8, 32, 32]} />
        <shaderMaterial
         // uniforms={{ time: { value: myTime } }}

          side={THREE.DoubleSide}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh> 
     

    </>
  );
}
