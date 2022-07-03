import GameObject from "../../../Entities/GameObject"

export interface SensingListener {
    sensed(sensedObject: GameObject): void
    stopsSensing(sensedObject: GameObject): void   
}

export interface EnemySensing {
    addSenseListener(sensingListener: SensingListener): void
    update(deltaTime: number): void
}