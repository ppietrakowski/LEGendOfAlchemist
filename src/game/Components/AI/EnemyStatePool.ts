
import { EnemyState } from '../AI/EnemyState'

import { AI_State } from '../AI/AI_State'
import Controller from '../Controller'
import Enemy from '../../Entities/Enemy'
import AttackState from './AttackState'
import DefaultDamageCalculator from '../DefaultDamageCalculator'
import { MoveState } from './MoveState'
import { RoamState } from './RoamState'
import ChasingState from './ChasingState'

export default class EnemyStatePool {

    private states: EnemyState[]

    constructor(private readonly controller: Controller, private readonly pawn: Enemy) {
        this.states = []

        /* Pool available states */
        this.states[AI_State.ATTACK] = new AttackState(this.controller, this.pawn, new DefaultDamageCalculator(this.pawn))
        this.states[AI_State.ROAMING] = new RoamState(this.controller, this.pawn)
        this.states[AI_State.CHASING] = new ChasingState(this.controller, this.pawn)
    }

    getState(state: AI_State): EnemyState {
        /* A move state is special one - requires movement target specified in roaming state */
        if (state === AI_State.DURING_MOVE)
            return new MoveState(this.controller, this.pawn, this.getNextPosition())

        return this.states[state]
    }

    private getNextPosition(): Phaser.Math.Vector2 {
        return (this.states[AI_State.ROAMING] as RoamState).endPosition
    }
}