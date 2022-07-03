
import GameObject from '../../Entities/GameObject'
import Effect from '../Effect'
import { EnemyState } from './EnemyState'
import DamageCalculator from './DamageCalculator'
import Controller from '../Controller'
import Enemy from '../../Entities/Enemy'
import { AI_State } from './AI_State'

export default class AttackState extends EnemyState {
    private delay: number

    constructor(controller: Controller, owner: GameObject, private readonly calculator: DamageCalculator) {
        super(controller, owner)
        this.delay = 0
    }

    stateStarted(): void {
        this.owner.setVelocity(0, 0)
        this.controller.target.attributes.addEffect(new Effect(-this.calculator.calculateDamage(this.controller.target), 0, 0, 1))
        this.owner.emit(Enemy.ENEMY_ATTACKED, this.controller.target)
    }

    update(deltaTime: number): void {
        this.delay += deltaTime
        
        if (this.delay >= 1.5) {
            this.controller.switchToNewState(new AttackState(this.controller, this.owner, this.calculator))
        }
    }

    getState(): AI_State {
        return AI_State.Attack
    }
}