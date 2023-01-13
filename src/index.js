let rpgDiv;
let rpgInput;

let mentalHp = 20;

let current = "nowhere";

let actions = {
    "HELP": {
        "argCount": 0
    },
    "ITEMS": {
        "argCount": 0
    },
    "TOUCH": {
        "argCount": 1
    },
    "USE": {
        "argCount": 2
    },
    "WAIT": {
        "argCount": 0
    },
    "WALK": {
        "argCount": 0
    }
};

let pos = { x: 0, y: 0 };
let posStranger;

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function rpg_pos_toward(xMe, yMe, xTarget, yTarget) {
    var xDiff = Math.abs(xMe - xTarget);
    var yDiff = Math.abs(yMe - yTarget);
    if (xDiff > yDiff) {
        return { x: xMe > xTarget ? -1 : 1, y: 0 };
    }
    return { x: 0, y: yMe > yTarget ? -1 : 1 };
}

function rpg_move_random() {
    let dist = distance(pos.x, pos.y, posStranger.x, posStranger.y);
    if (dist > 8) {
        let dir = rpg_pos_toward();
        pos.x += dir.x;
        pos.y += dir.y;
    }
    else if (dist < 3) {
        let dir = rpg_pos_toward();
        pos.x -= dir.x;
        pos.y -= dir.y;
    } else {
        let r = Math.floor(Math.random() * 4);
        if (r == 0) pos.x += 1;
        else if (r == 1) pos.x -= 1;
        else if (r == 2) pos.y += 1;
        else if (r == 3) pos.y -= 1;
    }
}

function rpg_clean(word) {
    switch (word) {
        case "FLOOR": case "GROUND":
            return "GROUND";

        case "STONE": case "ROCK": case "MARBLE":
            return "STONE";

        default: return word;
    }
}

let locations = {
    "nowhere": {
        "ITEMS": (_) => {
            rpg_write_narration(`You check inside your pockets and find what feel like a round ${rpg_item("stone")}`);
            decrease_hp();
            return true;
        },
        "TOUCH": (args) => {
            switch (rpg_clean(args[0]))
            {
                case "GROUND":
                    rpg_write_narration(`You touch the ${rpg_item("ground")}, it feels cold and hard`);
                    decrease_hp();
                    break;

                case "STONE":
                    rpg_write_narration(`You take the ${rpg_item("stone")} from your pocket, it's been carved into a marble and feels somehow a bit warm`);
                    decrease_hp();
                    break;

                default:
                    return false;
            }
            return true;
        },
        "USE": (args) => {
            if (rpg_clean(args[0]) === "STONE" && rpg_clean(args[1]) === "GROUND") {
                rpg_write_narration(`TODO`);
                decrease_hp();
            }
            return false;
        },
        "WAIT": (_) => {
            rpg_write_narration("You gaze into nothingness and count the seconds");
            decrease_hp();
            return true;
        },
        "WALK": (_) => {
            rpg_write_narration("You take a random direction and walk for a bit, you don't feel like anything changed around you");
            rpg_move_random();
            console.log(pos);
            decrease_hp();
            return true;
        }
    }
};

function rpg_init() {
    let x = Math.floor(Math.random() * 10) - 5;
    let y = 5 - x * (Math.floor(Math.random() * 2) == 0 ? -1 : 1);
    posStranger = { x: x, y: y };

    document.getElementById("rpg-enter").addEventListener("click", rpg_on_input);
    rpgInput = document.getElementById("rpg-input-field");
    rpgDiv = document.getElementById("rpg-output");

    let canvas = document.getElementById("rpg-mini-map");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rpg_write_narration("You open your eyes, everything around you is pitch black that you can't even see your hands.<br/>You try to look into your memories but can't remember anything.<br/>What do you do?<br/><small>(Words in <b>bold</b> are items you can interact with, however some of them won't be mentionned until you do so)</small>");
}

function rpg_write_narration(text) {
    rpgDiv.innerHTML += `${text}<br/><br/>`;
}

function decrease_hp() {
    mentalHp--;
    if (mentalHp % 5 === 0) {
        rpg_write_narration("You feel darkness consuming your soul a bit more");
    }
    if (mentalHp === 0) {
        rpg_write_narration(`You curl up on the ${rpg_item("ground")} and close your eyes, trying to feel the last of hope you still have inside you`);
    }
}

function clear_input() {
    rpgInput.value = "";
    rpgDiv.scrollTop = rpgDiv.scrollHeight;
    rpgInput.focus();
}

function to_sentence_case(text) {
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}

function rpg_item(word) {
    return `<b>${word}</b>`;
}

function rpg_on_input() {
    const text = rpgInput.value.toUpperCase().split(' ');
    const input = text[0];
    const args = text.slice(1);

    if (input === "")
    {
        return; // Empty input, we just ignore it
    }

    rpgDiv.innerHTML += `<b>> ${input}</b><br/>`;
    if (mentalHp === 0)
    {
        rpg_write_narration("There is no hope");
    }
    else if (!(input in actions))
    {
        rpg_write_narration("Unknown action, enter \"Help\" for the list of actions");
    }
    else if (actions[input].argCount !== args.length)
    {
        rpg_write_narration(`${to_sentence_case(input)} takes ${actions[input].argCount} argument${(actions[input].argCount > 1 ? "s" : "")}`);
    }
    else
    {
        let choices = locations[current];
        if (!(input in choices) || !choices[input](args)) {
            switch (input)
            {
                case "ITEMS":
                    rpg_write_narration("You don't have anything");
                    break;

                case "HELP":
                    rpg_write_narration(`Possible actions:<br/>${Object.keys(actions).map(x => to_sentence_case(x)).join("<br/>")}`);
                    break;

                default:
                    rpg_write_narration("You can't do that here");
                    break;
            }
        }
    }

    clear_input();
}

