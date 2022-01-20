import Character from '../Entities/Character';
import Player from '../Entities/Player';

import Component from './Component';

export default class PlayerMovement implements Component {
    private input: Phaser.Types.Input.Keyboard.CursorKeys;
    private character: Player;
    private onStayAnimation: string;
    private speed: Phaser.Math.Vector2;

    constructor(speed: Phaser.Math.Vector2) {
        this.speed = speed;
    }

    debugName(): string {
        return 'player-movement';
    }

    getName(): string {
        return 'movement';
    }

    start(character: Character): void {
        let keyboard = character.sprite.scene.input.keyboard;

        this.onStayAnimation = 'front';
        this.character = character as Player;
        this.input = keyboard.createCursorKeys();
    }

    update(timeSinceLastFrame: number): void {
        timeSinceLastFrame *= 50;

        if (this.input.down.isDown) {
            this.onMovement('front-run', 0, this.speed.y * timeSinceLastFrame);
            this.onStayAnimation = 'front';
        } else if (this.input.up.isDown) {
            this.onMovement('back-run', 0, -this.speed.y * timeSinceLastFrame);
            this.onStayAnimation = 'back';
        } else if (this.input.left.isDown) {
            this.onMovement('left-run', -this.speed.x * timeSinceLastFrame, 0);
            this.onStayAnimation = 'front';
        }
        else if (this.input.right.isDown) {
            this.onMovement('right-run', this.speed.x * timeSinceLastFrame, 0);
            this.onStayAnimation = 'front';
        }
        else
            this.onMovement(this.onStayAnimation, 0, 0);
    }

    private onMovement(frameName: string, velX: number, velY: number) {
        let sprite = this.character.sprite;
        sprite.anims.play(frameName, true);
        sprite.setVelocity(velX, velY);
    }
}