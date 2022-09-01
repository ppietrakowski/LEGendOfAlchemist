import GameObject from "../../Entities/GameObject";

export default interface Effect {

    appliedTo(gameObject: GameObject): void
    update(deltaTime: number): void
    clone(): Effect

    events: Phaser.Events.EventEmitter
}