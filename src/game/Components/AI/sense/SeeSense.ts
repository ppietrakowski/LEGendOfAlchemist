import GameObject from "../../../Entities/GameObject";
import { EnemySensing, SenseType, SensingListener } from "./EnemySensing"


export default class SeeSense implements EnemySensing {
    private listeners: SensingListener[]

    constructor(private readonly possesedPawn: GameObject, private readonly target: GameObject,
        private readonly maxDetectionRange: number) {
        this.listeners = []
    }

    removeSenseListener(sensingListener: SensingListener): void {
        this.listeners = this.listeners.filter(value => value !== sensingListener)
    }

    addSenseListener(sensingListener: SensingListener): void {
        this.listeners.push(sensingListener)
    }

    private isPlayerInRange(): boolean {
        return this.possesedPawn.isNearObject(this.target, this.maxDetectionRange)
    }

    private emitEnemySensed() {
        for (const listener of this.listeners)
            listener.sensed(this.target, SenseType.SEE_SENSE)
    }

    private isPlayerOutOfRange(): boolean {
        return this.possesedPawn.isNearObject(this.target, this.maxDetectionRange + 100)
    }

    private emitEnemyStopSensing() {
        for (const listener of this.listeners)
            listener.stopsSensing(this.target, SenseType.SEE_SENSE)
    }

    update(_deltaTime: number): void {
        if (this.isPlayerInRange())
            this.emitEnemySensed()
        else if (this.isPlayerOutOfRange())
            this.emitEnemyStopSensing()
    }
}