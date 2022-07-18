import Enemy from '../Entities/Enemy'
import { Component } from './Component'

import { EnemyState } from './AI/EnemyState'
import { RoamState } from './AI/RoamState'
import ChasingState from './AI/ChasingState'

import { EnemySensing, SenseType, SensingListener } from "./AI/sense/EnemySensing"
import SeeSense from "./AI/sense/SeeSense"
import GameObject from '../Entities/GameObject'
import Controller from './Controller'

import {AI_State} from './AI/AI_State'
import EnemyStatePool from './AI/EnemyStatePool'

export default class EnemyController implements Component, SensingListener, Controller {
    private readonly senses: EnemySensing[]

    private currentState: EnemyState

    /**
     * For reduce gc overhead
     */
    private statePool: EnemyStatePool

    static readonly COMPONENT_NAME = "EnemyController"

    constructor(public readonly target: GameObject, private readonly possesedEnemy: Enemy, maxDetectionRange: number) {
        this.senses = []
        this.senses.push(new SeeSense(this.possesedEnemy, this.target, maxDetectionRange))

        this.senses[0].addSenseListener(this)

        this.statePool = new EnemyStatePool(this, this.possesedEnemy);

        this.runStateMachine()
    }

    destroy(): void {
        this.senses.forEach(sense => sense.removeSenseListener(this))
        this.possesedEnemy.off(GameObject.GAMEOBJECT_UPDATE, this.update, this)
        this.currentState = null    
    }

    getCurrentState(): EnemyState {
        return this.currentState
    }

    sensed(_sensedObject: GameObject, _senseType: SenseType): void {
        if (this.currentState && this.currentState.getState() !== AI_State.ATTACK)
            this.switchToNewState(AI_State.CHASING)
    }

    stopsSensing(_sensedObject: GameObject, _senseType: SenseType): void {
        this.switchToNewState(AI_State.ROAMING)
    }

    getName(): string {
        return EnemyController.COMPONENT_NAME
    }

    update(deltaTime: number): void {
        this.currentState?.update(deltaTime)

        for (let sense of this.senses)
            sense.update(deltaTime)
    }

    switchToNewState(state: AI_State) {
        this.currentState = this.statePool.getState(state)
        this.currentState.stateStarted()
    }

    private runStateMachine(): void {
        const { scene } = this.possesedEnemy

        this.possesedEnemy.setVelocityX(0)
        this.possesedEnemy.setVelocityY(0)

        scene.physics.add.collider(this.possesedEnemy, this.target)

        this.currentState = new RoamState(this, this.possesedEnemy);
        this.currentState.stateStarted()

        this.possesedEnemy.on(GameObject.GAMEOBJECT_UPDATE, this.update, this);
    }
}
