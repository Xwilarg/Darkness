export default class Vector {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(pos: Vector): boolean {
        return this.x === pos.x && this.y === pos.y;
    }

    add(pos: Vector): Vector {
        return new Vector(this.x + pos.x, this.y + pos.y);
    }

    to_string(): string {
        return `(${this.x} ; ${this.y})`;
    }

    x: number;
    y: number;
}
