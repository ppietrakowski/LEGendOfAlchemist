import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import { AI_State } from './AI_State'
import { EnemyState } from './EnemyState'


export class MoveState extends EnemyState {
    private _endPosition: Phaser.Math.Vector2

    private static readonly NearlyTouchRange = 1.5

    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(endPosition: Phaser.Math.Vector2): void {
        this._endPosition = endPosition
    }

    update(_deltaTime: number): void {
        if (this.isNearTarget())
            this.collided()
    }

    getState(): AI_State {
        return AI_State.DURING_MOVE
    }

    private isNearTarget(): boolean {

        const isNearEndPosition = this._owner.body && (this._owner.isNear(this._endPosition, MoveState.NearlyTouchRange))

        const isCollidingWithSomething = !this._owner.body.blocked.none || !this._owner.body.touching.none

        return isNearEndPosition && isCollidingWithSomething
    }

    private collided() {
        this._owner.setVelocity(0)
        this._controller.switchToNewState(AI_State.ROAMING)
    }
}