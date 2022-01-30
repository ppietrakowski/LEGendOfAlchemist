import Phaser from 'phaser'
import * as items from '../Entities/Items'
import * as enemies from '../Entities/Enemies'

export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super('Preload')
    }

    preload() {
        this.load.image('play', 'assets/buttons/play.png')
        this.load.image('credits', 'assets/buttons/credits.png')
        this.load.image('sound-on', 'assets/buttons/sound_on.png')
        this.load.image('sound-off', 'assets/buttons/sound_off.png')
        this.load.image('background', 'assets/temp/background.png')
        this.load.image('main-island', 'assets/tilemap/placeholder.png')
        
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 })
        this.load.tilemapTiledJSON('island', 'assets/tilemap/main-island.json')
        
        this.load.image('inventory-background', 'assets/temp/inventory-background.png')
        this.load.image('portal', 'assets/temp/portals/portal.png')

        this.load.audio('player-slap', 'assets/sounds/player-slap.wav')
        this.load.audio('potion-hit', 'assets/sounds/potion-hit.wav')
        this.load.audio('potion-throwed', 'assets/sounds/throw.wav')
        
        this.load.audio('menu-theme', 'assets/sounds/menu-theme.mp3')

        this.load.image('back', 'assets/buttons/back.png')
        this.load.image('background', 'assets/temp/background.png')

        this.load.image('item-background', 'assets/temp/item-background.png')
        this.load.image('craft-item', 'assets/buttons/craft.png')

        this.load.image('playerIcon', 'assets/characterIcon.png')
        this.load.image('logo', 'assets/game_icon.png');
        enemies.loadAllEnemies(this)
        items.loadItems(this)
    }

    create() {
        this.time.addEvent({
            delay: 0,
            callback: () => { 
                this.game.scene.run('Inventory')
                this.game.scene.getScene('Inventory').scene.setVisible(false)

                this.game.scene.run('Crafting')
                this.game.scene.getScene('Crafting').scene.setVisible(false)


                this.game.scene.pause('Inventory')
                this.game.scene.pause('Crafting')
                this.game.scene.run('MainMenu')
            }
        })
    }
}