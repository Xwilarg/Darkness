export * from "./actions"
export { Screen } from "./Screen"

export class Game_Darkness {
    constructor() {
        let x = Math.floor(Math.random() * 10) - 5;
        let y = 5 - x * (Math.floor(Math.random() * 2) == 0 ? -1 : 1);
        this.posStranger = { x: x, y: y };

        this.screen = new Screen(this.on_input);

        this.screen.write_narration("You open your eyes, everything around you is pitch black that you can't even see your hands.<br/>You try to look into your memories but can't remember anything.<br/>What do you do?<br/><small>(Words in <b>bold</b> are items you can interact with, however some of them won't be mentionned until you do so)</small>");
    
    }

    screen;

    mentalHp = 15;

    current = "nowhere";
    forward = {
        x: 0,
        y: 1
    }

    actions = {
        "HELP": {
            "argCountMin": 0,
            "argCountMax": 0,
            "looseHP": false
        },
        "ITEMS": {
            "argCountMin": 0,
            "argCountMax": 0,
            "looseHP": true
        },
        "TOUCH": {
            "argCountMin": 1,
            "argCountMax": 1,
            "looseHP": true
        },
        "USE": {
            "argCountMin": 2,
            "argCountMax": 2,
            "looseHP": true
        },
        "WAIT": {
            "argCountMin": 0,
            "argCountMax": 0,
            "looseHP": true
        },
        "MOVE": {
            "argCountMin": 0,
            "argCountMax": 1,
            "looseHP": true
        },
        "DEBUG": {
            "argCountMin": 0,
            "argCountMax": 0,
            "looseHP": false
        },
        "ASK": {
            "argCountMin": 1,
            "argCountMax": 1,
            "looseHP": true
        }
    };

    pos = { x: 0, y: 0 };
    posStranger;

    strangerRelation = 0;

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    pos_toward(xMe, yMe, xTarget, yTarget) {
        var xDiff = Math.abs(xMe - xTarget);
        var yDiff = Math.abs(yMe - yTarget);
        if (xDiff > yDiff) {
            return { x: xMe > xTarget ? -1 : 1, y: 0 };
        }
        return { x: 0, y: yMe > yTarget ? -1 : 1 };
    }

    move_random() {
        let dist = distance(this.pos.x, this.pos.y, this.posStranger.x, this.posStranger.y);
        if (dist > 8) {
            let dir = this.pos_toward(this.pos.x, this.pos.y, this.posStranger.x, this.posStranger.y);
            this.pos.x += dir.x;
            this.pos.y += dir.y;
        }
        else if (dist < 3) {
            let dir = this.pos_toward(this.pos.x, this.pos.y, this.posStranger.x, this.posStranger.y);
            this.pos.x -= dir.x;
            this.pos.y -= dir.y;
        } else {
            let r = Math.floor(Math.random() * 4);
            if (r == 0) this.pos.x += 1;
            else if (r == 1) this.pos.x -= 1;
            else if (r == 2) this.pos.y += 1;
            else if (r == 3) this.pos.y -= 1;
        }
    }

    dir_vector_to_text(p) {
        if (this.forward.x === p.x && this.forward.y === p.y) {
            return "FRONT";
        }
        if (
            (this.forward.x === -p.x && this.forward.y === p.y) ||
            (this.forward.x === p.x && this.forward.y === -p.y)
        ) {
            return "BACK";
        }
        if (
            (this.forward.y === 1 && p.x === -1) ||
            (this.forward.y === -1 && p.x === 1) ||
            (this.forward.x === 1 && p.y === -1) ||
            (this.forward.x === -1 && p.y === 1)
        ) {
            return "LEFT";
        }
        return "RIGHT";
    }

