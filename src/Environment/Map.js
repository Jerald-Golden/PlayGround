import React from 'react';
import MiniGames from '../Maps/MiniGames/MiniGames';
import Level1 from '../Maps/Level1/Level1';
import Level2 from '../Maps/Level2/Level2';
import ClockTower from '../Maps/Clock Tower/ClockTower';
import CsGo from '../Maps/CsGo/CsGo';

const Map = ({ mapType }) => {
    return (
        <>
            {mapType === "MiniGames" && <MiniGames />}
            {mapType === "Clock_Tower" && <ClockTower />}
            {mapType === "Cs_Go" && <CsGo />}
            {mapType === "Level1" && <Level1 />}
            {mapType === "Level2" && <Level2 />}
        </>
    );
};

export default Map;
