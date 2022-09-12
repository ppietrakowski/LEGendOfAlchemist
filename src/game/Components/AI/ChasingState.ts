import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import { EnemyState } from './EnemyState'
import { AI_State } from './AI_State'


export default class ChasingState extends EnemyState {

    static readonly SwitchToAttackRange = 67

    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(): void {
        this._owner.scene.physics.moveToObject(this._owner, this._controller.target, ChasingState.SwitchToAttackRange)
        this.playMoveAnim()
    }

    update(_deltaTime: number): void {
        if (this.isPlayerNear())
            this._controller.switchToNewState(AI_State.ATTACK)
    }

    getState(): AI_State {
        return AI_State.CHASING
    }

    private isPlayerNear(): boolean {
        return this._owner.isNearObject(this._controller.target, ChasingState.SwitchToAttackRange)
    }
}