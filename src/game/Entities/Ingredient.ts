import Effect from "../Components/Effect";
import Character from "./Character";
import Item from "./Item";

export default class Ingredient extends Item {

    constructor(effect: Effect, sprite: Phaser.Physics.Arcade.Sprite) {
        super(effect, sprite);
        this.sprite.setInteractive({pixelPerfect: true});
    }

    onUse(character: Character): void {

        this.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
           this.sprite.destroy();
           character.attributes.addEffect(this.effect);
        });
    }

}
