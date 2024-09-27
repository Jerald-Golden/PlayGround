import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useStore } from "../store";

import evecompressed from "../resources/eve$@walk_compressed.glb";
import idle from "../resources/idle.glb";
import walking from "../resources/walking.glb";
import running from "../resources/running.glb";
import jump from "../resources/jump.glb";

export default function Character() {
    const ref = useRef();
    const { nodes, materials } = useGLTF(evecompressed)
    const idleAnimation = useGLTF(idle).animations
    const walkAnimation = useGLTF(walking).animations
    const runAnimation = useGLTF(running).animations
    const jumpAnimation = useGLTF(jump).animations

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
                <group name="Armature" rotation={[0, 0, 0]} scale={0.01}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        castShadow
                        name="Mesh"
                        frustumCulled={false}
                        geometry={nodes.Mesh.geometry}
                        material={materials.SpacePirate_M}
                        skeleton={nodes.Mesh.skeleton}
                    />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload([evecompressed, idle, walking, jump])