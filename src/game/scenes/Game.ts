import { Scene } from "phaser";
import { EventBus, GameEvents } from "../EventBus";

export class Game extends Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private bike: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private groundSpeed: number = 0;
    private maxSpeed: number = 10;
    private rotationSpeed: number = 0.5;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private isGameOver: boolean = false;

    constructor() {
        super("Game");
    }

    private setupBackground() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.add.image(gameWidth / 2, gameHeight / 2, "background");
    }

    private setupPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        // Create three ground platforms
        for (let i = 0; i < 3; i++) {
            const platform = this.platforms.create(
                360 + i * 720,
                1100,
                "ground"
            );
            platform.setDepth(1);
        }
    }

    private setupBike() {
        this.bike = this.physics.add
            .sprite(300, 1000, "bike")
            .setScale(0.5)
            .refreshBody();

        this.bike.setBounce(0.2);
        this.bike.setCollideWorldBounds(true);

        this.physics.add.collider(this.bike, this.platforms);
    }

    private setupUI() {
        const gameWidth = this.scale.width;

        this.scoreText = this.add.text(gameWidth / 2 - 120, 100, "Score: 0", {
            fontSize: "32px",
            color: "#fff",
            backgroundColor: "#000",
            padding: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5,
            },
        });
    }

    private updateBike() {
        this.platforms.children.iterate((platform: any) => {
            platform.x -= this.groundSpeed;
            if (platform.x <= -360) {
                platform.x += 2160;
            }
            return true;
        });

        // Bike rotation
        if (this.groundSpeed > this.maxSpeed) {
            this.bike.angle -= this.rotationSpeed;

            if (this.bike.angle <= -90) {
                this.gameOver();
            }
        } else {
            if (this.bike.angle < 0) {
                this.bike.angle += this.rotationSpeed * 0.5;
            }
        }
    }

    private gameOver() {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.groundSpeed = 0;

        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.add
            .text(gameWidth / 2, gameHeight / 2, "GAME OVER", {
                fontSize: "64px",
                color: "#ff0000",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Delay before restart
        this.time.delayedCall(2000, () => {
            EventBus.emit(GameEvents.GAME_OVER);
            this.scene.restart();
            this.isGameOver = false;
        });
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "background.png");
        this.load.image("ground", "ground.png");
        this.load.image("bike", "new-bike.png");
    }

    create() {
        this.setupBackground();

        this.setupPlatforms();

        this.setupBike();

        this.setupUI();

        this.cursors = this.input.keyboard.createCursorKeys();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (this.isGameOver) return;

        // Handle player input
        if (this.cursors.right.isDown) {
            this.groundSpeed += 0.05;
            this.score += 1;
            this.scoreText.setText("Score: " + this.score);
        } else if (this.groundSpeed > 0) {
            this.groundSpeed = Math.max(this.groundSpeed - 0.05, 0);
        }

        // Update bike and platforms whenever there's any speed
        if (this.groundSpeed > 0) {
            this.updateBike();
        }
    }
}

