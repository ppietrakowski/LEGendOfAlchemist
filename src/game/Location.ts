
import Phaser from "phaser";

export default class Location extends Phaser.Scene {
    spawnPoint: Phaser.Math.Vector2;

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig, spawnPointX: number, spawnPointY: number ) {
        super(config);
        this.spawnPoint = new Phaser.Math.Vector2(spawnPointX, spawnPointY);
    }

}