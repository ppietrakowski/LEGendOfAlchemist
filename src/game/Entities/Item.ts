import Phaser from 'phaser'
import Effect from '../Components/Effect'
import Character from './Character'


/* TODO replace composition with generalization ! */
export default abstract class Item {
    name: string

    constructor(public effect: Effect, public sprite: Phaser.GameObjects.Sprite) {
        sprite.setInteractive({ pixelPerfect: true })
    }

    abstract used(character: Character): void
}
