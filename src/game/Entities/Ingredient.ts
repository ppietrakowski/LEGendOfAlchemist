import Effect from "../Components/Effect";
import Character from "./Character";
import Item from "./Item";


export default class Ingredient extends Item {

    constructor(effect: Effect, sprite: Phaser.GameObjects.Sprite) {
        super(effect, sprite);
        this.sprite.setInteractive({ pixelPerfect: true });
    }

    onUse(character: Character): void {
        character.attributes.addEffect(this.effect);
        this.sprite.destroy();
    }
}
