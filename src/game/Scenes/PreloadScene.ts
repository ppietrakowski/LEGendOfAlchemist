import Phaser from 'phaser'
import * as enemies from '../Entities/Enemies'
import * as items from '../Entities/Items'
import { loadMusic } from '../Entities/Music'
import MainMenu from './MainMenu'

const images = [
    { key: 'play', src: 'buttons/play.png' },
    { key: 'credits', src: 'buttons/credits.png' },
    { key: 'sound-on', src: 'buttons/sound_on.png' },
    { key: 'sound-off', src: 'buttons/sound_off.png' },
    { key: 'back', src: 'buttons/back.png' },
    { key: 'exit', src: 'buttons/exit.png' },
    { key: 'craft-item', src: 'buttons/craft.png' },
    { key: 'background', src: 'temp/background.png' },
    { key: 'main-island', src: 'tilemap/tileset.png' },
    { key: 'inventory-background', src: 'temp/inventory-background.png' },
    { key: 'item-background', src: 'temp/item-background.png' },
    { key: 'portal', src: 'temp/portals/portal.png' },
    { key: 'playerIcon', src: 'characterIcon.png' },
    { key: 'logo', src: 'game_icon.png' },
]

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload')
    }

    private loadSounds() {
        this.load.audio('player-slap', 'assets/sounds/player-slap.wav')
        this.load.audio('potion-hit', 'assets/sounds/potion-hit.wav')
        this.load.audio('potion-throwed', 'assets/sounds/throw.wav')
        this.load.audio('menu-theme', 'assets/sounds/menu-theme.mp3')
        this.load.audio('portal-sound', 'assets/sounds/Teleport.wav')
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 })
        this.load.tilemapTiledJSON('island', 'assets/tilemap/main-island.json')

        for (const i of images)
            this.load.image(i.key, `assets/${i.src}`)

        this.loadSounds()

        loadMusic(this)
        enemies.loadAllEnemies(this)
        items.loadItems(this)
    }

    private loadAllUi() {
        this.game.scene.run('Inventory')
        this.game.scene.getScene('Inventory').scene.setVisible(false)

        this.game.scene.pause('Inventory')
        this.game.scene.run('MainMenu')
    }

    create() {
        this.loadAllUi()
        this.game.scene.add('MainMenu', new MainMenu())
        this.game.scene.run('MainMenu')
    }
}