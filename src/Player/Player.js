import * as THREE from "three";
import { Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useCompoundBody, useContactMaterial } from '@react-three/cannon';
import { useMemo, useRef } from "react";

import { Vec3 } from 'cannon-es';
import useFollowCam from "../Controls/CamControls";
import useKeyboard from "../Controls/KeyBoardControls";
import { useStore } from "../store";

import Character from "./Character";

export default function Player({ position }) {
    const playerGrounded = useRef(false)
    const inJumpAction = useRef(false)
    const group = useRef()
    const CamOffset = [0, 1, 5];
    const { yaw } = useFollowCam(group, CamOffset)
    const velocity = useMemo(() => new THREE.Vector3(), [])
    const inputVelocity = useMemo(() => new THREE.Vector3(), [])
    const euler = useMemo(() => new THREE.Euler(), [])
    const quat = useMemo(() => new THREE.Quaternion(), [])
    const targetQuaternion = useMemo(() => new THREE.Quaternion(), [])
    const worldPosition = useMemo(() => new THREE.Vector3(), [])
    const raycasterOffset = useMemo(() => new THREE.Vector3(), [])
    const contactNormal = useMemo(() => new Vec3(0, 0, 0), [])
    const down = useMemo(() => new Vec3(0, -1, 0), [])
    const rotationMatrix = useMemo(() => new THREE.Matrix4(), [])
    const prevActiveAction = useRef(0)
    const keyboard = useKeyboard()

    const { groundObjects, actions, mixer } = useStore((state) => state)

    useContactMaterial('ground', 'slippery', {
        friction: 0,
        restitution: 0.01,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3
    })

    const [ref, body] = useCompoundBody(
        () => ({
            mass: 1,
            shapes: [
                { args: [0.2, 0.2, 1.05], position: [0, 0.53, 0], type: 'Cylinder' },
                { args: [0.13], position: [0, 1.15, 0], type: 'Sphere' }
            ],
            onCollide: () => {
                if (inJumpAction.current) {
                    inJumpAction.current = false;
                    actions['jump'].fadeOut(1);
                    actions['idle'].reset().fadeIn(0.1).play();
                }
            },
            material: 'slippery',
            linearDamping: 0,
            position: position
        }),
        useRef()
    )

    useFrame(({ raycaster }, delta) => {
        delta = Math.min(delta, 0.05);

        let activeAction = 0;
        const movementSpeed = 45;
        const rotationSpeed = 10;

        body.angularFactor.set(0, 0, 0);
        ref.current.getWorldPosition(worldPosition);
        playerGrounded.current = false;
        raycasterOffset.copy(worldPosition);
        raycasterOffset.y += 0.01;
        raycaster.set(raycasterOffset, down);

        raycaster.intersectObjects(Object.values(groundObjects), false).forEach((i) => {
            if (i.distance < 0.021) {
                playerGrounded.current = true;
            }
        });

        if (!playerGrounded.current) {
            body.linearDamping.set(0);
        } else {
            body.linearDamping.set(0.9999999);
        }

        const distance = worldPosition.distanceTo(group.current.position);
        rotationMatrix.lookAt(worldPosition, group.current.position, group.current.up);
        targetQuaternion.setFromRotationMatrix(rotationMatrix);

        if (distance > 0.0001 && !group.current.quaternion.equals(targetQuaternion)) {
            targetQuaternion.z = 0;
            targetQuaternion.x = 0;
            targetQuaternion.normalize();
            group.current.quaternion.rotateTowards(targetQuaternion, delta * rotationSpeed);
        }

        if (document.pointerLockElement) {
            inputVelocity.set(0, 0, 0);
            if (playerGrounded.current) {
                inputVelocity.set(0, 0, 0);

                if (keyboard['KeyW']) { inputVelocity.z = -1; activeAction = 1; }
                if (keyboard['KeyS']) { inputVelocity.z = 1; activeAction = 1; }
                if (keyboard['KeyA']) { inputVelocity.x = -1; activeAction = 1; }
                if (keyboard['KeyD']) { inputVelocity.x = 1; activeAction = 1; }

                if (inputVelocity.length() > 0) {
                    inputVelocity.normalize().multiplyScalar(movementSpeed * delta);

                    if (keyboard['ShiftLeft']) {
                        inputVelocity.multiplyScalar(2);
                        activeAction = 3;
                    }
                }
            }

            if (activeAction !== prevActiveAction.current) {
                if (prevActiveAction.current !== 1 && activeAction === 1) {
                    actions['idle'].fadeOut(0.1);
                    actions['run'].fadeOut(0.1);
                    actions['walk'].reset().fadeIn(0.1).setEffectiveTimeScale(0.5).play();
                }
                if (prevActiveAction.current !== 0 && activeAction === 0) {
                    actions['walk'].fadeOut(0.1);
                    actions['run'].fadeOut(0.1);
                    actions['idle'].reset().fadeIn(0.1).play();
                }
                if (prevActiveAction.current !== 3 && activeAction === 3) {
                    actions['idle'].fadeOut(0.1);
                    actions['walk'].fadeOut(0.1);
                    actions['run'].reset().fadeIn(0.1).play();
                }
                prevActiveAction.current = activeAction;
            }

            if (keyboard['Space']) {
                if (playerGrounded.current && !inJumpAction.current) {
                    activeAction = 2;
                    inJumpAction.current = true;
                    actions['walk'].fadeOut(0.1);
                    actions['idle'].fadeOut(0.1);
                    actions['jump'].reset().setEffectiveTimeScale(0.5).play();
                    inputVelocity.y = 6;
                }
            }

            euler.y = yaw.rotation.y;
            quat.setFromEuler(euler);
            inputVelocity.applyQuaternion(quat);
            velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);
            body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0]);
        }

        if (activeAction === 1) {
            mixer.update(distance / 3);
        } else {
            mixer.update(delta);
        }

        group.current.position.lerp(worldPosition, 0.3);
    });


    return (
        <>
            <group ref={group} position={position}>
                <Suspense fallback={null}>
                    <Character />
                </Suspense>
            </group>
        </>
    )
}