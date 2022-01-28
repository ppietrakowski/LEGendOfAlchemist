import Phaser from 'phaser'
import * as items from '../Entities/Items'

export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super('Preload');
    }
    
    preload() {
        this.load.image('play', 'assets/buttons/play.png');
        this.load.image('credits', 'assets/buttons/credits.png');
        this.load.image('background', 'assets/temp/background.png');
        this.load.image('main-island', 'assets/tilemap/placeholder.png');
        this.load.spritesheet('shark', 'assets/temp/shark_walk.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 });
        this.load.tilemapTiledJSON('island', 'assets/tilemap/main-island.json');
        
        this.load.image('inventory-background', 'assets/temp/inventory-background.png');
        this.load.image('portal', 'assets/temp/portals/portal.png');

        this.load.audio('player-slap', 'assets/sounds/player-slap.wav');
        this.load.audio('potion-hit', 'assets/sounds/potion-hit.wav');
        this.load.audio('potion-throwed', 'assets/sounds/throw.wav');

        this.load.image('back', 'assets/buttons/back.png');
        this.load.image('background', 'assets/temp/background.png');

        this.load.image('item-background', 'assets/temp/item-background.png')
        this.load.image('craft-item', 'assets/buttons/craft.png')
        
        items.loadItems(this);
    }

    create() {
        this.time.addEvent({
            delay: 0,
            callback: () => { 
                this.game.scene.run('Inventory'); 
                this.game.scene.getScene('Inventory').scene.setVisible(false); 
                this.game.scene.pause('Inventory');
                this.game.scene.run('MainMenu')
            }
        })
    }
}