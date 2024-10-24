import * as THREE from 'three'
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';
import { RigidBody } from '@react-three/rapier';

const box = new THREE.BoxGeometry()
const cyl = new THREE.CylinderGeometry(1, 1, 2, 20)
const tri = new THREE.CylinderGeometry(1, 1, 2, 3)

export default function House(props) {
    return (
        <RigidBody type='fixed' colliders={"trimesh"}>
            <mesh receiveShadow castShadow {...props} position={[0, 1.5, 0]} rotation={[0, Math.PI, 0]}>
                <Geometry computeVertexNormals>
                    <Base name="base" geometry={box} scale={[3, 3, 3]} />
                    <Subtraction name="cavity" geometry={box} scale={[2.7, 2.7, 2.7]} />
                    <Addition name="roof" geometry={tri} scale={[2.5, 1.5, 1.425]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.2, 0]} />
                    <Chimney scale={0.5} position={[-0.75, 3, 0.8]} />
                    <Window position={[1.1, 2.5, 0]} scale={0.6} rotation={[0, Math.PI / 2, 0]} />
                    <Window position={[0, 2.5, 1.5]} scale={0.6} rotation={[0, 0, 0]} />
                    <Window position={[0, 0.25, 1.5]} scale={1.25} />
                    <Window rotation={[0, Math.PI / 2, 0]} position={[1.425, 0.25, 0]} scale={1.25} />
                    <Door rotation={[0, Math.PI / 2, 0]} position={[-1.425, -0.45, 0]} scale={[1, 0.9, 1]} />
                </Geometry>
                <meshStandardMaterial envMapIntensity={0.25} />
            </mesh>
        </RigidBody>
    )
}

const Door = (props) => {
    return (
        <Subtraction {...props}>
            <Geometry>
                <Base geometry={box} scale={[1, 2, 1]} />
                <Addition geometry={cyl} scale={0.5} rotation={[Math.PI / 2, 0, 0]} position={[0, 1, 0]} />
            </Geometry>
        </Subtraction>
    )
}

const Window = (props) => {
    return (
        <Subtraction {...props}>
            <Geometry>
                <Base geometry={box} />
                <Subtraction geometry={box} scale={[0.05, 1, 1]} />
                <Subtraction geometry={box} scale={[1, 0.05, 1]} />
            </Geometry>
        </Subtraction>
    )
}

const Chimney = (props) => {
    return (
        <Addition name="chimney" {...props}>
            <Geometry>
                <Base name="base" geometry={box} scale={[1, 2, 1]} />
                <Subtraction name="hole" geometry={box} scale={[0.7, 2, 0.7]} position={[0, 0.5, 0]} />
            </Geometry>
        </Addition>
    )
}