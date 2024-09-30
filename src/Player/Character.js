import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useStore } from "../store";

import Y from "../resources/Gltf/Y.glb";
import Yidle from "../resources/Gltf/Yidle.glb";
import Ywalk from "../resources/Gltf/Ywalk.glb";
import Yrun from "../resources/Gltf/Yrun.glb";
import Yjump from "../resources/Gltf/Yjump.glb";

export default function Character() {
    const ref = useRef();
    const { nodes, materials } = useGLTF(Y)
    const idleAnimation = useGLTF(Yidle).animations
    const walkAnimation = useGLTF(Ywalk).animations
    const runAnimation = useGLTF(Yrun).animations
    const jumpAnimation = useGLTF(Yjump).animations

    const { actions, mixer } = useStore((state) => state)

    useEffect(() => {
        actions['idle'] = mixer.clipAction(idleAnimation[0], ref.current)
        actions['walk'] = mixer.clipAction(walkAnimation[0], ref.current)
        actions['run'] = mixer.clipAction(runAnimation[0], ref.current)
        actions['jump'] = mixer.clipAction(jumpAnimation[0], ref.current)

        actions['idle'].play()
    }, [actions, mixer, idleAnimation, walkAnimation, jumpAnimation, runAnimation])

    return (
        <group ref={ref} dispose={null} castShadow receiveShadow>
            <group name="Scene">
                <group name="Armature" rotation={[0, 0, 0]} scale={0.007}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        castShadow
                        name="Mesh"
                        frustumCulled={false}
                        geometry={nodes.Alpha_Joints.geometry}
                        material={materials.Alpha_Joints_MAT}
                        skeleton={nodes.Alpha_Joints.skeleton}
                    />
                    <skinnedMesh
                        castShadow
                        name="Mesh"
                        frustumCulled={false}
                        geometry={nodes.Alpha_Surface.geometry}
                        material={materials.Alpha_Body_MAT}
                        skeleton={nodes.Alpha_Surface.skeleton}
                    />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload([Y, Yidle, Ywalk, Yrun, Yjump])