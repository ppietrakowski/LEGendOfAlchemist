import Enemy from '../Entities/Enemy'
import { Component, addToUpdateList } from './Component'

import { EnemyState } from './AI/EnemyState'
import { RoamState } from './AI/RoamState'
import ChasingState from './AI/ChasingState'

import { EnemySensing, SenseType, SensingListener } from "./AI/sense/EnemySensing"
import SeeSense from "./AI/sense/SeeSense"
import GameObject from '../Entities/GameObject'
import Controller from './Controller'

import {AI_State} from './AI/AI_State'


export default class EnemyController implements Component, SensingListener, Controller {
    private readonly senses: EnemySensing[]

    private currentState: EnemyState

    constructor(public readonly target: GameObject, private readonly possesedEnemy: Enemy, maxDetectionRange: number) {
        this.senses = []
        this.senses.push(new SeeSense(this.possesedEnemy, this.target, maxDetectionRange))

        this.senses[0].addSenseListener(this)

        this.start()
    }

    destroy(): void {}

    getCurrentState(): EnemyState {
        return this.currentState
    }

    sensed(_sensedObject: GameObject, _senseType: SenseType): void {
        if (this.currentState.getState() !== AI_State.ATTACK)
            this.switchToNewState(new ChasingState(this, this.possesedEnemy))
    }

    stopsSensing(_sensedObject: GameObject, _senseType: SenseType): void {
        this.switchToNewState(new RoamState(this, this.possesedEnemy))
    }

    getName(): string {
        return 'enemy-movement';
    }

    private start(): void {
        const { scene } = this.possesedEnemy

        this.possesedEnemy.setVelocityX(0)
        this.possesedEnemy.setVelocityY(0)

        scene.physics.add.collider(this.possesedEnemy, this.target)

        this.currentState = new RoamState(this, this.possesedEnemy);
        this.currentState.stateStarted()

        addToUpdateList(this.possesedEnemy.scene, this.update, this)
    }

    update(_time: number, deltaTime: number): void {
        deltaTime *= 0.001
        this.currentState.update(deltaTime)

        for (let sense of this.senses)
            sense.update(deltaTime)
    }

    switchToNewState(state: EnemyState) {
        this.currentState.stateClosed()
        this.currentState = state
        state.stateStarted()
    }
}
