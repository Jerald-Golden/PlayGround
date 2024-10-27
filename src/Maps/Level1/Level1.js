import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

import Level1Map from '../../resources/Gltf/Map/LevelMap1.glb';

export default function Level1() {
    const Gltf = useRef(null);
    const { scene } = useGLTF(Level1Map);

    return (
        scene && (
            <>
                <RigidBody position={[10, 2, 0]} type="fixed" ref={Gltf}>
                    <mesh castShadow receiveShadow scale={[0.02, 0.02, 0.02]}>
                        <MeshCollider type="trimesh">
                            <primitive object={scene} />
                        </MeshCollider>
                    </mesh>
                </RigidBody>
            </>
        )
    );
}

useGLTF.preload(Level1Map);