import Phaser from 'phaser'
import Effect from '../Components/Effect'
import Character from './Character'


/* TODO replace composition with generalization ! */
export default abstract class Item {
    name: string

    constructor(public effect: Effect, public sprite: Phaser.GameObjects.Sprite) {
        this.effect = effect
        this.sprite = sprite
        sprite.setInteractive({ pixelPerfect: true })
    }

    abstract onUse(character: Character): void
}
