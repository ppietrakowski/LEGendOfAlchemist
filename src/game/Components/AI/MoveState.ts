import GameObject from "../../Entities/GameObject";
import Controller from "../Controller";
import { AI_State } from './AI_State';
import { EnemyState } from "./EnemyState";


export class MoveState extends EnemyState {
    endPosition: Phaser.Math.Vector2

    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(endPosition: Phaser.Math.Vector2): void {
        this.endPosition = endPosition
    }

    update(_deltaTime: number): void {
        if (this.isNearTarget())
            this.collided()
    }

    getState(): AI_State {
        return AI_State.DURING_MOVE
    }

    private isNearTarget(): boolean {
        return this.owner.body && (this.owner.isNear(this.endPosition, 1.5)
            || !this.owner.body.blocked.none || !this.owner.body.touching.none)
    }

    private collided() {
        this.owner.setVelocity(0, 0)
        this.controller.switchToNewState(AI_State.ROAMING)
    }
}