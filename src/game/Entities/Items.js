import Effect from "../Components/Effect";
import Ingredient from "./Ingredient";
import Item from "./Item";

export const Items = [
    'cherries',
    'orange',
    'red_flower',
    'potion'
]

/**
 * Returns random index of Items.
 * @returns {number}
 */
export function getRandomItemIndex() {
    let index = Math.round( Math.random() * (Items.length - 1) );
    return index;
}

/**
 * Loads items with names in array Items
 * @param {Phaser.Scene} scene 
 * @returns {void}
 */
export function loadItems(scene) {
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
export function getItemWithRandomEffect(x, y, scene) {
    let index = getRandomItemIndex();
    let hp = Math.ceil(Math.random() * (10 + 10) - 10);
    let strength = Math.ceil(Math.random() * (10 + 10) - 10);
    let wisdom = Math.ceil(Math.random() * (10 + 10) - 10);
    let time = Math.floor(Math.random() * (2 + 1) - 1);

    return new Ingredient(new Effect(hp, strength, wisdom, time), scene.add.sprite(x, y, Items[index]).setOrigin(0, 0));
}