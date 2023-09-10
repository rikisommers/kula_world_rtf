import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Environment } from '@react-three/drei'
import Experience from './Experience.jsx'
import Interface from './Interface.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))


root.render(
    <KeyboardControls 
    map={ [
        { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
        { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
        { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
        { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
        { name: 'jump', keys: [ 'Space' ] },
    ] }
    >
    <Canvas
        shadows
        camera={ {
            fov: 70,
            near: 1,
            far: 200,
            position: [ 1,1,1],
        } }
    >
     <Environment
        preset='dawn'
        background
        blur={0}
      />        
      <Experience />

    </Canvas>
    <Interface />

    </KeyboardControls>
)