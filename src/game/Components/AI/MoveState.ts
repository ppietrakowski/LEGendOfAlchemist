import EnemyController from "../EnemyController";
import { EnemyState } from "./EnemyState";
import { RoamState } from "./RoamState";

export class MoveState extends EnemyState {
    constructor (controller: EnemyController, private readonly endPosition: Phaser.Math.Vector2) {
        super(controller)

        this.owner.once(Phaser.Physics.Arcade.Events.TILE_COLLIDE, () => this.controller.switchToNewState(new RoamState(this.controller)), this)
    }
    
    stateStarted(): void {
    }    

    update(_deltaTime: number): void {
        if (this.isNearTarget())
            this.controller.switchToNewState(new RoamState(this.controller))
    }

    private isNearTarget(): boolean {
        return this.owner.isNear(this.endPosition, 1.5)
    }
}