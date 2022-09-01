import GameObject from '../../Entities/GameObject'
import Effect from '../Effect'
import { EnemyState } from './EnemyState'
import IDamageCalculator from './DamageCalculator'
import Controller from '../Controller'
import Enemy from '../../Entities/Enemy'
import { AI_State } from './AI_State'


export default class AttackState extends EnemyState {
    private delay: number

    private static readonly ATTACK_DELAY = 1.4

    constructor(controller: Controller, owner: GameObject, private readonly calculator: IDamageCalculator) {
        super(controller, owner)
    }

    stateStarted(): void {
        this.owner.setVelocity(0, 0)
        this.controller.target.attributes.damage(
            new Effect(-this.calculator.calculateDamage(this.controller.target), 0, 0, 1))
        this.owner.emit(Enemy.ENEMY_ATTACKED, this.controller.target)
        this.delay = 0
    }

    update(deltaTime: number): void {
        this.delay += deltaTime

        if (this.delay >= AttackState.ATTACK_DELAY)
            this.controller.switchToNewState(AI_State.ATTACK)
    }

    getState(): AI_State {
        return AI_State.ATTACK
    }
}