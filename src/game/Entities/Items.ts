import Impulse from '../Components/Effects/Impulse'
import GameObject from './GameObject'
import { Item } from './Item'

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
    
    for (const item of ITEMS) {
        Object.freeze(item.effect)
        Object.freeze(item.name)
        Object.freeze(item.imageKey)
    }
}


function useIngredient(ingredient: Item, gameObject: GameObject) {
    const effect = ingredient.effect.clone()

    if (!ingredient.firstTimeUsed) {

        if (effect instanceof Impulse)
            ingredient.description = `Heals ${effect['deltaHp']} and adds a ${effect['deltaStrength']} strength and a ${effect['deltaWisdom']} wisdom`

        ingredient.firstTimeUsed = true
    }

    gameObject.attributes.applyEffect(effect)
}


export const ItemCherry = {
    name: 'Cherry',
    imageKey: 'cherries',
    effect: new Impulse(10, 5, 0),
    firstTimeUsed: false,
    used: useIngredient
}

export const ItemOrange = {
    name: 'Orange',
    imageKey: 'orange',
    effect: new Impulse(3, 2, 5),
    firstTimeUsed: false,
    used: useIngredient
}

export const ItemRedFlower = {
    name: 'Red Flower',
    imageKey: 'red_flower',
    effect: new Impulse(4, 5, 3),
    firstTimeUsed: false,
    used: useIngredient
}

const ITEMS = [ItemCherry, ItemOrange, ItemRedFlower]

export function getRandomItem() {
    const index = Math.floor(Math.random() * ITEMS.length)

    return ITEMS[index]
}