import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

// import Cs_Go from '../../resources/Gltf/Map/Cs_Go.glb';
import Cs_Go from '../../resources/Gltf/Map/Cs_Go_Light.glb';

export default function CsGo() {
    const Gltf = useRef(null);
    const { scene } = useGLTF(Cs_Go);

    return (
        scene && (
            <>
                {/* <RigidBody scale={[0.015, 0.015, 0.015]} position={[27, 0, 0]} type="fixed" ref={Gltf}> */}
                <RigidBody scale={[1, 1, 1]} position={[20, 0, 0]} type="fixed" ref={Gltf}>
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

useGLTF.preload(Cs_Go);