import Location from "./Location";

class Island extends Location {
    key: string;

    constructor(islandName: string, spawnPoint: Phaser.Math.Vector2) {
        super({key: islandName}, spawnPoint.x, spawnPoint.y);
        this.key = islandName;
    }

    preload(): void {
        this.load.image(this.key, 'assets/' + this.key + '.png');
    }
    start(): void {
        this.add.image(0, 0, this.key).setOrigin(0, 0);
    }
    
    update(time: number, delta: number): void {
       
    }

}

export const Islands = {
    island1: new Island('Island1', new Phaser.Math.Vector2(0, 0))
}