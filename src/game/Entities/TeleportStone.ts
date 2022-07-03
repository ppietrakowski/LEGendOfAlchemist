import Effect from "../Components/Effect"
import Character from "./Character"
import Item from "./Item"


export default class TeleportStone extends Item {
    constructor(effect: Effect, sprite: Phaser.GameObjects.Image, public index: number) {
        super(effect, sprite)
    }

    used(_character: Character): void {
    }
}