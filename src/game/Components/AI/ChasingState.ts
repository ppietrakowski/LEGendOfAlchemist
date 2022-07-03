
import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import DefaultDamageCalculator from '../DefaultDamageCalculator'
import AttackState from './AttackState'
import { EnemyState } from './EnemyState'
import { RoamState } from './RoamState'
import { AI_State } from './AI_State'

export default class ChasingState extends EnemyState {
    getState(): AI_State {
        return AI_State.Chasing
    }
    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(): void {
        this.owner.scene.physics.moveToObject(this.owner, this.controller.target, 67)
        this.playMoveAnim()
    }

    update(_deltaTime: number): void {
        if (this.isPlayerNear())
            this.controller.switchToNewState(new AttackState(this.controller, this.owner, new DefaultDamageCalculator(this.owner)))
    }

    private isPlayerNear(): boolean {
        return this.owner.isNearObject(this.controller.target, 67)
    }
}