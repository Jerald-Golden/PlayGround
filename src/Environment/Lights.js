export default function Light() {
    return (
        <>
            <directionalLight position={[5, 5, 5]} intensity={0.5} shadow-mapSize={8192} castShadow />
            <ambientLight intensity={0.3} />
            <pointLight intensity={0.8} position={[100, 100, 100]} />
        </>
    )
}