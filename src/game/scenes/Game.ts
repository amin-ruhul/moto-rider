import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene
{
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private bike: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private groundSpeed: number = 0;
    private maxSpeed: number = 10;
    private rotationSpeed: number = 0.5;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        
        
        this.load.image('background', 'bg.png');
        this.load.image('ground', 'ground.png');
        this.load.image("bike", "new-bike.png");
    }

    create ()
    {
        
       
        this.add.image(360, 640, 'background').setScale(1.5)
        
        this.platforms = this.physics.add.staticGroup();
        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 3; i++) {
            const platform = this.platforms.create(360 + i * 720, 1100, 'ground');
           
            platform.setDepth(1);
        }

        this.bike = this.physics.add.sprite(300, 750, "bike").setScale(0.4).refreshBody();
        this.bike.setBounce(0.2);
        this.bike.setCollideWorldBounds(true);

        this.physics.add.collider(this.bike, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        EventBus.emit('current-scene-ready', this);

    }

    update(){
        
        if (this.cursors.right.isDown) {
            this.groundSpeed += 0.05;
        } else {
            this.groundSpeed -= 0.05;
        }

        this.groundSpeed = Phaser.Math.Clamp(this.groundSpeed, 0, this.maxSpeed);

        this.platforms.children.entries.forEach((platform: Phaser.Physics.Arcade.Sprite) => {
            platform.x -= this.groundSpeed;
            if (platform.x <= -360) {
                platform.x += 2160; // 3 * 720
            }
        });

        if (this.groundSpeed > 0) {
            this.bike.angle += this.rotationSpeed;
        } else {
            this.bike.angle -= this.rotationSpeed;
        }

        this.bike.angle = Phaser.Math.Clamp(this.bike.angle, 0, 90);

        if (this.bike.angle >= 90) {
            this.gameOver();
        }
    }

    private gameOver() {
        // Add game over logic here
        console.log('Game Over');
       // this.scene.restart(); // Restart the scene for now
    }
}
