
import EnemyController from './../EnemyController'

export abstract class EnemyState {

    constructor (public controller: EnemyController) {}

    abstract stateStarted(): void

    update(_deltaTime: number) {}
}