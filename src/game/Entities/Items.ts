import Effect from "../Components/Effect";
import { Inventory } from "../Components/Inventory";
import GameObject from "./GameObject";
import Ingredient from "./Ingredient";
import { IItem } from "./Item";

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


/**
 * Returns a item with random effect
 * @param {number} x 
 * @param {number} y 
 * @param {Phaser.Scene} scene 
 * @returns {Item}
 */
export function getItemWithRandomEffect(x: number, y: number, scene: Phaser.Scene): Ingredient {
    const index = getRandomItemIndex()
    const hp = Math.ceil(Math.random() * (10 + 4) - 4)
    const strength = Math.ceil(Math.random() * (10 + 4) - 4)
    const wisdom = Math.ceil(Math.random() * (10 + 4) - 4)
    let time = 0

    while (time === 0)
        time = Math.floor(Math.random() * (2 + 1) - 1)

    return new Ingredient(new Effect(hp, strength, wisdom, time), scene.add.image(x, y, Items[index]).setOrigin(0, 0))
}

export const ItemCherry: IItem = {
    name: "Cherry",
    imageKey: 'cherries',
    effect: new Effect(10, 5, 3, 1),
    used: (item: IItem, gameObject: GameObject) => {
        let effect = Effect.clone(item.effect)
        gameObject.attributes.addEffect(effect)

        gameObject.getComponent<Inventory>(Inventory.COMPONENT_NAME).deleteItem(item)
    }
}