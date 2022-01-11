import Character from "./Character";
import Component from "./Component";

export default class PlayerMovement implements Component {
    input: Phaser.Types.Input.Keyboard.CursorKeys;
    character: Character;

    debugName(): string {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        return 'movement';
    }
    start(character: Character): void {
        this.character = character;
        this.input = character.sprite.scene.input.keyboard.createCursorKeys();
    }
    update(timeSinceLastFrame: number): void {
        
        if (this.input.down.isDown) {
            this.character.sprite.anims.play('front-run', true);
            this.character.sprite.setVelocityY(100);
        } else {
            this.character.sprite.anims.play('front');
            this.character.sprite.setVelocityY(0);
        }
        
        // Do movement !
    }


}