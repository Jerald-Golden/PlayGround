import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo, useEffect, useState, useRef } from "react";
import IdleModel from "../resources/idle.glb";

import { CamControls } from "./CamControls";

export function Player() {
    const { camera } = useThree();
    const [, get] = useKeyboardControls();
    const mouse = useMemo(() => ({ x: 0, y: 0 }), []);
    const [cooldown, setCooldown] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const playerRef = useRef(null);
    const [isJumping, setIsJumping] = useState(false);
    const [jumpVelocity, setJumpVelocity] = useState(0);
    const model = useGLTF(IdleModel);
    const mesh = useRef();
    const mixer = useRef();
    const jumpSpeed = 4.5;
    const gravity = -9.8;

    CamControls(playerRef, [0, 1.5, 4]);

    useEffect(() => {
        if (model.animations.length > 0) {
            mixer.current = new THREE.AnimationMixer(model.scene);
            const action = mixer.current.clipAction(model.animations[0]);
            action.play();
        }
    }, [model]);

    useFrame((_, delta) => {
        if (mixer.current) mixer.current.update(delta);
    });

    useEffect(() => {
        const mouseMove = (e) => {
            if (document.pointerLockElement === document.body || document.mozPointerLockElement === document.body) {
                mouse.x += e.movementX;
                mouse.y += e.movementY;
            }
        };

        const capture = () => {
            if (!cooldown && !isLocked) {
                document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
                document.body.requestPointerLock();
            }
        };

        const handlePointerLockChange = () => {
            if (document.pointerLockElement === null) {
                setIsLocked(false);
                setCooldown(true);
                setTimeout(() => {
                    setCooldown(false);
                }, 1500);
            } else {
                setIsLocked(true);
            }
        };

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("click", capture);
        document.addEventListener("pointerlockchange", handlePointerLockChange);

        return () => {
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("click", capture);
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
        };
    }, [cooldown, isLocked]);

    useFrame(() => {
        if (!playerRef.current || !mesh.current) return;

        const { forward, backward, left, right, jump, shift } = get();
        const speed = shift ? 10 : 5;

        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        const movement = new THREE.Vector3();
        if (forward) movement.addScaledVector(direction, speed);
        if (backward) movement.addScaledVector(direction, -speed);
        if (left) {
            const rightDirection = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0));
            movement.addScaledVector(rightDirection, -speed);
        }
        if (right) {
            const rightDirection = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0));
            movement.addScaledVector(rightDirection, speed);
        }

        const currentVelocity = playerRef.current.linvel();
        playerRef.current.setLinvel({ x: movement.x, y: currentVelocity.y, z: movement.z });

        if (jump && !isJumping) {
            setIsJumping(true);
            setJumpVelocity(jumpSpeed);
        }

        if (isJumping) {
            const delta = jumpVelocity * 0.02;
            mesh.current.position.y += delta;
            setJumpVelocity((prev) => prev + gravity * 0.02);

            if (mesh.current.position.y <= 0.65) {
                mesh.current.position.y = 0.65;
                setIsJumping(false);
                setJumpVelocity(0);
            }
        }

        direction.y = 0;
        direction.normalize();
        const angle = Math.atan2(direction.x, direction.z);
        mesh.current.rotation.y = angle;
    });

    return (
        <RigidBody ref={playerRef} type="kinematicVelocity" colliders="hull" mass={1} position={[0, 0, 10]} restitution={0}>
            {/* <mesh ref={mesh} userData={{ tag: "player" }} position={[0, 0.65, 0]}>
                <capsuleGeometry args={[0.25, 0.75]} />
                <meshBasicMaterial />
            </mesh> */}
            <primitive ref={mesh} object={model.scene} scale={0.45} />
        </RigidBody>
    );
}
useGLTF.preload(IdleModel);