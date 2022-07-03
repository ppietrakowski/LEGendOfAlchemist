import Phaser from 'phaser'
import { addInformationText } from '../Scenes/SceneUtils'
import Player from './Player'


export default class Portal {
    private teleportSound: Phaser.Sound.BaseSound
    private text: Phaser.GameObjects.Text = null

    constructor(public name: string, public sprite: Phaser.Physics.Arcade.Sprite, public player: Player, private readonly endPoint: Phaser.Math.Vector2, private readonly portalNo: number) {
        this.teleportSound = sprite.scene.sound.add('portal-sound')
        this.sprite.scene.physics.add.overlap(this.sprite, this.player, () => this.playerEnteredIntoPortal())
        sprite.setInteractive()
        sprite.body.pushable = false
    }

    private playerEnteredIntoPortal() {
        if (this.player.hasTeleportStone(this.portalNo))
            this.teleport()
        else if (this.text === null)
            this.showCannotTeleport()
    }

    private showCannotTeleport() {
        this.text = addInformationText(this.player.gameScene, this.player.x, this.player.y,
            `Cannot go any futher without teleporting stone  ${this.portalNo}`,
            (txt: Phaser.GameObjects.GameObject) => { txt.destroy(); this.text = null }
        )
    }

    private teleport() {
        this.teleportSound.play()
        this.player.setX(this.endPoint.x)
        this.player.setY(this.endPoint.y)
    }
}
