import GameObject from '../../Entities/GameObject'
import TimedEffect from '../Effects/TimedEffect'
import { EnemyState } from './EnemyState'
import IDamageCalculator from './DamageCalculator'
import Controller from '../Controller'
import Enemy from '../../Entities/Enemy'
import { AI_State } from './AI_State'
import DefaultDamageCalculator from '../DefaultDamageCalculator'


export default class AttackState extends EnemyState {
    private _delay: number
    private _calculator: IDamageCalculator

    private static readonly ATTACK_DELAY = 1.4

    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
        this._calculator = new DefaultDamageCalculator(owner)

        this._owner.on(Enemy.ENEMY_ATTACKED, this.attacked, this)
    }

    stateStarted(): void {
        const { target } = this._controller

        this._owner.setVelocity(0)

        this._owner.emit(Enemy.ENEMY_ATTACKED, target)
        this._delay = 0
    }

    update(deltaTime: number): void {
        this._delay += deltaTime

        if (this._delay >= AttackState.ATTACK_DELAY)
            this._controller.switchToNewState(AI_State.ATTACK)
    }

    getState(): AI_State {
        return AI_State.ATTACK
    }

    private attacked(target: GameObject) {
        const deltaHp = -this._calculator.calculateDamage(target)
        const deltaStrength = 0
        const deltaWisdom = 0
        const duration = 1

        target.attributes.applyEffect(
            new TimedEffect(deltaHp, deltaStrength, deltaWisdom, duration))
    }
}