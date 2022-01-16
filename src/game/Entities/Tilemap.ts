import Phaser from 'phaser'

export default class Tilemap {
    tilemap: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;

    constructor(scene: Phaser.Scene, texture: string, tilemapName: string, tilemapJson: string, ...layers: string[]) {
        scene.load.tilemapTiledJSON(tilemapName, tilemapJson);

        this.tilemap = scene.make.tilemap({key: tilemapName});
        this.tileset = this.tilemap.addTilesetImage(tilemapName, texture);

        for (let i of layers) {
            this.tilemap.createLayer(i, tilemapName);
        }
    }


}