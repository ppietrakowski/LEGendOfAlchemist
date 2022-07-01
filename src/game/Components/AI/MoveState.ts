import EnemyController from "../EnemyController";
import { EnemyState } from "./EnemyState";
import { RoamState } from "./RoamState";

export class MoveState extends EnemyState {
    constructor (controller: EnemyController, private readonly endPosition: Phaser.Math.Vector2) {
        super(controller)

    }
    
    stateStarted(): void {
    }    

    update(_deltaTime: number): void {
        if (this.isNearTarget())
            this.collided()
    }

    private isNearTarget(): boolean {
        return this.owner.isNear(this.endPosition, 1.5) || !this.owner.body.blocked.none || !this.owner.body.touching.none
    }

    private collided() {
        this.owner.setVelocity(0, 0)
        this.controller.switchToNewState(new RoamState(this.controller))
    }
}