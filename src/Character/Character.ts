import Vector from '../Utils/Vector'

export default class Character {
    constructor (mentalHp: number, pos: Vector = new Vector(0, 0)) {
        this.#pos = pos
        this.#mentalHp = mentalHp
    }

    #mentalHp: number
    #pos: Vector
    #forward: Vector = new Vector(0, 1)
    #playerRelationship: number = 0

    /**
     * Get the distance between 2 points
     */
    #distance (a: Vector, b: Vector): number {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
    }

    get_pos_toward (target: Vector): Vector {
        const xDiff = Math.abs(this.#pos.x - target.x)
        const yDiff = Math.abs(this.#pos.y - target.y)
        if (xDiff > yDiff) {
            return new Vector(this.#pos.x > target.x ? -1 : 1, 0)
        }
        return new Vector(0, this.#pos.y > target.y ? -1 : 1)
    }

    get_relationship (): number {
        return this.#playerRelationship
    }

    set_relationship (value: number): void {
        this.#playerRelationship = value
    }

    is_alive (): boolean {
        return this.#mentalHp > 0
    }

    decrease_mental_hp (): number {
        this.#mentalHp--
        return this.#mentalHp
    }

    get_pos (): Vector {
        return this.#pos
    }

    set_pos (value: Vector): void {
        this.#pos = value
    }

    get_forward (): Vector {
        return this.#forward
    }

    set_forward (value: Vector): void {
        this.#forward = value
    }

    move_random (otherPos: Vector): void {
        const dist = this.#distance(this.#pos, otherPos)
        if (dist > 8) {
            const dir = this.get_pos_toward(otherPos)
            this.#pos.x += dir.x
            this.#pos.y += dir.y
        } else if (dist < 3) {
            const dir = this.get_pos_toward(otherPos)
            this.#pos.x -= dir.x
            this.#pos.y -= dir.y
        } else {
            const r = Math.floor(Math.random() * 4)
            if (r === 0) this.#pos.x += 1
            else if (r === 1) this.#pos.x -= 1
            else if (r === 2) this.#pos.y += 1
            else if (r === 3) this.#pos.y -= 1
        }
    }
}
