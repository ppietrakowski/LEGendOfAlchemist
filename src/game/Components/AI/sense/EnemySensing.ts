import GameObject from "../../../Entities/GameObject"


export enum SenseType {
    SEE_SENSE
}


export interface SensingListener {
    sensed(sensedObject: GameObject, senseType: SenseType): void
    stopsSensing(sensedObject: GameObject, senseType: SenseType): void
}


export interface EnemySensing {
    addSenseListener(sensingListener: SensingListener): void
    removeSenseListener(sensingListener: SensingListener): void
    update(deltaTime: number): void
}