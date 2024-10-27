import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

import Level2Map from '../../resources/Gltf/Map/LevelMap2.glb';

export default function Level2() {
    const Gltf = useRef(null);
    const { scene } = useGLTF(Level2Map);

    return (
        scene && (
            <>
                <RigidBody position={[10, 0, 0]} type="fixed" ref={Gltf}>
                    <mesh castShadow receiveShadow scale={[0.6, 0.6, 0.6]}>
                        <MeshCollider type="trimesh">
                            <primitive object={scene} />
                        </MeshCollider>
                    </mesh>
                </RigidBody>
            </>
        )
    );
}

useGLTF.preload(Level2Map);