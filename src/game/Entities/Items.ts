import Ingredient from "./Ingredient";
import Item from "./Item";

import Effect from "../Components/Effect";

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
    let index = Math.round( Math.random() * (Items.length - 3) );
    return index;
}

/**
 * Loads items with names in array Items
 * @param {Phaser.Scene} scene 
 * @returns {void}
 */
export function loadItems(scene: Phaser.Scene): void {
    for (let i of Items)
        scene.load.image(i, `assets/items/${i}.png`);
}

/**
 * Returns a item with random effect
 * @param {number} x 
 * @param {number} y 
 * @param {Phaser.Scene} scene 
 * @returns {Item}
 */
export function getItemWithRandomEffect(x: number, y: number, scene: Phaser.Scene): Item {
    let index = getRandomItemIndex();
    let hp = Math.ceil(Math.random() * (10 + 4) - 4);
    let strength = Math.ceil(Math.random() * (10 + 4) - 4);
    let wisdom = Math.ceil(Math.random() * (10 + 4) - 4);
    let time = 0;

    while (time === 0) {
        time = Math.floor(Math.random() * (2 + 1) - 1)
    }

    return new Ingredient(new Effect(hp, strength, wisdom, time), scene.add.sprite(x, y, Items[index]).setOrigin(0, 0));
}