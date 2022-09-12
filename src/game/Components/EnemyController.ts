import Enemy from '../Entities/Enemy'
import { Component } from './Component'

import { EnemyState } from './AI/EnemyState'

import { EnemySensing, SenseType, SensingListener } from './AI/sense/EnemySensing'
import SeeSense from './AI/sense/SeeSense'
import GameObject from '../Entities/GameObject'
import Controller from './Controller'

import { AI_State } from './AI/AI_State'
import EnemyStatePool from './AI/EnemyStatePool'

export default class EnemyController implements Component, SensingListener, Controller, EnemySensing {
    private readonly _senses: EnemySensing[]

    private _currentState: EnemyState

    /**
     * For reduce gc overhead
     */
    private statePool: EnemyStatePool

    static readonly COMPONENT_NAME = 'EnemyController'

    constructor(public readonly target: GameObject, private readonly _controlledEnemy: Enemy, maxDetectionRange: number) {
        this._senses = []
        this._senses.push(new SeeSense(this._controlledEnemy, this.target, maxDetectionRange))

        this._senses[0].addSenseListener(this)

        this.statePool = new EnemyStatePool(this, this._controlledEnemy)

        this.runStateMachine()
    }

    private runStateMachine(): void {
        const { scene } = this._controlledEnemy

        this._controlledEnemy.setVelocity(0)

        //here configuration of collision ??
        scene.physics.add.collider(this._controlledEnemy, this.target)

        this.switchToNewState(AI_State.ROAMING)

        this._controlledEnemy.on(GameObject.GAMEOBJECT_UPDATE, this.update, this)
    }

    destroy(): void {
        this._senses.forEach(sense => sense.removeSenseListener(this))
        this._controlledEnemy.off(GameObject.GAMEOBJECT_UPDATE, this.update, this)
        this._currentState = null
    }

    getCurrentState(): EnemyState {
        return this._currentState
    }

    sensed(_sensedObject: GameObject, _senseType: SenseType): void {
        const wasWondering = this._currentState && this._currentState.getState() !== AI_State.ATTACK
        if (wasWondering)
            this.switchToNewState(AI_State.CHASING)
    }

    stopsSensing(_sensedObject: GameObject, _senseType: SenseType): void {
        this.switchToNewState(AI_State.ROAMING)
    }

    getName(): string {
        return EnemyController.COMPONENT_NAME
    }

    update(deltaTime: number): void {
        this._currentState?.update(deltaTime)

        for (const sense of this._senses)
            sense.update(deltaTime)
    }

    switchToNewState(state: AI_State, ...args: any[]) {
        this._currentState = this.statePool.getState(state)
        this._currentState.stateStarted(...args)
    }

    addSenseListener(sensingListener: SensingListener): void {
        for (const sense of this._senses)
            sense.addSenseListener(sensingListener)
    }
    removeSenseListener(sensingListener: SensingListener): void {
        for (const sense of this._senses)
            sense.removeSenseListener(sensingListener)
    }
}
