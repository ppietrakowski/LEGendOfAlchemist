import Character from "./Character";
import Component from "./Component";

export default class PlayerMovement implements Component {
    input: Phaser.Types.Input.Keyboard.CursorKeys;
    character: Character;

    debugName(): string {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        throw new Error("Method not implemented.");
    }
    start(character: Character): void {
        this.character = character;
        this.input = character.sprite.scene.input.keyboard.createCursorKeys();
    }
    update(timeSinceLastFrame: number): void {
        
        
        // Do movement !
    }


}