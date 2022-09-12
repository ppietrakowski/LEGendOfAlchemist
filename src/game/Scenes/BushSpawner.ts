
import Phaser from 'phaser'
import { Inventory } from '../Components/Inventory'
import GameObject from '../Entities/GameObject'
import { getRandomItem } from '../Entities/Items'
import Player from '../Entities/Player'
import { addInformationText, spawnGameobjectAtTile } from './SceneUtils'


function pickUpItem(scene: Phaser.Scene, sprite: Phaser.GameObjects.Image) {
    const item = getRandomItem()
    const player = scene.children.getByName('player') as Player

    addInformationText(scene, sprite.x, sprite.y, `You have received ${item.name}`,
        (text: Phaser.GameObjects.GameObject) => {
            text.destroy()
            player.inventory.addItem(item)
        })

    sprite.destroy(true)
}

function showCannotGatherInfo(scene: Phaser.Scene, player: Phaser.GameObjects.Sprite): void {
    addInformationText(scene, player.x, player.y, 'I don\'t have enough space to gather this item', (text: Phaser.GameObjects.GameObject) => text.destroy())
}

export default class BushSpawner {

    constructor(private readonly _scene: Phaser.Scene, private readonly _howMany: number) {
    }

    public putItems(seaLayer: Phaser.Tilemaps.TilemapLayer): void {
        const player = this._scene.children.getByName('player') as GameObject

        for (let i = 0; i < this._howMany; i++) {
            const sprite = this._scene.add.image(0, 0, 'bush')
            spawnGameobjectAtTile(i % 4, sprite, seaLayer)
            sprite.setInteractive({ pixelPerfect: true })

            sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                if (player.getComponent<Inventory>(Inventory.COMPONENT_NAME).hasFreeSpace())
                    pickUpItem(this._scene, sprite)
                else
                    showCannotGatherInfo(this._scene, player)
            })
        }
    }
}