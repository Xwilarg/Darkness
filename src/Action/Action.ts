export default class Action {
    constructor (argCountMin: number, argCountMax: number, looseHP: boolean) {
        this.argCountMin = argCountMin
        this.argCountMax = argCountMax
        this.looseHP = looseHP
    }

    argCountMin: number
    argCountMax: number
    looseHP: boolean
}
