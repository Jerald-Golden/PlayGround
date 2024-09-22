import * as THREE from 'three';
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useState, useEffect } from "react";

export function ThrowBall() {
    const { camera, scene } = useThree();
    const [balls, setBalls] = useState([]);

    useEffect(() => {
        const handleThrowBall = () => {
            const position = camera.position.clone();
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);

            const velocity = direction.multiplyScalar(50);

            const newBall = {
                id: Date.now(),
                position: [position.x, position.y, position.z],
                velocity: [velocity.x, velocity.y, velocity.z],
            };

            setBalls((prevBalls) => [...prevBalls, newBall]);

            setTimeout(() => {
                setBalls((prevBalls) => prevBalls.filter(ball => ball.id !== newBall.id));
            }, 10000);
        };

        document.addEventListener('click', handleThrowBall);

        return () => {
            document.removeEventListener('click', handleThrowBall);
        };
    }, [camera]);

    return (
        <>
            {balls.map((ball) => (
                <RigidBody
                    key={ball.id}
                    colliders="ball"
                    position={ball.position}
                    linearVelocity={ball.velocity}
                >
                    <mesh>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>
            ))}
        </>
    );
}
