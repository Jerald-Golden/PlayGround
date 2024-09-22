import * as THREE from 'three';
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useState, useEffect } from "react";
import Ring from './Ring';

export function ThrowBall() {
    const { camera } = useThree();
    const [balls, setBalls] = useState([]);
    const ringPosition = new THREE.Vector3(10, 0.1, 10);
    const ringRadius = 2;

    useEffect(() => {
        const handleThrowBall = () => {
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
                }, 10000);
            }
        };

        document.addEventListener('click', handleThrowBall);

        return () => {
            document.removeEventListener('click', handleThrowBall);
        };
    }, [camera]);

    return (
        <>
            {balls.map((ball) => (
                <RigidBody key={ball.id} colliders="ball" position={ball.position} linearVelocity={ball.velocity}>
                    <mesh>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>
            ))}
            <Ring position={[10, 0.1, 10]} />
        </>
    );
}
