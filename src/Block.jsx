import * as THREE from 'three'

import BlockStart from './BlockStart';
import BlockEnd from './BlockEnd';
import BlockCoin from './BlockCoin';
import BlockEnemy from './BlockEnemy';
import BlockCube from './BlockCube';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })





export default function Block({
  position = [[0, 0, 0]], // An array of positions for each instance
  blockType,
}) {

  let primitive = null;
  
  if (blockType === 'start') { 
    primitive = <BlockStart 
    position={position}
    geometry={boxGeometry}
    material={floor2Material}
    />
  } else if (blockType === 'end') {
    primitive = <BlockEnd
    position={position}
    geometry={boxGeometry}
    material={wallMaterial}
    />
  } else if (blockType === 'cube') {
    primitive = <BlockCube position={position}/>
  }  else if (blockType === 'coin') {
    primitive = <BlockCoin 
    position={position}
    geometry={boxGeometry}
    material={floor1Material}
    />
  }  else if (blockType === 'enemy') {
    primitive = <BlockEnemy 
    position={position}
    geometry={boxGeometry}
    material={obstacleMaterial}
    />
  }
  

  return (

      <>
      {primitive}
        {/* <primitive
          object={cube.scene.clone()} // Clone the scene for each instance
          scale={ 0.50 } 
          position={position} 
        /> */}
        </>
  );
}
