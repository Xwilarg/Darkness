import type CharacterManager from "../Character/CharacterManager";
import getString from "../Data/strings";
import type Screen from "../Screen";
import { clean } from "../Utils/parsing";
import Vector from "../Utils/Vector";

export default class ActionManager {
    getActions(screen: Screen, characterManager: CharacterManager): Record<string, (args: string[]) => boolean> {
        return {
            ASK: (args: string[]) => {
                if (characterManager.is_player_on_stranger()) {
                    if (characterManager.get_relationship("stranger") === 0) {
                        screen.write_narration(getString("ASK_0"));
                        this.#first_meeting(screen, characterManager);
                    } else if (characterManager.get_relationship("stranger") === 1) {
                        switch (clean(args[0])) {
                            case "WEATHER":
                                screen.write_dialogue(getString("ASK_WEATHER_1"), "stranger");
                                break;

                            case "PRONOUN":
                                screen.write_dialogue(getString("ASK_PRONOUN_1"), "stranger");
                                break;
                        }
                    } else {
                        screen.write_narration("TODO");
                    }
                } else {
                    screen.write_narration(getString("ASK_NONE"));
                }
                return true; // TODO
            },
            DEBUG: (_) => {
                if (window.location.hostname === "localhost") {
                    screen.write_narration(
                        `You close your eyes and feel instilled with divine knowledge<br/>You are at this.position ${characterManager
                            .get_pos("me")
                            .to_string()}<br/>Your this.forward direction is ${characterManager
                            .get_forward("me")
                            .to_string()}<br/>Target this.position is ${characterManager.get_pos("stranger").to_string()}`
                    );
                } else {
                    screen.write_narration("You close your eyes but nothing change");
                    characterManager.decrease_player_hp(screen);
                }
                return true;
            },
            ITEMS: (_) => {
                screen.write_narration(getString("ITEMS"));
                return true;
            },
            TOUCH: (args) => {
                switch (clean(args[0])) {
                    case "GROUND":
                        screen.write_narration(getString("TOUCH_GROUND"));
                        break;

                    case "STONE":
                        screen.write_narration(getString("TOUCH_STONE"));
                        break;

                    case "HANDS":
                        screen.write_narration(getString("TOUCH_HANDS"));
                        break;

                    case "HEAD":
                        screen.write_narration(getString("TOUCH_HEAD"));
                        break;

                    case "BODY":
                        screen.write_narration(getString("TOUCH_BODY"));
                        break;

                    case "STRANGER":
                        if (characterManager.is_player_on_stranger()) {
                            return false;
                        } else if (characterManager.get_relationship("stranger") === 0) {
                            screen.write_narration(getString("TOUCH_STRANGER_0"));
                            this.#first_meeting(screen, characterManager);
                        } else {
                            screen.write_narration(getString("TOUCH_STRANGER_1"));
                        }
                        break;

                    default:
                        return false;
                }
                return true;
            },
            USE: (args) => {
                if (clean(args[0]) === "STONE" && clean(args[1]) === "GROUND") {
                    screen.write_narration(
                        getString("USE_STONE_GROUND", [
                            this.#dir_vector_to_text(
                                characterManager.get_pos_toward("me", "stranger"),
                                characterManager.get_forward("me")
                            ).toLowerCase(),
                        ])
                    );
                    return true;
                }
                return false;
            },
            WAIT: (_) => {
                if (characterManager.is_player_on_stranger() && characterManager.get_relationship("stranger") > 0) {
                    screen.write_narration(getString("WAIT_STRANGER_NONE"));
                } else {
                    screen.write_narration(getString("WAIT_STRANGER_0"));
                    characterManager.decrease_player_hp(screen);
                }
                return true;
            },
            MOVE: (args) => {
                const wasOnStranger = characterManager.is_player_on_stranger();
                if (wasOnStranger && characterManager.get_relationship("stranger") > 1 && Math.floor(Math.random() * 10) === 0) {
                    screen.write_dialogue(getString("MOVE_STRANGER_SPE"), "stranger");
                }

                if (args.length === 0) {
                    screen.write_narration(getString("MOVE_RANDOM"));
                    characterManager.move_player_random();
                } else {
                    const targetDir = this.#text_to_dir_vector(args[0], characterManager.get_forward("me"));
                    if (targetDir === null) {
                        return false;
                    }

                    characterManager.move("me", targetDir);
                    characterManager.set_forward("me", targetDir);

                    if (characterManager.is_player_on_stranger()) {
                        if (characterManager.get_relationship("stranger") === 0) {
                            screen.write_narration(getString("MOVE_STRANGER_0", [args[0].toLowerCase()]));
                        } else {
                            screen.write_narration(getString("MOVE_STRANGER_1", [args[0].toLowerCase()]));
                            screen.write_dialogue(getString("MOVE_STRANGER_GREETINGS"), "stranger");
                        }
                    } else {
                        screen.write_narration(getString("MOVE_DIRECTION", [args[0].toLowerCase()]));
                    }

                    if (characterManager.get_relationship("stranger") > 0) {
                        if (wasOnStranger) {
                            screen.write_narration(getString("MOVE_DARKNESS_ON"));
                        } else if (characterManager.is_player_on_stranger()) {
                            screen.write_narration(getString("MOVE_DARKNESS_OFF"));
                        }
                    }
                }
                return true;
            },
        };
    }

    #dir_vector_to_text(p: Vector, forward: Vector): string {
        if (forward.x === p.x && forward.y === p.y) {
            return "FRONT";
        }
        if ((forward.x === -p.x && forward.y === p.y) || (forward.x === p.x && forward.y === -p.y)) {
            return "BACK";
        }
        if (
            (forward.y === 1 && p.x === -1) ||
            (forward.y === -1 && p.x === 1) ||
            (forward.x === 1 && p.y === -1) ||
            (forward.x === -1 && p.y === 1)
        ) {
            return "LEFT";
        }
        return "RIGHT";
    }

    #text_to_dir_vector(text: string, forward: Vector): Vector | null {
        if (text === "FRONT") {
            return forward;
        }
        if (text === "BACK") {
            return new Vector(-forward.x, -forward.y);
        }
        let targetX = 0;
        let targetY = 0;
        if (text === "LEFT") {
            if (forward.y === 1) targetX = -1;
            else if (forward.y === -1) targetX = 1;
            if (forward.x === 1) targetY = -1;
            else if (forward.x === -1) targetY = 1;
        } else if (text === "RIGHT") {
            if (forward.y === 1) targetX = 1;
            else if (forward.y === -1) targetX = -1;
            if (forward.x === 1) targetY = 1;
            else if (forward.x === -1) targetY = -1;
        } else {
            return null;
        }

        return new Vector(targetX, targetY);
    }

    #first_meeting(screen: Screen, characterManager: CharacterManager): void {
        screen.write_dialogue(getString("FIRST_MEETING_0"), "stranger");
        screen.write_narration(getString("FIRST_MEETING_1"));
        characterManager.set_stranger_relationship(1);
    }
}
