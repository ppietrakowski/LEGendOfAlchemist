import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import { EnemyState } from './EnemyState'
import { AI_State } from './AI_State'


export default class ChasingState extends EnemyState {
    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(): void {
        this.owner.scene.physics.moveToObject(this.owner, this.controller.target, 67)
        this.playMoveAnim()
    }

    update(_deltaTime: number): void {
        if (this.isPlayerNear())
            this.controller.switchToNewState(AI_State.ATTACK)
    }

    getState(): AI_State {
        return AI_State.CHASING
    }

    private isPlayerNear(): boolean {
        return this.owner.isNearObject(this.controller.target, 67)
    }
}