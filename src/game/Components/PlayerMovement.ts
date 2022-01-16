import Character from '../Entities/Character';

import Component from './Component';

export default class PlayerMovement implements Component {
    private input: Phaser.Types.Input.Keyboard.CursorKeys;
    private character: Character;
    private prevMovement: string;
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
        this.prevMovement = 'front';
        this.character = character;
        this.input = character.sprite.scene.input.keyboard.createCursorKeys();
    }

    update(timeSinceLastFrame: number): void {
        timeSinceLastFrame *= 50;

        if (this.input.down.isDown) {
            this.onMovement('front-run', 0, this.speed.y * timeSinceLastFrame);
            this.prevMovement = 'front';
        } else if (this.input.up.isDown) {
            this.onMovement('back-run', 0, -this.speed.y * timeSinceLastFrame);
            this.prevMovement = 'back';
        } else if (this.input.left.isDown) {
            this.onMovement('left-run', -this.speed.x * timeSinceLastFrame, 0);
            this.prevMovement = 'front';
        }
        else if (this.input.right.isDown) {
            this.onMovement('right-run', this.speed.x * timeSinceLastFrame, 0);
            this.prevMovement = 'front';
        }
        else
            this.onMovement(this.prevMovement, 0, 0);
    }

    private onMovement(frameName: string, velX: number, velY: number) {
        this.character.sprite.anims.play(frameName, true);
        this.character.sprite.setVelocity(velX, velY);
    }
}