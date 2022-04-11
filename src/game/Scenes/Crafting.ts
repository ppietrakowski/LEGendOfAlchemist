import Phaser from 'phaser'
import Effect from '../Components/Effect'
import Button from '../Entities/Button'
import Item from '../Entities/Item'
import Potion from '../Entities/Potion'
import InventoryBase from './InventoryBase'


class Field {
    item: Item
    backgroundImage: Phaser.GameObjects.Image

    constructor(item: Item, backgroundImage: Phaser.GameObjects.Image) {
        this.item = item;
        this.backgroundImage = backgroundImage;
    }
}

const MaxItemsForCraft = 4

export default class Crafting extends InventoryBase {
    items: Array<Field>
    craft: Button
    back: Button
    potionInfo: string
    potion: Phaser.GameObjects.Text

    constructor() {
        super('Crafting')
    }

    preload(): void {
        let image = this.add.image(600, 140, 'inventory-background')
        image.setScale(2, 1.5)
        image.setFlip(true, true)
        image.setScrollFactor(0)
        super.preload()
        this.items = []
        this.potionInfo = ""
        this.potion = this.add.text(500, 158, '', { fontFamily: 'pixellari' })
    }

    create(): void {
        for (let i = 0; i < MaxItemsForCraft; i++) {
            let field = new Field(null, this.add.image(500 + i * 48, 120, 'item-background').setOrigin(0, 0))
            this.setupField(field, i)
            this.items.push(field)
        }

        this.craft = new Button(this, 660, 180, 'craft-item', () => { this.onCraft() })
        this.craft.setScale(0.25, 0.25)

        this.back = new Button(this, 660, 205, 'exit', () => { this.onClose() })
        this.back.setScale(0.25, 0.25)
    }

    update(time: number, delta: number): void {
    }

    setupField(field: Field, i: number): void {
        field.backgroundImage.setInteractive({ dropZone: true, pixelPerfect: true })
        field.backgroundImage.scaleX = 2
        field.backgroundImage.scaleY = 2
        field.backgroundImage.name = "item-bkg-" + i
        field.backgroundImage.setScrollFactor(0)
    }

    addElement(item: Item): void {
        let sprite = this.add.sprite(item.sprite.x, item.sprite.y, item.sprite.texture.key)
        sprite.name = item.sprite.name
        sprite.setInteractive({ pixelPerfect: true, draggable: true })

        if (sprite.texture.key !== 'potion' && sprite.texture.key !== 'teleport-stone')
            this.setupPickable(item, sprite)

        this.container.add(sprite)
        sprite.setScrollFactor(0)
        this.updatePosition()
    }

    setupPickable(item: Item, sprite: Phaser.GameObjects.Sprite): void {
        sprite.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            sprite.x = dragX
            sprite.y = dragY
        })

        sprite.on(Phaser.Input.Events.DRAG_END, (pointer: Phaser.Input.Pointer, dropped: boolean) => {
            if (!dropped)
                this.updatePosition()
        });

        sprite.on(Phaser.Input.Events.GAMEOBJECT_DROP, (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Image) => {
            if (dropZone.name.startsWith('item-bkg-') && !this.items.find((v) => v.backgroundImage.name === dropZone.name).item)
                this.moveObjectToField(dropZone, sprite, item)
        })
        this.addItemInfo(sprite, item.effect)
    }

    moveObjectToField(dropZone: Phaser.GameObjects.Image, sprite: Phaser.GameObjects.Sprite, item: Item) {
        let field = this.getField(dropZone.name)
        let ingredientPos = new Phaser.Math.Vector2(dropZone.x - 45 + sprite.width / 2, (dropZone.y) / 1.6 - dropZone.originY - 5)
        sprite.setPosition(ingredientPos.x, ingredientPos.y)
        field.item = item

        let finalEffect = this.mixEffects()
        this.potionInfo = `hp: ${finalEffect.deltaHp}\nstr: ${finalEffect.deltaStrength}\nwis: ${finalEffect.deltaWisdom}`
        this.potion.setText(this.potionInfo)
    }


    deleteChild(child: string): void {
        super.deleteChild(child)
        this.scene.scene.children.getByName(child).destroy()
        this.updatePosition()
    }

    getField(bkgname: String): Field {
        for (let i of this.items) {
            if (i.backgroundImage.name === bkgname)
                return i
        }

        return null;
    }


    mixEffects(): Effect {
        let effect = new Effect(0, 0, 0, Math.round(Math.random() * (4 - 1) + 1))

        for (let item of this.items) {
            if (item.item != null)
                this.sumEffect(effect, item.item.effect)
        }

        effect.deltaHp *= Math.round(1 + this.inventory.owner.attributes.wisdom / 100)
        effect.deltaWisdom *= Math.round(1 + this.inventory.owner.attributes.wisdom / 100)
        effect.deltaStrength *= Math.round(1 + this.inventory.owner.attributes.wisdom / 100)

        return effect
    }

    sumEffect(effect: Effect, itemEffect: Effect): void {
        effect.deltaHp += itemEffect.deltaHp
        effect.deltaStrength += itemEffect.deltaStrength
        effect.deltaWisdom += itemEffect.deltaWisdom
    }

    hasAnyItemInArray(): boolean {
        let anyItem = false
        for (let item of this.items) {
            if (item.item != null) {
                anyItem = true
                break
            }
        }

        return anyItem
    }

    deleteRestOfItems() {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].item != null) {
                this.inventory.deleteItem(this.items[i].item)
                this.items[i].item = null
            }
        }
    }

    onCraft(): void {

        if (this.hasAnyItemInArray())
            this.createPotion()
        this.updatePosition()

        // for now just get back to gamescene
        this.game.scene.pause('Crafting')

        this.scene.setVisible(false);
        this.game.scene.run('GameScene')
    }

    onClose(): void {

        // for now just get back to gamescene
        this.game.scene.pause('Crafting', () => {
            this.updatePosition()
        });

        this.scene.setVisible(false)
        this.game.scene.run('GameScene')
    }

    private createPotion(): void {
        let mixture = new Potion(this.mixEffects(), this.add.sprite(0, 0, 'potion'))
        this.inventory.addItem(mixture)

        this.deleteRestOfItems()
        this.potion.setText('')
    }
}