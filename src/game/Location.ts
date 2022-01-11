
import Phaser from "phaser";

export default abstract class Location extends Phaser.Scene {
    spawnPoint: Phaser.Math.Vector2;

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig, spawnPointX: number, spawnPointY: number ) {
        super(config);
        this.spawnPoint = new Phaser.Math.Vector2(spawnPointX, spawnPointY);
    }

    abstract preload(): void;
    abstract start(): void;
    abstract update(time: number, delta: number): void;
}