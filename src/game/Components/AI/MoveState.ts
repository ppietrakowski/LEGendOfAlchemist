import GameObject from "../../Entities/GameObject";
import Controller from "../Controller";
import { EnemyState } from "./EnemyState";
import { RoamState } from "./RoamState";
import { AI_State } from './AI_State'


export class MoveState extends EnemyState {
    constructor(controller: Controller, owner: GameObject, private readonly endPosition: Phaser.Math.Vector2) {
        super(controller, owner)
    }

    stateStarted(): void {
    }

    update(_deltaTime: number): void {
        if (this.isNearTarget())
            this.collided()
    }

    getState(): AI_State {
        return AI_State.DURING_MOVE
    }

    private isNearTarget(): boolean {
        return (typeof this.owner.body !== 'undefined') && (this.owner.isNear(this.endPosition, 1.5) || !this.owner.body.blocked.none || !this.owner.body.touching.none)
    }

    private collided() {
        this.owner.setVelocity(0, 0)
        this.controller.switchToNewState(new RoamState(this.controller, this.owner))
    }
}