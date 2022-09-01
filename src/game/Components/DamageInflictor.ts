import GameObject from "../Entities/GameObject";

export default interface DamageInflictor {

    appliedTo(gameObject: GameObject): void
    update(deltaTime: number): void
    clone(): DamageInflictor

    events: Phaser.Events.EventEmitter

    deltaHp: number
    deltaStrength: number
    deltaWisdom: number
}