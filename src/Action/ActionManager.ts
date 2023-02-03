import CharacterManager from "../Character/CharacterManager";
import Screen from "../Screen";
import { clean, item } from "../Utils/parsing";
import Vector from "../Utils/Vector";

export default class ActionManager {
    getActions(screen: Screen, characterManager: CharacterManager): Record<string, (args: string[]) => boolean> {
        return {
            "ASK": (args: string[]) => {
                if (characterManager.is_player_on_stranger()) {
                    if (characterManager.get_relationship("stranger") === 0) {
                        screen.write_narration(`After a bit of time, you hear the ${item("stranger")} answering you`);
                        this.#first_meeting(screen, characterManager);
                    } else if (characterManager.get_relationship("stranger") === 1) {
                        switch (clean(args[0])) {
                            case "WEATHER":
                                screen.write_dialogue("I miss the sunlight...", "stranger");
                                break;
    
                            case "PRONOUN":
                                screen.write_dialogue("I don't really mind... You can use \"they/them\" when speaking to me...", "stranger")
                                break;
                        }
                    } else {
                        screen.write_narration("TODO");
                    }
                } else {
                    screen.write_narration("You speak but there is no one to answer you");
                }
                return true; // TODO
            },
            "DEBUG": (_) => {
                if (window.location.hostname === "localhost") {
                    screen.write_narration(`You close your eyes and feel instilled with divine knowledge<br/>You are at this.position ${characterManager.get_pos("me").to_string()}<br/>Your this.forward direction is ${characterManager.get_forward("me").to_string()}<br/>Target this.position is ${characterManager.get_pos("stranger")}`);
                } else {
                    screen.write_narration("You close your eyes but nothing change");
                    characterManager.decrease_player_hp(screen);
                }
                return true;
            },
            "ITEMS": (_) => {
                screen.write_narration(`You check inside your pockets and find what feels like a round ${item("stone")}`);
                return true;
            },
            "TOUCH": (args) => {
                switch (clean(args[0])) {
                    case "GROUND":
                        screen.write_narration(`You touch the ${item("ground")}, it feels cold and hard`);
                        break;
    
                    case "STONE":
                        screen.write_narration(`You take the ${item("stone")} from your pocket, it's been carved into a marble and feels somehow a bit warm`);
                        break;
    
                    case "HANDS":
                        screen.write_narration(`Your take your ${item("hand")} into the other, they feel soft yet skinny enough so you can feel your veins`);
                        break;
    
                    case "HEAD":
                        screen.write_narration(`You pass your ${item("hand")} in your ${item("hair")}, it's all tangled and would probably feel better if you were to brush it`);
                        break;
    
                    case "BODY":
                        screen.write_narration(`You pass your ${item("hands")} over your ${item("clothes")}, you seem to be wearing a cotton pants and short-sleeves shirt`);
                        break;
    
                    case "STRANGER":
                        if (characterManager.get_relationship("stranger") === 0) {
                            screen.write_narration(`You put your ${item("hand")} on their shoulder, they jump a bit and quickly push your hand away before speaking to you`);
                            this.#first_meeting(screen, characterManager);
                        } else {
                            screen.write_narration(`You put your ${item("hand")} on their shoulder, they jump a bit and push you away`);
                        }
                        break;
    
                    default:
                        return false;
                }
                return true;
            },
            "USE": (args) => {
                if (clean(args[0]) === "STONE" && clean(args[1]) === "GROUND") {
                    screen.write_narration(`You place the stone on the ground, when you take it back, you feel like it slightly moved to your ${item(this.#dir_vector_to_text(characterManager.get_pos_toward("me", "stranger"), characterManager.get_forward("me")).toLowerCase())}`);
                    return true;
                }
                return false;
            },
            "WAIT": (_) => {
                if (characterManager.is_player_on_stranger() && characterManager.get_relationship("stranger") > 0) {
                    screen.write_narration("You look into nothingness");
                } else {
                    screen.write_narration("You look into nothingness and feel the darkness enveloping yourself");
                    characterManager.decrease_player_hp(screen);
                }
                return true;
            },
            "MOVE": (args) => {
                let wasOnStranger = characterManager.is_player_on_stranger();
                if (wasOnStranger && Math.floor(Math.random() * 10)) {
                    screen.write_dialogue("Don't leave...", "stranger");
                }
    
                if (args.length === 0) {
                    screen.write_narration("You take a random direction and walk for a bit, you don't feel like anything changed around you");
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
                            screen.write_narration(`You walk to your ${args[0].toLowerCase()}, you hear what feel like ${item("someone")} panting respiration`);
                        } else {
                            screen.write_narration(`You walk to your ${args[0].toLowerCase()} and hear the ${item("stranger")} greeting you with a low voice`);
                            screen.write_dialogue("Welcome back", "stranger");
                        }
                    } else {
                        screen.write_narration(`You walk to your ${args[0].toLowerCase()} but don't feel like anything changed around you`);
                    }
    
                    if (characterManager.get_relationship("stranger") > 0) {
                        if (wasOnStranger) {
                            screen.write_narration("You feel the dreadness of the darkness as you leave your confort spot");
                        } else if (characterManager.is_player_on_stranger()) {
                            screen.write_narration("You feel more at ease knowing you are not alone anymore");
                        }
                    }
                }
                return true;
            }
        }
    }

    #dir_vector_to_text(p: Vector, forward: Vector) : string {
        if (forward.x === p.x && forward.y === p.y) {
            return "FRONT";
        }
        if (
            (forward.x === -p.x && forward.y === p.y) ||
            (forward.x === p.x && forward.y === -p.y)
        ) {
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

    #text_to_dir_vector(text: string, forward: Vector) : Vector | null {
        if (text === "FRONT") {
            return forward;
        }
        if (text === "BACK") {
            return new Vector(-forward.x, -forward.y)
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
        }

        return null;
    }

    #first_meeting(screen: Screen, characterManager: CharacterManager) : void {
        screen.write_dialogue("I.. didn't expect to find someone", "stranger");
        screen.write_narration("You feel more at ease knowing you are not alone anymore");
        characterManager.set_stranger_relationship(1);
    }
}