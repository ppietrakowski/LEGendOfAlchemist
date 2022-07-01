import Phaser from 'phaser'
import Effect from '../Components/Effect'
import Button from '../Entities/Button'
import Item from '../Entities/Item'
import Potion from '../Entities/Potion'
import InventoryBase from './InventoryBase'


interface Field {
    item: Item
    backgroundImage: Phaser.GameObjects.Image
}

export default class Crafting extends InventoryBase {

    private static readonly MaxItemsForCraft = 4

    private items: Field[]
    private craft: Button
    private back: Button
    private potionInfo: string
    private potion: Phaser.GameObjects.Text

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
        for (let i = 0; i < Crafting.MaxItemsForCraft; i++) {
            let field = { item: null, backgroundImage: this.add.image(500 + i * 48, 120, 'item-background').setOrigin(0, 0) }
            this.setupField(field, i)
            this.items.push(field)
        }

        let image = this.add.sprite(660, 180, 'craft-item')

        this.craft = new Button(image)
        this.craft.addClickListener(this.onCraft, this)
        image.setScale(0.25, 0.25)

        image = this.add.sprite(660, 205, 'exit')

        this.back = new Button(image)
        this.back.addClickListener(this.onClose, this)
        image.setScale(0.25, 0.25)
    }

    update(_time: number, _delta: number): void {
    }



    addElement(item: Item): void {
        let sprite = this.add.sprite(item.sprite.x, item.sprite.y, item.sprite.texture.key)
        sprite.name = item.sprite.name
        sprite.setInteractive({ pixelPerfect: true, draggable: true })

        if (sprite.texture.key !== 'potion' && sprite.texture.key !== 'teleport-stone')
            this.setupPickable(item, sprite)

        this.container.add(sprite)
        sprite.setScrollFactor(0)
        this.container.updatePosition()
    }

    deleteChild(child: string): void {
        super.deleteChild(child)
        this.scene.scene.children.getByName(child).destroy()
        this.container.updatePosition()
    }

    private setupField(field: Field, i: number): void {
        field.backgroundImage.setInteractive({ dropZone: true, pixelPerfect: true })
        field.backgroundImage.scaleX = 2
        field.backgroundImage.scaleY = 2
        field.backgroundImage.name = "item-bkg-" + i
        field.backgroundImage.setScrollFactor(0)
    }

    private setupPickable(item: Item, sprite: Phaser.GameObjects.Sprite): void {
        sprite.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            sprite.x = dragX
            sprite.y = dragY
        })

        sprite.on(Phaser.Input.Events.DRAG_END, (pointer: Phaser.Input.Pointer, dropped: boolean) => {
            if (!dropped)
                this.container.updatePosition()
        });

        sprite.on(Phaser.Input.Events.GAMEOBJECT_DROP, (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Image) => {
            if (dropZone.name.startsWith('item-bkg-') && !this.items.find((v) => v.backgroundImage.name === dropZone.name).item)
                this.moveObjectToField(dropZone, sprite, item)
        })
        this.addItemInfo(sprite, item.effect)
    }

    private moveObjectToField(dropZone: Phaser.GameObjects.Image, sprite: Phaser.GameObjects.Sprite, item: Item) {
        let field = this.getField(dropZone.name)
        let ingredientPos = new Phaser.Math.Vector2(dropZone.x - 45 + sprite.width / 2, (dropZone.y) / 1.6 - dropZone.originY - 5)
        sprite.setPosition(ingredientPos.x, ingredientPos.y)
        field.item = item

        let finalEffect = this.mixEffects()
        this.potionInfo = `hp: ${finalEffect.deltaHp}\nstr: ${finalEffect.deltaStrength}\nwis: ${finalEffect.deltaWisdom}`
        this.potion.setText(this.potionInfo)
    }

    private getField(bkgname: String): Field {
        for (let i of this.items) {
            if (i.backgroundImage.name === bkgname)
                return i
        }

        return null;
    }

    private mixEffects(): Effect {
        let effect = new Effect(0, 0, 0, Math.round(Math.random() * (4 - 1) + 1))

        for (let item of this.items) {
            if (item.item != null)
                this.sumEffect(effect, item.item.effect)
        }

        effect.deltaHp *= Math.round(1 + this.inventory.currentOwner.attributes.wisdom.value / 100)
        effect.deltaWisdom *= Math.round(1 + this.inventory.currentOwner.attributes.wisdom.value / 100)
        effect.deltaStrength *= Math.round(1 + this.inventory.currentOwner.attributes.wisdom.value / 100)

        return effect
    }

    private sumEffect(effect: Effect, itemEffect: Effect): void {
        effect.deltaHp += itemEffect.deltaHp
        effect.deltaStrength += itemEffect.deltaStrength
        effect.deltaWisdom += itemEffect.deltaWisdom
    }

    private hasAnyItemInArray(): boolean {
        return this.items.findIndex((value) => value != null) !== -1
    }

    private deleteRestOfItems() {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].item != null) {
                this.inventory.deleteItem(this.items[i].item)
                this.items[i].item = null
            }
        }
    }

    private onCraft(): void {

        if (this.hasAnyItemInArray())
            this.createPotion()
        this.container.updatePosition()

        // for now just get back to gamescene
        this.game.scene.pause('Crafting')

        this.scene.setVisible(false);
        this.game.scene.run('GameScene')
    }

    private onClose(): void {

        // for now just get back to gamescene
        this.game.scene.pause('Crafting', () => {
            this.container.updatePosition()
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