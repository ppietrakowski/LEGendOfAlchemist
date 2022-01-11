import Location from "./Location";

class Island extends Location {

    constructor(islandName: string, spawnPoint: Phaser.Math.Vector2) {
        super({key: islandName}, spawnPoint.x, spawnPoint.y);
    }

    preload(): void {
        
    }
    start(): void {
        
    }
    update(time: number, delta: number): void {
       
    }

}

export const Islands = {
    island1: new Island('Island1', new Phaser.Math.Vector2(0, 0))
}