import Phaser from 'phaser'
import Effect from '../Components/Effect'
import GameObject from './GameObject'


/* TODO replace composition with generalization ! */
export abstract class Item {
    name: string

    constructor(public effect: Effect, public image: Phaser.GameObjects.Image) {
        image.setInteractive({ pixelPerfect: true })
    }

    abstract used(character: GameObject): void
}


export interface UsedCallback {
    (item: IItem, gameObject: GameObject): void
}

export interface IItem {

    name: string
    imageKey: string
    description?: string
    
    used?: UsedCallback
    
    effect?: Effect
}
