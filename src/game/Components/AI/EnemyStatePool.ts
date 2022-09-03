
import Enemy from '../../Entities/Enemy'
import { EnemyState } from '../AI/EnemyState'
import Controller from '../Controller'
import DefaultDamageCalculator from '../DefaultDamageCalculator'

import { AI_State } from '../AI/AI_State'
import AttackState from './AttackState'
import ChasingState from './ChasingState'
import { MoveState } from './MoveState'
import { RoamState } from './RoamState'

export default class EnemyStatePool {

    private _states: EnemyState[]

    constructor(private readonly controller: Controller, private readonly pawn: Enemy) {
        this._states = []

        /* Pool available states */
        this._states[AI_State.ATTACK] = new AttackState(this.controller, this.pawn)
        this._states[AI_State.ROAMING] = new RoamState(this.controller, this.pawn)
        this._states[AI_State.CHASING] = new ChasingState(this.controller, this.pawn)
        this._states[AI_State.DURING_MOVE] = new MoveState(this.controller, this.pawn)
    }

    getState(state: AI_State): EnemyState {
        return this._states[state]
    }
}