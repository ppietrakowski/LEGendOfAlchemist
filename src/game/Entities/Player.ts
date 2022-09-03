import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import { Inventory } from '../Components/Inventory'
import PlayerCombat from '../Components/PlayerCombat'
import PlayerHealthBar from '../Components/PlayerHealthBar'
import PlayerMovement from '../Components/PlayerMovement'
import { GameBaseScene } from '../Scenes/GameBaseScene'
import GameObject from './GameObject'


export default class Player extends GameObject {

    static readonly INVENTORY_START = "InventoryStart"

    constructor(public gameScene: GameBaseScene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        super(gameScene, x, y, texture, 0)
        this.setName('player')

        this.addComponents()

        this.setScrollFactor(1)

        this.scene.cameras.main.startFollow(this, true, 0.08, 0.08)

        this.attributes.on(Attribute.CHARACTER_DEAD, this.playerKilled, this)
        this.scene.game.events.emit(Player.INVENTORY_START, { inventory: this.inventory, owner: this })
        this.inventory.events.on(Inventory.INVENTORY_FULL, gameScene.showCannotGatherInfo, gameScene)
    }

    private addComponents() {
        this.addComponent(new PlayerHealthBar(this))
        this.addComponent(new PlayerCombat(this))
        this.addComponent(new Inventory(this))
        this.addComponent(new PlayerMovement(this, new Phaser.Math.Vector2(190, 190)))
    }

    private playerKilled(): void {
        const { game } = this.scene

        game.scene.stop('GameScene')
        game.scene.run('Credits')
    }

    get inventory(): Inventory {
        return this.getComponent<Inventory>(Inventory.COMPONENT_NAME)
    }

    get combat(): PlayerCombat {
        return this.getComponent<PlayerCombat>(PlayerCombat.COMPONENT_NAME) as PlayerCombat
    }

    addedToScene(): void {
        super.addedToScene()

        this.anims.play('player-front', false)

        this.scaleX = 1.5
        this.scaleY = 1.5
    }

    hasTeleportStone(index: number): boolean {
        return this.inventory.hasItem(`teleport-stone-` + index);
    }
}