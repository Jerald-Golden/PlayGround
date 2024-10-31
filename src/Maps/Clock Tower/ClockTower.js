import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

import ClockTower from '../../resources/Gltf/Map/Clock_Tower.glb';

export default function Clock_Tower() {
    const Gltf = useRef(null);
    const { scene } = useGLTF(ClockTower);

    return (    
        scene && (
            <>
                <RigidBody  scale={[30, 30, 30]} position={[10, -10, 0]} type="fixed" ref={Gltf}>
                    <mesh castShadow receiveShadow>
                        <MeshCollider type="trimesh">
                            <primitive object={scene} />
                        </MeshCollider>
                    </mesh>
                </RigidBody>
            </>
        )
    );
}

useGLTF.preload(ClockTower);