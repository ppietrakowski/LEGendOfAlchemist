
import GameObject from '../../Entities/GameObject';
import Effect from './Effect'

export default class TeleportEffect implements Effect {
    constructor(private destination: { x: number, y: number }) {
        this.events = new Phaser.Events.EventEmitter()
    }

    appliedTo(gameObject: GameObject): void {
        gameObject.setX(this.destination.x)
        gameObject.setY(this.destination.y)
    }

    update(_deltaTime: number): void {
        this.events.emit('ended')
    }

    clone(): Effect {
        throw new Error('This type of effect could not be cloned')
    }

    events: Phaser.Events.EventEmitter;

}