import { useRef, useEffect, useState, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import BlockSpinner from "./BlockSpinner.jsx";
import Lights from "./Lights.jsx";
import Level from "./Level.jsx";
import useGame from "./stores/useGame.jsx";


export default function Experience() {
  const bgMesh = useRef();

  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);
  const gravityDirection = useGame((state) => state.gravityDirection);

  return (
    <>
      <OrbitControls makeDefault />
      <Suspense>
        <Physics debug={true} gravity={gravityDirection}>
        <group> 

          <Lights />
          <Level
            //onGravityDirectionChange={gravityDirection}
            count={blocksCount}
            seed={blocksSeed}
          />
          </group>
        </Physics>
      </Suspense>
    </>
  );
}
