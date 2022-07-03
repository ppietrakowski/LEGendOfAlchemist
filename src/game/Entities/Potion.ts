import Effect from "../Components/Effect"
import GameObject from "./GameObject"
import Item from "./Item"


export default class Potion extends Item {
    constructor(effect: Effect, sprite: Phaser.GameObjects.Image) {
        super(effect, sprite)
        this.image.setInteractive({ pixelPerfect: true })
    }

    used(character: GameObject): void {
        character.attributes.addEffect(this.effect)
        this.image.destroy()
    }
}