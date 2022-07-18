

export interface Component {
    /**
     * A unique name of the component
     */
    getName(): string

    destroy(): void
}
