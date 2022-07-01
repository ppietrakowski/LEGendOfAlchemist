import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import Inventory from '../Components/Inventory'
import PlayerCombat from '../Components/PlayerCombat'
import PlayerHealthBar from '../Components/PlayerHealthBar'
import PlayerMovement from '../Components/PlayerMovement'
import { GameBaseScene } from '../Scenes/GameBaseScene'
import Character from './Character'


export default class Player extends Character {
    constructor(public gameScene: GameBaseScene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        super(gameScene, x, y, texture, 0)
        this.setName('player')

        this.addComponent(new Attribute(100, 50, 10))
        this.addComponent(new PlayerMovement(new Phaser.Math.Vector2(190, 190)))
        this.addComponent(new PlayerHealthBar(this))
        this.addComponent(new PlayerCombat())
        this.addComponent(new Inventory())

        this.setScrollFactor(1)

        this.scene.cameras.main.startFollow(this, true, 0.08, 0.08)

        this.start()

        this.attributes.on(Attribute.CharacterDead, this.makeDead, this)
        this.inventory.addListener(Inventory.InventoryFull, gameScene.showCannotGatherInfo, gameScene)
    }

    get inventory(): Inventory {
        return this.getComponent<Inventory>('inventory')
    }

    get combat(): PlayerCombat {
        return this.getComponent<PlayerCombat>('player-combat') as PlayerCombat
    }

    start(): void {
        this.anims.play('player-front', false)

        this.scaleX = 1.5
        this.scaleY = 1.5
    }

    makeDead(): void {
        // for now just show dead screen
        this.scene.game.scene.run('DeadScene')
        this.scene.game.scene.stop('GameScene')
    }

    hasTeleportStone(index: number): boolean {
        return this.inventory.hasItem(`teleport-stone-` + index);
    }
}