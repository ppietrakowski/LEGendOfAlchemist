import GameObject from "../../Entities/GameObject";

export interface Effect {
    appliedTo(gameObject: GameObject): void
    update(deltaTime: number): void
    clone(): Effect

    events: Phaser.Events.EventEmitter
}

export const EFFECT_ENDED = Symbol('A symbol of event, when effect ends');