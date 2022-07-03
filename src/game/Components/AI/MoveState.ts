import GameObject from "../../Entities/GameObject";
import Controller from "../Controller";
import EnemyController from "../EnemyController";
import { EnemyState } from "./EnemyState";
import { RoamState } from "./RoamState";
import {AI_State} from './AI_State'

export class MoveState extends EnemyState {
    getState(): AI_State {
        return AI_State.DuringMove
    }
    constructor (controller: Controller, owner: GameObject, private readonly endPosition: Phaser.Math.Vector2) {
        super(controller, owner)
    }
    
    stateStarted(): void {
    }    

    update(_deltaTime: number): void {
        if (this.isNearTarget())
            this.collided()
    }

    private isNearTarget(): boolean {
        return (typeof this.owner.body !== 'undefined') && (this.owner.isNear(this.endPosition, 1.5) || !this.owner.body.blocked.none || !this.owner.body.touching.none)
    }

    private collided() {
        this.owner.setVelocity(0, 0)
        this.controller.switchToNewState(new RoamState(this.controller, this.owner))
    }
}