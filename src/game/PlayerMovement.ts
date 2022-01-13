import Character from "./Character";
import Component from "./Component";


export default class PlayerMovement implements Component {
    input: Phaser.Types.Input.Keyboard.CursorKeys;
    character: Character;
    prevMovement: string;


    debugName(): string {
        throw new Error("Method not implemented.");
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
            this.onMovement('front-run', 0, 100 * timeSinceLastFrame);
            this.prevMovement = 'front';
        } else if (this.input.up.isDown) {
            this.onMovement('back-run', 0, -100 * timeSinceLastFrame);
            this.prevMovement = 'back';
        } else if (this.input.left.isDown)
            this.onMovement('left-run', -100 * timeSinceLastFrame, 0);
        else if (this.input.right.isDown)
            this.onMovement('right-run', 100 * timeSinceLastFrame, 0);
        else
            this.onMovement(this.prevMovement, 0, 0);
    }

    private onMovement(frameName: string, velX: number, velY: number) {


        this.character.sprite.anims.play(frameName, true);
        this.character.sprite.setVelocity(velX, velY);
    }
}