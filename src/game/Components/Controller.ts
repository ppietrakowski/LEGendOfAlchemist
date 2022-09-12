import GameObject from '../Entities/GameObject'
import { AI_State } from './AI/AI_State'
import { EnemyState } from './AI/EnemyState'


export default interface Controller {
    readonly target: GameObject
    getCurrentState(): EnemyState
    switchToNewState(state: AI_State, ...args: any[]): void
}