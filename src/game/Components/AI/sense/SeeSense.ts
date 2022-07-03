
import GameObject from "../../../Entities/GameObject";
import { EnemySensing, SensingListener } from "./EnemySensing"



export default class SeeSense implements EnemySensing {
    private readonly listeners: SensingListener[]

    constructor(private readonly possesedPawn: GameObject, private readonly target: GameObject, private readonly maxDetectionRange: number) {
        this.listeners = []
    }

    addSenseListener(sensingListener: SensingListener): void {
        this.listeners.push(sensingListener)
    }

    update(_deltaTime: number): void {
        if (this.isPlayerInRange())
            this.emitEnemySensed()
        else if (this.isPlayerOutOfRange())
            this.emitEnemyStopSensing()
    }

    private emitEnemySensed() {
        for (const listener of this.listeners)
            listener.sensed(this.target)
    }

    private emitEnemyStopSensing() {
        for (const listener of this.listeners)
            listener.stopsSensing(this.target)
    }

    private isPlayerInRange(): boolean {
        return this.possesedPawn.isNearObject(this.target, this.maxDetectionRange)
    }

    private isPlayerOutOfRange(): boolean {
        return this.possesedPawn.isNearObject(this.target, this.maxDetectionRange + 100)
    }
}