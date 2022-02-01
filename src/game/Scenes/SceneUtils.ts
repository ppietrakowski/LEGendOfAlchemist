
import Phaser from "phaser";

function getXandY(isle: number): object {
    let pos = {};
    if (isle === 0) {
        pos["x"] = Math.round(Phaser.Math.Between(9, 68)) * 32;
        pos["y"] = Math.round(Phaser.Math.Between(6, 53)) * 32;
    } else if (isle === 1) {
        pos["x"] = Math.round(Phaser.Math.Between(132, 213)) * 32;
        pos["y"] = Math.round(Phaser.Math.Between(33, 80)) * 32;
    } else if (isle === 2) {
        pos["x"] = Math.round(Phaser.Math.Between(12, 144)) * 32;
        pos["y"] = Math.round(Phaser.Math.Between(111, 155)) * 32;
    } else {
        pos["x"] = Math.round(Phaser.Math.Between(66, 115)) * 32;
        pos["y"] = Math.round(Phaser.Math.Between(59, 68)) * 32;
    }
    return pos;
}

export function spawnAtTile(sprite: Phaser.Physics.Arcade.Sprite, isle: number, excludingLayer: Phaser.Tilemaps.TilemapLayer) {
    while (excludingLayer.getTileAtWorldXY(Math.round(sprite.x), Math.round(sprite.y)) != null) {
        let pos = getXandY(isle);
        sprite.x = pos["x"];
        sprite.y = pos["y"];
    }
}


export function spawnGameobjectAtTile(isle: number, sprite: Phaser.GameObjects.Sprite, excludingLayer: Phaser.Tilemaps.TilemapLayer): void {
    while (excludingLayer.getTileAtWorldXY(Math.round(sprite.x), Math.round(sprite.y)) != null) {
        let pos = getXandY(isle);
        sprite.x = pos["x"];
        sprite.y = pos["y"];
    }
}

