import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo, useEffect, useState, useRef } from "react";

function useFollowCam(ref, offset) {
    const { scene, camera } = useThree();
    const pivot = useMemo(() => new THREE.Object3D(), []);
    const alt = useMemo(() => new THREE.Object3D(), []);
    const yaw = useMemo(() => new THREE.Object3D(), []);
    const pitch = useMemo(() => new THREE.Object3D(), []);
    const worldPosition = useMemo(() => new THREE.Vector3(), []);

    function onDocumentMouseMove(e) {
        if (document.pointerLockElement) {
            e.preventDefault();
            yaw.rotation.y -= e.movementX * 0.002;
            const v = pitch.rotation.x - e.movementY * 0.002;
            if (v > -1 && v < 0.1) {
                pitch.rotation.x = v;
            }
        }
    }

    function onDocumentMouseWheel(e) {
        if (document.pointerLockElement) {
            e.preventDefault();
            const v = camera.position.z + e.deltaY * 0.005;
            if (v >= 0.5 && v <= 5) {
                camera.position.z = v;
            }
        }
    }

    useEffect(() => {
        scene.add(pivot);
        pivot.add(alt);
        alt.position.y = offset[1];
        alt.add(yaw);
        yaw.add(pitch);
        pitch.add(camera);
        camera.position.set(offset[0], 0, offset[2]);

        document.addEventListener("mousemove", onDocumentMouseMove);
        document.addEventListener("wheel", onDocumentMouseWheel, { passive: false });
        return () => {
            document.removeEventListener("mousemove", onDocumentMouseMove);
            document.removeEventListener("wheel", onDocumentMouseWheel);
        };
    }, [camera, offset]);

    useFrame((_, delta) => {
        if (ref.current) {
            const pos = ref.current.translation();
            worldPosition.set(pos.x, pos.y, pos.z);
            pivot.position.lerp(worldPosition, delta * 5);
        }
    });
}

export function Player() {
    const { scene, camera } = useThree();
    const [, get] = useKeyboardControls();
    const mouse = useMemo(() => ({ x: 0, y: 0 }), []);
    const [cooldown, setCooldown] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const playerRef = useRef(null);
    const mesh = useRef();

    useFollowCam(playerRef, [0, 1.5, 4]);

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

        playerRef.current.setLinvel({ x: movement.x, y: playerRef.current.linvel().y, z: movement.z });

        direction.y = 0;
        direction.normalize();
        const angle = Math.atan2(direction.x, direction.z);
        mesh.current.rotation.y = angle;
    });

    return (
        <RigidBody ref={playerRef} colliders="cuboid" mass={0} position={[0, 0, 10]} restitution={0}>
            <mesh ref={mesh} userData={{ tag: "player" }} position={[0, 0.65, 0]}>
                <capsuleGeometry args={[0.25, 0.75]} />
                <meshBasicMaterial />
            </mesh>
        </RigidBody>
    );
}