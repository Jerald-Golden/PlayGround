import LoadingBar from "./loadingBar";

import { useEffect, useState } from "react";

import Clock_Tower from "../../resources/Gltf/Map/Clock_Tower.glb";
import Cs_Go from "../../resources/Gltf/Map/Cs_Go_Light.glb";
import Level1Map from "../../resources/Gltf/Map/LevelMap1.glb";
import Level2Map from "../../resources/Gltf/Map/LevelMap2.glb";

import Y from "../../resources/Gltf/Character/Y.glb";
import Yidle from "../../resources/Gltf/Character/Yidle.glb";
import Ywalk from "../../resources/Gltf/Character/Ywalk.glb";
import Yrun from "../../resources/Gltf/Character/Yrun.glb";
import Yjump from "../../resources/Gltf/Character/Yjump.glb";
import Yjumpstart from "../../resources/Gltf/Character/Yjumpstart.glb";
import Yjumpend from "../../resources/Gltf/Character/Yjumpend.glb";
import YStandingToCrouched from "../../resources/Gltf/Character/YStandingToCrouched.glb";
import YCrouchedToStanding from "../../resources/Gltf/Character/YCrouchedToStanding.glb";
import YCrouchingIdle from "../../resources/Gltf/Character/YCrouchingIdle.glb";
import YCrouchedWalk from "../../resources/Gltf/Character/YCrouchedWalk.glb";
import { useGLTF } from "@react-three/drei";

function Preloader({ onLoaded }) {
    const [progress, setProgress] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const assets = [
            Clock_Tower,
            Cs_Go,
            Level1Map,
            Level2Map,
            Y,
            Yidle,
            Ywalk,
            Yrun,
            Yjump,
            Yjumpstart,
            Yjumpend,
            YStandingToCrouched,
            YCrouchedToStanding,
            YCrouchingIdle,
            YCrouchedWalk,
        ];
        let loaded = 0;

        const totalSteps = assets.length + 20;

        Promise.all(
            assets.map((url) => {
                useGLTF.preload(url);
                loaded += 1;
                setProgress(Math.round((loaded / totalSteps) * 100));
                return Promise.resolve({});
            })
        ).then(() => {
            let delayProgress = loaded;
            const interval = setInterval(() => {
                delayProgress += 1;
                setProgress(Math.round((delayProgress / totalSteps) * 100));
                if (delayProgress >= totalSteps) {
                    clearInterval(interval);
                    setTimeout(async () => {
                        setTimeout(() => {
                            setFinished(true);
                        }, 1000);
                        setTimeout(() => {
                            onLoaded();
                        }, 2000);
                    }, 200);
                }
            }, 200);
        });
    }, [onLoaded]);

    return (
        <>
            <div className="loading-screen">
                {finished ? (
                    <div className="foggy-effect" />
                ) : (
                    <LoadingBar progress={progress} />
                )}
            </div>
        </>
    );
}

export default Preloader;