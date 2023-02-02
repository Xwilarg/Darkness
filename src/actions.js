export default { getActions }

function getActions(screen) {
    return {
        "ASK": (args) => {
            if (this.is_on_stranger()) {
                if (this.strangerRelation === 0) {
                    screen.write_narration(`After a bit of time, you hear the ${this.item("stranger")} answering you`);
                    this.first_meeting();
                } else if (this.strangerRelation === 1) {
                    switch (this.clean(args[0])) {
                        case "WEATHER":
                            screen.write_dialogue("I miss the sunlight...");
                            break;

                        case "PRONOUN":
                            screen.write_dialogue("I don't really mind... You can use \"they/them\" when speaking to me...")
                            break;
                    }
                } else {
                    screen.write_narration("TODO");
                }
            } else {
                screen.write_narration("You speak but there is no one to answer you");
            }
        },
        "DEBUG": (_) => {
            if (window.location.hostname === "localhost") {
                screen.write_narration(`You close your eyes and feel instilled with divine knowledge<br/>You are at this.position (${this.pos.x} ; ${this.pos.y})<br/>Your this.forward direction is (${this.forward.x} ; ${this.forward.y})<br/>Target this.position is (${this.posStranger.x} ; ${this.posStranger.y})`);
            } else {
                screen.write_narration("You close your eyes but nothing change");
                this.decrease_hp();
            }
            return true;
        },
        "ITEMS": (_) => {
            screen.write_narration(`You check inside your pockets and find what feels like a round ${this.item("stone")}`);
            this.decrease_hp();
            return true;
        },
        "TOUCH": (args) => {
            switch (this.clean(args[0])) {
                case "GROUND":
                    screen.write_narration(`You touch the ${this.item("ground")}, it feels cold and hard`);
                    break;

                case "STONE":
                    screen.write_narration(`You take the ${this.item("stone")} from your pocket, it's been carved into a marble and feels somehow a bit warm`);
                    break;

                case "HANDS":
                    screen.write_narration(`Your take your ${this.item("hand")} into the other, they feel soft yet skinny enough so you can feel your veins`);
                    break;

                case "HEAD":
                    screen.write_narration(`You pass your ${this.item("hand")} in your ${this.item("hair")}, it's all tangled and would probably feel better if you were to brush it`);
                    break;

                case "BODY":
                    screen.write_narration(`You pass your ${this.item("hands")} over your ${this.item("clothes")}, you seem to be wearing a cotton pants and short-sleeves shirt`);
                    break;

                case "STRANGER":
                    if (this.strangerRelation === 0) {
                        screen.write_narration(`You put your ${this.item("hand")} on their shoulder, they jump a bit and quickly push your hand away before speaking to you`);
                        this.first_meeting();
                    } else {
                        screen.write_narration(`You put your ${this.item("hand")} on their shoulder, they jump a bit and push you away`);
                    }
                    break;

                default:
                    return false;
            }
            return true;
        },
        "USE": (args) => {
            if (this.clean(args[0]) === "STONE" && this.clean(args[1]) === "GROUND") {
                screen.write_narration(`You place the stone on the ground, when you take it back, you feel like it slightly moved to your ${this.item(this.dir_vector_to_text(this.pos_toward(this.pos.x, this.pos.y, this.posStranger.x, this.posStranger.y)).toLowerCase())}`);
                return true;
            }
            return false;
        },
        "WAIT": (_) => {
            if (this.is_on_stranger() && this.strangerRelation > 0) {
                screen.write_narration("You look into nothingness");
            } else {
                screen.write_narration("You look into nothingness and feel the darkness enveloping yourself");
                this.decrease_hp();
            }
            return true;
        },
        "MOVE": (args) => {
            let wasOnStranger = this.is_on_stranger();
            if (wasOnStranger && Math.floor(Math.random() * 10)) {
                screen.write_dialogue("Don't leave...");
            }

            if (args.length === 0) {
                screen.write_narration("You take a random direction and walk for a bit, you don't feel like anything changed around you");
                this.move_random();
            } else {
                const targetDir = this.text_to_dir_vector(args[0]);
                if (targetDir === null) {
                    return false;
                }

                this.pos.x += targetDir.x;
                this.pos.y += targetDir.y;
                this.forward.x = targetDir.x;
                this.forward.y = targetDir.y;

                if (this.is_on_stranger()) {
                    if (this.strangerRelation === 0) {
                        screen.write_narration(`You walk to your ${args[0].toLowerCase()}, you hear what feel like ${this.item("someone")} panting respiration`);
                    } else {
                        screen.write_narration(`You walk to your ${args[0].toLowerCase()} and hear the ${this.item("stranger")} greeting you with a low voice`);
                        screen.write_dialogue("Welcome back");
                    }
                } else {
                    screen.write_narration(`You walk to your ${args[0].toLowerCase()} but don't feel like anything changed around you`);
                }

                if (this.strangerRelation > 0) {
                    if (wasOnStranger) {
                        screen.write_narration("You feel the dreadness of the darkness as you leave your confort spot");
                    } else if (this.is_on_stranger()) {
                        screen.write_narration("You feel more at ease knowing you are not alone anymore");
                    }
                }
            }
            return true;
        }
    }
}