import Effect from "../Components/Effect"
import Character from "./Character"
import Item from "./Item"


export default class Potion extends Item {
    constructor(effect: Effect, sprite: Phaser.GameObjects.Image) {
        super(effect, sprite)
        this.image.setInteractive({ pixelPerfect: true })
    }

    used(character: Character): void {
        character.attributes.addEffect(this.effect)
        this.image.destroy()
    }
}