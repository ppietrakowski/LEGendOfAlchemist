import Phaser from 'phaser'
import { addInformationText } from '../Scenes/SceneUtils'
import Player from './Player'
import TeleportEffect from '../Components/Effects/TeleportEffect'

export default class Portal {
    private _teleportSound: Phaser.Sound.BaseSound
    private _text: Phaser.GameObjects.Text = null

    constructor(public name: string, public sprite: Phaser.Physics.Arcade.Sprite,
        public player: Player, private readonly _endPoint: Phaser.Math.Vector2,
        private readonly _portalNo: number) {

        this._teleportSound = sprite.scene.sound.add('portal-sound')
        this.sprite.scene.physics.add.overlap(this.sprite, this.player, () => this.playerEnteredIntoPortal())
        sprite.setInteractive()
        sprite.body.pushable = false
    }

    private showCannotTeleport() {
        this._text = addInformationText(this.player.gameScene, this.player.x, this.player.y,
            `Cannot go any futher without teleporting stone  ${this._portalNo}`,
            (txt: Phaser.GameObjects.GameObject) => { txt.destroy(); this._text = null }
        )
    }

    private teleport() {
        this._teleportSound.play()
        this.player.attributes.applyEffect(new TeleportEffect(this._endPoint))
    }

    private playerEnteredIntoPortal() {
        if (this.player.hasTeleportStone(this._portalNo))
            this.teleport()
        else if (this._text === null)
            this.showCannotTeleport()
    }
}
