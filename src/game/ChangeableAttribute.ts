import Phaser from 'phaser'


/**
 * Class for reading and writting value
 * It's used to send event, when value changed
 */
export default class ChangeableAttribute<T> extends Phaser.Events.EventEmitter {

    /**
     * Name of event
     * 
     * It's delegate can look like:
     * valueChanged(newValue: T): void
     */
    static readonly ATTRIBUTE_CHANGED = 'Changed'

    constructor(protected _property: T) { super() }

    get value(): T { return this._property }
    set value(newValue: T) {
        this._property = newValue
        this.emit(ChangeableAttribute.ATTRIBUTE_CHANGED, this._property)
    }
}