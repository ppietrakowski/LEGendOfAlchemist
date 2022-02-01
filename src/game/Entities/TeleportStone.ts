import Effect from "../Components/Effect";
import Character from "./Character";
import Item from "./Item";


export default class TeleportStone extends Item {

    index: number
    constructor(effect: Effect, sprite: Phaser.GameObjects.Sprite, index: number) {
        super(effect, sprite);
        this.index = index;
    }

    onUse(character: Character): void {
    }
}