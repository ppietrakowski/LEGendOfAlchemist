import Phaser from 'phaser'
import { addInformationText } from '../Scenes/SceneUtils'
import Player from './Player'


export default class Portal {
    private teleportSound: Phaser.Sound.BaseSound
    private text: Phaser.GameObjects.Text = null

    constructor(public name: string, public sprite: Phaser.Physics.Arcade.Sprite, public player: Player, endPoint: Phaser.Math.Vector2, portalNo: number) {
        this.teleportSound = sprite.scene.sound.add('portal-sound')
        this.addOverlap(portalNo, endPoint);
        sprite.setInteractive()
        sprite.body.pushable = false
    }

    addOverlap(portalNo: number, endPoint: Phaser.Math.Vector2) {
        this.sprite.scene.physics.add.overlap(this.sprite, this.player, () => {
            if (this.player.hasTeleportStone(portalNo)) {
                this.teleportSound.play()
                this.player.setX(endPoint.x)
                this.player.setY(endPoint.y)
            } else if (this.text === null) {
                this.text = addInformationText(this.player.gameScene, this.player.x, this.player.y,
                    `Cannot go any futher without teleporting stone  ${portalNo}`,
                    (txt: Phaser.GameObjects.GameObject) => { txt.destroy(); this.text = null }
                );
            }
        });
    }
}
