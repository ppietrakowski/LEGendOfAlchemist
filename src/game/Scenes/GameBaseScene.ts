import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';
import Portal from '../Entities/Portal';
import Boss from '../Entities/Boss'

import PlayerCombat from '../Components/PlayerCombat';
import { getRandomEnemyKey } from '../Entities/Enemies';
import Ingredient from '../Entities/Ingredient';
import Effect from '../Components/Effect';
import { getItemWithRandomEffect } from '../Entities/Items';
import UltraBoss from '../Entities/UltraBoss'

export function spawnAtGrassTile() {

}

export class GameBase extends Phaser.Scene {
    player: Player;
    enemies: Array<Enemy>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    seaLayer: Phaser.Tilemaps.TilemapLayer;

    constructor(key: string) {
        super(key);
    }

    create(): void {

    }

}
