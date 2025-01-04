import { Scene } from "phaser";

export class StartScene extends Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "background.png");
    }

    create() {
        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2, "background");

        this.add
            .text(width / 2, height / 3, "MOTO RIDER", {
                fontSize: "64px",
                color: "#ffffff",
            })
            .setOrigin(0.5);
    }
}

