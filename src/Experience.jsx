import { useRef,useEffect,useState,Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Physics} from '@react-three/rapier'
import BlockSpinner from './BlockSpinner.jsx'
import Lights from './Lights.jsx'
import Level from './Level.jsx'
import useGame from './stores/useGame.jsx'
export default function Experience()
{


    const bgMesh = useRef();

    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)

    const [gravityDirection, setGravityDirection] = useState([0.0, -25, 0.0]);
    const updateGravity = (newGravity) => {
    setGravityDirection(newGravity);
    };


    // useEffect(() => {
    //     // Example: Change gravity direction after a delay
    //     setTimeout(() => {
    //       updateGravity([0.0, 25, 0.0]); // Update gravity to a new direction
    //     }, 5000);
    //   }, [updateGravity]);

    return <>
        {/* <color args={ [ '#333333' ] } attach="background" /> */}

        <OrbitControls makeDefault />

        <Suspense>

        <Physics debug={ true } 
                 gravity={gravityDirection}
                 >
            <Lights />
            <Level 
            updateGravity={updateGravity} // Pass the updateGravity function as a prop
            count={ blocksCount }
            seed={ blocksSeed }
            />
        </Physics>
</Suspense>
    </>
}