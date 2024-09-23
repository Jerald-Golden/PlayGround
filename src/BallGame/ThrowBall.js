import * as THREE from 'three';
import { useState, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

import Ring from './Ring';
import Target from './Target';

export function ThrowBall() {
    const { camera } = useThree();
    // const { raycaster } = useThree();
    const [balls, setBalls] = useState([]);
    const [isOnRing, setIsOnRing] = useState(false);
    const [canThrow, setCanThrow] = useState(false);

    const isOnRingRef = useRef(isOnRing);

    useEffect(() => {
        isOnRingRef.current = isOnRing;
    }, [isOnRing]);

    const startButtonRef = useRef();
    const exitButtonRef = useRef();

    useEffect(() => {
        const ringPosition = new THREE.Vector3(10, 0.1, 10);
        const ringRadius = 2;

        const checkPlayerPosition = () => {
            const distanceToRing = camera.position.distanceTo(ringPosition);
            if (distanceToRing <= ringRadius) {
                setIsOnRing(true);
            } else {
                setIsOnRing(false);
            }
        };

        const handleThrowBall = () => {
            if (!canThrow) return;

            const cameraPosition = camera.position.clone();
            const distanceToRing = cameraPosition.distanceTo(ringPosition);

            if (distanceToRing <= ringRadius) {
                const position = camera.position.clone();
                const direction = new THREE.Vector3();
                camera.getWorldDirection(direction).normalize();
                const ballStartPosition = position.add(direction.clone().multiplyScalar(1));
                const velocity = direction.multiplyScalar(50);

                const newBall = {
                    id: Date.now(),
                    position: [ballStartPosition.x, ballStartPosition.y, ballStartPosition.z],
                    velocity: [velocity.x, velocity.y, velocity.z],
                };

                setBalls((prevBalls) => [...prevBalls, newBall]);

                setTimeout(() => {
                    setBalls((prevBalls) => prevBalls.filter(ball => ball.id !== newBall.id));
                }, 5000);
            }
        };

        const handlePointerDown = () => {
            if (!isOnRingRef.current) return;

            // const pointerPosition = new THREE.Vector2(0, 0);
            // raycaster.setFromCamera(pointerPosition, camera);
            // const intersects = raycaster.intersectObjects([startButtonRef.current, exitButtonRef.current]);
            // console.log('[startButtonRef.current, exitButtonRef.current]: ', [startButtonRef.current, exitButtonRef.current]);
            // console.log('intersects: ', intersects);
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('click', handleThrowBall);
        const interval = setInterval(checkPlayerPosition, 100);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('click', handleThrowBall);
            clearInterval(interval);
        };
    }, [camera, canThrow]);

    const handleStart = () => {
        setCanThrow(true);
    };

    const handleExit = () => {
        setCanThrow(false);
    };

    return (
        <>
            {balls.map((ball) => (
                <RigidBody key={ball.id} colliders="ball" position={ball.position} linearVelocity={ball.velocity}>
                    <mesh>
                        <sphereGeometry args={[0.18, 32, 32]} />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>
            ))}
            <Ring position={[10, 0.1, 10]} />
            <Target position={[10, 2, -5]} />
            <Target position={[10, 5, -10]} />
            <Target position={[10, 10, -15]} />

            {isOnRing && (
                <>
                    <mesh ref={startButtonRef}>
                        <Html position={[9.8, 1, 9]}>
                            <div className="button-container">
                                <button className="button-style" onClick={handleStart}>Start</button>
                            </div>
                        </Html>
                    </mesh>
                    <mesh ref={exitButtonRef}>
                        <Html position={[10.2, 1, 9]}>
                            <div className="button-container">
                                <button className="button-style" onClick={handleExit}>Exit</button>
                            </div>
                        </Html>
                    </mesh>
                </>
            )}
        </>
    );
}