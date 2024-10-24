export default function Light() {
    return (
        <>
            <directionalLight position={[5, 5, 5]} intensity={0.5} shadow-mapSize={8192} castShadow />
            <ambientLight intensity={1.5} />
        </>
    )
}