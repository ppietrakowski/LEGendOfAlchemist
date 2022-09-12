
import Enemy from '../../Entities/Enemy'
import { EnemyState } from '../AI/EnemyState'
import Controller from '../Controller'

import { AI_State } from '../AI/AI_State'
import AttackState from './AttackState'
import ChasingState from './ChasingState'
import { MoveState } from './MoveState'
import { RoamState } from './RoamState'

export default class EnemyStatePool {

    private _states: EnemyState[]

    constructor(private readonly _controller: Controller, private readonly _enemy: Enemy) {
        this._states = []

        /* Pool available states */
        this._states[AI_State.ATTACK] = new AttackState(this._controller, this._enemy)
        this._states[AI_State.ROAMING] = new RoamState(this._controller, this._enemy)
        this._states[AI_State.CHASING] = new ChasingState(this._controller, this._enemy)
        this._states[AI_State.DURING_MOVE] = new MoveState(this._controller, this._enemy)
    }

    getState(state: AI_State): EnemyState {
        return this._states[state]
    }
}