import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Types,Scale } from 'phaser';
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig



const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 720,
    height: 1280,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },

    scale:{
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
        zoom: 1
    },
    scene: [
        MainGame
    ]
};

const StartGame = (parent) => {
    

    return new Game({ ...config, parent });
}

export default StartGame;

