import * as THREE from "three";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useGame } from "ecctrl";
import { BallCollider } from "@react-three/rapier";

import Y from '../resources/Gltf/Character/Y.glb';
import Yidle from "../resources/Gltf/Character/Yidle.glb";
import Ywalk from "../resources/Gltf/Character/Ywalk.glb";
import Yrun from "../resources/Gltf/Character/Yrun.glb";
import Yjump from "../resources/Gltf/Character/Yjump.glb";
import Yjumpstart from "../resources/Gltf/Character/Yjumpstart.glb";
import Yjumpend from "../resources/Gltf/Character/Yjumpend.glb";
import YStandingToCrouched from "../resources/Gltf/Character/YStandingToCrouched.glb";
import YCrouchedToStanding from "../resources/Gltf/Character/YCrouchedToStanding.glb";
import YCrouchingIdle from "../resources/Gltf/Character/YCrouchingIdle.glb";
import YCrouchedWalk from "../resources/Gltf/Character/YCrouchedWalk.glb";

export default function CharacterModel() {
    const { nodes, materials } = useGLTF(Y);
    const iscrouched = useRef(false);
    const idleGLTF = useGLTF(Yidle);
    const walkGLTF = useGLTF(Ywalk);
    const runGLTF = useGLTF(Yrun);
    const jumpGLTF = useGLTF(Yjump);
    const jumpstartGLTF = useGLTF(Yjumpstart);
    const jumpendGLTF = useGLTF(Yjumpend);
    const StandingToCrouchedGLTF = useGLTF(YStandingToCrouched);
    const CrouchedToStandingGLTF = useGLTF(YCrouchedToStanding);
    const CrouchingIdleGLTF = useGLTF(YCrouchingIdle);
    const CrouchedWalkGLTF = useGLTF(YCrouchedWalk);

    const animations = useMemo(() => {
        const clips = [
            idleGLTF.animations[0],
            walkGLTF.animations[0],
            runGLTF.animations[0],
            jumpstartGLTF.animations[0],
            jumpendGLTF.animations[0],
            jumpGLTF.animations[0],
            StandingToCrouchedGLTF.animations[0],
            CrouchedToStandingGLTF.animations[0],
            CrouchingIdleGLTF.animations[0],
            CrouchedWalkGLTF.animations[0],
        ];

        clips[0].name = "Idle";
        clips[1].name = "Walk";
        clips[2].name = "Run";
        clips[3].name = "Jump_Start";
        clips[4].name = "Jump_Land";
        clips[5].name = "Jump_Idle";
        clips[6].name = "Standing_To_Crouched";
        clips[7].name = "Crouched_To_Standing";
        clips[8].name = "Crouching_Idle";
        clips[9].name = "Crouched_Walk";

        return clips;
    }, [idleGLTF, walkGLTF, runGLTF, jumpstartGLTF, jumpendGLTF, jumpGLTF, StandingToCrouchedGLTF, CrouchedToStandingGLTF, CrouchingIdleGLTF, CrouchedWalkGLTF]);

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
        action1: 'Standing_To_Crouched',
        action2: 'Crouched_To_Standing',
        action3: 'Crouching_Idle',
        action4: 'Crouched_Walk',
    }), []);

    useEffect(() => {
        initializeAnimationSet(animationSet);
    }, [animationSet, initializeAnimationSet]);

    useEffect(() => {
        let action = actions[curAnimation ? curAnimation : animationSet.idle];

        if ((curAnimation === animationSet.walk || curAnimation === animationSet.run) && iscrouched.current) {
            actions[animationSet.action3].fadeOut(0.2);
            action = actions[animationSet.action4];
            action.reset().fadeIn(0.2).play();
            action.clampWhenFinished = true;
        } else if (iscrouched.current && curAnimation === animationSet.idle) {
            actions[animationSet.action3].fadeOut(0.2);
            action = actions[animationSet.action3];
            action.reset().fadeIn(0.2).play();
            action.clampWhenFinished = true;
        } else if (curAnimation === animationSet.action2 && !iscrouched.current) {
            iscrouched.current = true;
            action = actions[animationSet.action1];
            action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce).play();
            action.clampWhenFinished = true;

            action._mixer.addEventListener("finished", () => {
                actions[animationSet.action3].reset().setLoop(THREE.LoopRepeat).play();
            });
        } else if (curAnimation === animationSet.action2 && iscrouched.current) {
            iscrouched.current = false;
            actions[animationSet.action3].fadeOut(0.2);
            action = actions[animationSet.action2];
            action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce).play();
            action.clampWhenFinished = true;

            action._mixer.addEventListener("finished", () => {
                actions[animationSet.idle].reset().fadeIn(0.2).play();
            });
        } else if (curAnimation === animationSet.jump || curAnimation === animationSet.jumpLand) {
            action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce).play();
            action.clampWhenFinished = true;
        } else if (!iscrouched.current) {
            action.reset().fadeIn(0.2).play();
            action.clampWhenFinished = true;
        }

        action._mixer.addEventListener("finished", () => resetAnimation());

        return () => {
            action.fadeOut(0.2);
            action._mixer.removeEventListener("finished", resetAnimation);
            action._mixer._listeners = [];
        };
    }, [curAnimation, actions, animationSet, resetAnimation]);


    return (
        <Suspense fallback={null}>
            <group ref={group} dispose={null} castShadow receiveShadow position={[0, -0.65, 0]}>
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