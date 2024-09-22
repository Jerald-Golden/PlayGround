import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const GlowingPortalMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.8, 0.0, 1.0),
    uOpacity: 0.5,
    uRadius: 1.5
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uRadius;
    
    varying vec2 vUv;

    void main() {
      float distanceToCenter = distance(vUv, vec2(0.5, 0.5));
      float glow = smoothstep(uRadius, uRadius - 0.5, distanceToCenter);

      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
      
      vec3 glowColor = uColor * glow * pulse;
      gl_FragColor = vec4(glowColor, uOpacity * (1.0 - glow));
    }
  `
);

extend({ GlowingPortalMaterial });

export default function Ring(props) {
  const portalRef = useRef();
  const { clock } = useThree();

  useFrame(() => {
    if (portalRef.current) {
      portalRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={portalRef} position={props.position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2, 64]} />
      <glowingPortalMaterial uColor={new THREE.Color(1.0, 0.0, 4.0)} uOpacity={0.8} uRadius={0.5} />
    </mesh>
  );
}
