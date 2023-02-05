import Vector from "../Utils/Vector";
import Character from "./Character";
import type Screen from "../Screen";
import { item } from "../Utils/parsing";

export default class CharacterManager {
    constructor() {
        const x = Math.floor(Math.random() * 10) - 5;
        const y = 5 - x * (Math.floor(Math.random() * 2) === 0 ? -1 : 1);
        this.#stranger = new Character(1, new Vector(x, y));

        this.#me = new Character(15);
    }

    #string_to_character(value: "me" | "stranger"): Character {
        switch (value) {
            case "me":
                return this.#me;
            case "stranger":
                return this.#stranger;
        }
    }

    get_forward(target: "me" | "stranger"): Vector {
        return this.#string_to_character(target).get_forward();
    }

    set_forward(target: "me" | "stranger", value: Vector): void {
        this.#string_to_character(target).set_forward(value);
    }

    get_pos(target: "me" | "stranger"): Vector {
        return this.#string_to_character(target).get_pos();
    }

    get_relationship(target: "stranger"): number {
        return this.#string_to_character(target).get_relationship();
    }

    move(target: "me" | "stranger", value: Vector): void {
        const cTarget = this.#string_to_character(target);
        cTarget.set_pos(cTarget.get_pos().add(value));
    }

    get_pos_toward(
        target: "me" | "stranger",
        reference: "me" | "stranger"
    ): Vector {
        const c1 = this.#string_to_character(target);
        const c2 = this.#string_to_character(reference);
        return c1.get_pos_toward(c2.get_pos());
    }

    is_player_alive(): boolean {
        return this.#me.is_alive();
    }

    is_player_on_stranger(): boolean {
        return this.#me.get_pos().equals(this.#stranger.get_pos());
    }

    set_stranger_relationship(value: number): void {
        this.#stranger.set_relationship(value);
    }

    move_player_random(): void {
        this.#me.move_random(this.#stranger.get_pos());
    }

    decrease_player_hp(screen: Screen): void {
        if (
            this.is_player_on_stranger() &&
            this.#stranger.get_relationship() > 0
        ) {
            // Prevent loosing HP
            return;
        }

        const hp = this.#me.decrease_mental_hp();
        if (hp % 5 === 0) {
            screen.write_narration(
                "You feel darkness consuming your soul a bit more"
            );
        }
        if (hp === 0) {
            screen.write_narration(
                `You curl up on the ${item(
                    "ground"
                )} and close your eyes, trying to feel the last of hope you still have inside you`
            );
        }
    }

    #me: Character;
    #stranger: Character;
}