    text_to_dir_vector(text) {
        if (text === "FRONT") {
            return this.forward;
        }
        if (text === "BACK") {
            return {
                x: -this.forward.x,
                y: -this.forward.y
            };
        }
        let targetX = 0;
        let targetY = 0;
        if (text === "LEFT") {
            if (this.forward.y === 1) targetX = -1;
            else if (this.forward.y === -1) targetX = 1;
            if (this.forward.x === 1) targetY = -1;
            else if (this.forward.x === -1) targetY = 1;
        } else if (text === "RIGHT") {
            if (this.forward.y === 1) targetX = 1;
            else if (this.forward.y === -1) targetX = -1;
            if (this.forward.x === 1) targetY = 1;
            else if (this.forward.x === -1) targetY = -1;
        } else {
            return null;
        }

        return {
            x: targetX,
            y: targetY
        };
    }

    clean(word) {
        switch (word) {
            case "FLOOR": case "GROUND":
                return "GROUND";

            case "STONE": case "ROCK": case "MARBLE":
                return "STONE";

            case "HAND": case "HANDS": case "FINGER": case "FINGERS":
                return "HANDS";

            case "HAIR": case "HEAD":
                return "HEAD";

            case "BODY": case "SELF": case "CLOTHES":
                return "BODY";

            case "STRANGER": case "SOMEONE":
                return "STRANGER";

            case "PRONOUN": case "PRONOUNS":
                return "PRONOUN";

            case "WEATHER":
                return "WEATHER";

            default: return word;
        }
    }

    is_on_stranger() {
        return this.pos.x === this.posStranger.x && this.pos.y === this.posStranger.y;
    }

    first_meeting() {
        this.screen.write_dialogue("I.. didn't expect to find someone", "stranger");
        this.screen.write_narration("You feel more at ease knowing you are not alone anymore");
        this.strangerRelation = 1;
    }

    decrease_hp() {
        if (this.is_on_stranger() && this.strangerRelation > 1) { // Prevent loosing HP
            return;
        }

        this.mentalHp--;
        if (this.mentalHp % 5 === 0) {
            this.screen.write_narration("You feel darkness consuming your soul a bit more");
        }
        if (this.mentalHp === 0) {
            this.screen.write_narration(`You curl up on the ${this.item("ground")} and close your eyes, trying to feel the last of hope you still have inside you`);
        }
    }

    to_sentence_case(text) {
        return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    }

    item(word) {
        return `<b>${word}</b>`;
    }

    argument_text(action) {
        if (action.argCountMin === action.argCountMax) {
            return `${action.argCountMin} argument${(action.argCountMin > 1 ? "s" : "")}`;
        }
        return `${action.argCountMin} to ${action.argCountMax} argument${(action.argCountMax > 1 ? "s" : "")}`;
    }

    on_input() {
        const text = this.rpgInput.value.toUpperCase().trim().split(' ');
        let input = text[0];
        let args = text.slice(1);

        if (input === "")
        {
            return; // Empty input, we just ignore it
        }

        try
        {
            this.screen.write_input(input, args);
            if (this.mentalHp === 0)
            {
                this.screen.write_narration("There is no hope");
            }
            else if (!(input in this.actions))
            {
                this.screen.write_narration("Unknown action, enter \"Help\" for the list of actions");
            }
            else if (args.length < this.actions[input].argCountMin || args.length > this.actions[input].argCountMax)
            {
                this.screen.write_narration(`${this.to_sentence_case(input)} takes ${this.argument_text(this.actions[input])}`);
            }
            else
            {
                if (input === "USE" && this.clean(args[0]) === "HANDS") { // Using your hands on smth is the same as touching it
                    input = "TOUCH";
                    args = [args[1]];
                }

                let choices = this.locations[this.current];
                if (!(input in choices) || !choices[input](args)) {
                    switch (input)
                    {
                        case "HELP":
                            this.screen.write_narration(`Possible actions:<br/>${Object.keys(this.actions).map(x => `${this.to_sentence_case(x)} (${this.argument_text(this.actions[x])})`).join("<br/>")}`);
                            break;

                        default:
                            this.screen.write_narration("You can't do that here");
                            break;
                    }
                    if (this.actions[input].looseHP) {
                        this.decrease_hp();
                    }
                }
            }
        } catch (error) {
            this.rpgDiv.innerHTML += `<span class="rpg-error">An error occured:<br/>${error}</span><br/><br/>`;
        }

        this.clear_input();
    }
}