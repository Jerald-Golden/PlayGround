import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

import Clock_Tower from '../../resources/Gltf/Map/Clock_Tower.glb';

export default function ClockTower() {
    const Gltf = useRef(null);
    const { scene } = useGLTF(Clock_Tower);

    return (    
        scene && (
            <>
                <RigidBody  scale={[40, 40, 40]} position={[10, -10, 0]} type="fixed" ref={Gltf}>
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

useGLTF.preload(Clock_Tower);