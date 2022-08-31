import Effect from "../Components/Effect";
import { Inventory } from "../Components/Inventory";
import GameObject from "./GameObject";
import { Item } from "./Item";

export const Items = [
    'cherries',
    'orange',
    'red_flower',
    'potion',
    'teleport-stone',
    'bush'
]


/**
 * Returns random index of Items.
 * @returns {number}
 */
export function getRandomItemIndex(): number {
    const index = Math.round(Math.random() * (Items.length - 3))
    return index
}


/**
 * Loads items with names in array Items
 * @param {Phaser.Scene} scene 
 * @returns {void}
 */
export function loadItems(scene: Phaser.Scene): void {
    for (const i of Items)
        scene.load.image(i, `assets/items/${i}.png`)
}


export const ItemCherry = {
    name: "Cherry",
    imageKey: 'cherries',
    effect: new Effect(10, 5, 3, 1),
    firstTimeUsed: false,
    description: undefined,
    used: function(item: Item, gameObject: GameObject) {
        let effect = Effect.clone(item.effect)

        if (!this.firstTimeUsed) {
            this.description = `Heals ${effect.deltaHp} and adds a ${effect.deltaStrength} strength and a ${effect.deltaWisdom} wisdom`
            this.firstTimeUsed = true
        }

        gameObject.attributes.addEffect(effect)

        gameObject.getComponent<Inventory>(Inventory.COMPONENT_NAME).deleteItem(item)
    }
}