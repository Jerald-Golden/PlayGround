import * as THREE from "three";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useGame } from "ecctrl";
import { BallCollider } from "@react-three/rapier";

import Y from '../resources/Gltf/Y.glb';
import Yidle from "../resources/Gltf/Yidle.glb";
import Ywalk from "../resources/Gltf/Ywalk.glb";
import Yrun from "../resources/Gltf/Yrun.glb";
import Yjump from "../resources/Gltf/Yjump.glb";
import Yjumpstart from "../resources/Gltf/Yjumpstart.glb";
import Yjumpend from "../resources/Gltf/Yjumpend.glb";

export default function CharacterModel() {
    const { nodes, materials } = useGLTF(Y);
    const idleGLTF = useGLTF(Yidle);
    const walkGLTF = useGLTF(Ywalk);
    const runGLTF = useGLTF(Yrun);
    const jumpGLTF = useGLTF(Yjump);
    const jumpstartGLTF = useGLTF(Yjumpstart);
    const jumpendGLTF = useGLTF(Yjumpend);

    const animations = useMemo(() => {
        const clips = [
            idleGLTF.animations[0],
            walkGLTF.animations[0],
            runGLTF.animations[0],
            jumpstartGLTF.animations[0],
            jumpendGLTF.animations[0],
            jumpGLTF.animations[0],
        ];

        clips[0].name = "Idle";
        clips[1].name = "Walk";
        clips[2].name = "Run";
        clips[3].name = "Jump_Start";
        clips[4].name = "Jump_Land";
        clips[5].name = "Jump_Idle";

        return clips;
    }, [idleGLTF, walkGLTF, runGLTF, jumpstartGLTF, jumpendGLTF, jumpGLTF]);

    const group = useRef();

    const { actions } = useAnimations(animations, group);

    let curAnimation = useGame((state) => state.curAnimation);
    const resetAnimation = useGame((state) => state.reset);
    const initializeAnimationSet = useGame(
        (state) => state.initializeAnimationSet
    );

    const animationSet = useMemo(() => ({
        idle: "Idle",
        walk: "Walk",
        run: "Run",
        jump: "Jump_Start",
        jumpLand: "Jump_Land",
        jumpIdle: "Jump_Idle",
    }), []);

    useEffect(() => {
        initializeAnimationSet(animationSet);
    }, [animationSet, initializeAnimationSet]);

    useEffect(() => {
        const action = actions[curAnimation ? curAnimation : animationSet.idle];

        if (curAnimation === animationSet.jump || curAnimation === animationSet.jumpLand) {
            action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, undefined).play();
            action.clampWhenFinished = true;
        } else {
            action.reset().fadeIn(0.2).play();
            action.clampWhenFinished = true;
        }

        (action)._mixer.addEventListener("finished", () => resetAnimation());

        return () => {
            action.fadeOut(0.2);
            (action)._mixer.removeEventListener("finished", () =>
                resetAnimation()
            );
            (action)._mixer._listeners = [];
        };
    }, [curAnimation, actions, animationSet, resetAnimation]);

    return (
        <Suspense fallback={null}>
            <group ref={group} dispose={null} castShadow receiveShadow position={[0, -0.55, 0]}>
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
                <BallCollider args={[0.1]} position={[0, 1.17, 0]} />
            </group>
        </Suspense>
    );
}

useGLTF.preload([Y, Yidle, Ywalk, Yrun, Yjump])