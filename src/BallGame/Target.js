import { RigidBody } from '@react-three/rapier';
import { useRef } from 'react';

const TorusShaderMaterial = {
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;

    void main() {
      float angle = vUv.x * 30.0;
      vec3 color = mod(floor(angle), 2.0) == 0.0 ? vec3(1.0, 0.0, 0.0) : vec3(1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export default function Target({ position }) {
    const torusRef = useRef();

    return (
        <RigidBody type="fixed" position={position}>
            <group>
                <mesh ref={torusRef}>
                    <torusGeometry args={[0.4, 0.03, 16, 100]} />
                    <shaderMaterial
                        attach="material"
                        vertexShader={TorusShaderMaterial.vertexShader}
                        fragmentShader={TorusShaderMaterial.fragmentShader}
                    />
                </mesh>

                <mesh>
                    <planeGeometry args={[0.7, 0.7, 8, 8]} />
                    <meshBasicMaterial color="blue" wireframe />
                </mesh>
            </group>
        </RigidBody>
    );
}
