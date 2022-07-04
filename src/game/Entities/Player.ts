import Phaser from 'phaser'
import ChangeableAttribute from '../ChangeableAttribute'
import Attribute from '../Components/Attribute'
import { Inventory } from '../Components/Inventory'
import PlayerCombat from '../Components/PlayerCombat'
import PlayerHealthBar from '../Components/PlayerHealthBar'
import PlayerMovement from '../Components/PlayerMovement'
import { GameBaseScene } from '../Scenes/GameBaseScene'
import GameObject from './GameObject'


export default class Player extends GameObject {
    constructor(public gameScene: GameBaseScene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        super(gameScene, x, y, texture, 0)
        this.setName('player')

        this.addComponent(new PlayerHealthBar(this))
        this.addComponent(new PlayerCombat(this))
        this.addComponent(new Inventory(this))
        this.addComponent(new PlayerMovement(this, new Phaser.Math.Vector2(190, 190)))

        this.setScrollFactor(1)

        this.scene.cameras.main.startFollow(this, true, 0.08, 0.08)

        this.attributes.on(Attribute.CHARACTER_DEAD, this.playerKilled, this)
        this.inventory.addListener(Inventory.INVENTORY_FULL, gameScene.showCannotGatherInfo, gameScene)
    }

    get inventory(): Inventory {
        return this.getComponent<Inventory>('inventory')
    }

    get combat(): PlayerCombat {
        return this.getComponent<PlayerCombat>('player-combat') as PlayerCombat
    }

    addedToScene(): void {
        super.addedToScene()

        this.anims.play('player-front', false)

        this.scaleX = 1.5
        this.scaleY = 1.5
    }

    destroy(fromScene?: boolean): void {
        this.inventory.removeAllListeners(Inventory.ADDED_ITEM)
            .removeAllListeners(Inventory.DELETED_ITEM)
            .removeAllListeners(Inventory.INVENTORY_FULL)
            .removeAllListeners(Inventory.INVENTORY_NEED_UPDATE)
            .removeAllListeners(Inventory.INVENTORY_START)
        this.attributes.removeAllListeners(Attribute.CHARACTER_DEAD)

        super.destroy(fromScene)
    }

    private playerKilled(): void {
        // for now just show dead screen
        this.scene.game.scene.stop('GameScene')
        this.destroy(true)
    }

    hasTeleportStone(index: number): boolean {
        return this.inventory.hasItem(`teleport-stone-` + index);
    }
}