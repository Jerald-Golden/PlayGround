import React from 'react';
import MiniGames from '../Maps/MiniGames/MiniGames';
import Level1 from '../Maps/Level1/Level1';
import Level2 from '../Maps/Level2/Level2';
import Clock_Tower from '../Maps/Clock Tower/ClockTower';

const Map = ({ mapType }) => {
    return (
        <>
            {mapType === "MiniGames" && <MiniGames />}
            {mapType === "Clock_Tower" && <Clock_Tower />}
            {mapType === "Level1" && <Level1 />}
            {mapType === "Level2" && <Level2 />}
        </>
    );
};

export default Map;
