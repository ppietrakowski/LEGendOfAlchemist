import Phaser from 'phaser'
import { addInformationText } from '../Scenes/SceneUtils'
import Player from './Player'


export default class Portal {
    name: string
    player: Player
    sprite: Phaser.Physics.Arcade.Sprite
    teleportSound: Phaser.Sound.BaseSound
    text: Phaser.GameObjects.Text = null

    constructor(name: string, sprite: Phaser.Physics.Arcade.Sprite, player: Player, endPoint: Phaser.Math.Vector2, portalNo: number) {
        this.player = player
        this.sprite = sprite

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
                this.text = addInformationText(this.player.gameScene,this. player.x, this.player.y,
                    `Cannot go any futher without teleporting stone  ${portalNo}`,
                    (txt: Phaser.GameObjects.GameObject) => { txt.destroy(); this.text = null }
                );
            }
        });
    }
}
