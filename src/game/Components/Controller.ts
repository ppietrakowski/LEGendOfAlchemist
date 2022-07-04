import GameObject from "../Entities/GameObject";
import { EnemyState } from "./AI/EnemyState";


export default interface Controller {
    readonly target: GameObject
    getCurrentState(): EnemyState
    switchToNewState(state: EnemyState): void
}