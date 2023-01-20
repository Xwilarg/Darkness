let rpgDiv;
let rpgInput;

let mentalHp = 15;

let current = "nowhere";
let forward = {
    x: 0,
    y: 1
}

let actions = {
    "HELP": {
        "argCountMin": 0,
        "argCountMax": 0
    },
    "ITEMS": {
        "argCountMin": 0,
        "argCountMax": 0
    },
    "TOUCH": {
        "argCountMin": 1,
        "argCountMax": 1
    },
    "USE": {
        "argCountMin": 2,
        "argCountMax": 2
    },
    "WAIT": {
        "argCountMin": 0,
        "argCountMax": 0
    },
    "MOVE": {
        "argCountMin": 0,
        "argCountMax": 1
    },
    "DEBUG": {
        "argCountMin": 0,
        "argCountMax": 0
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
        let dir = rpg_pos_toward(pos.x, pos.y, posStranger.x, posStranger.y);
        pos.x += dir.x;
        pos.y += dir.y;
    }
    else if (dist < 3) {
        let dir = rpg_pos_toward(pos.x, pos.y, posStranger.x, posStranger.y);
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

function rpg_dir_vector_to_text(pos) {
    if (forward.x === pos.x && forward.y === pos.y) {
        return "FRONT";
    }
    if (
        (forward.x === -pos.x && forward.y === pos.y) ||
        (forward.x === pos.x && forward.y === -pos.y)
    ) {
        return "BACK";
    }
    if (
        (forward.y === 1 && pos.x === -1) ||
        (forward.y === -1 && pos.x === 1) ||
        (forward.x === 1 && pos.y === -1) ||
        (forward.x === -1 && pos.y === 1)
    ) {
        return "LEFT";
    }
    return "RIGHT";
}

function rpg_text_to_dir_vector(text) {
    if (text === "FRONT") {
        return forward;
    }
    if (text === "BACK") {
        return {
            x: -forward.x,
            y: -forward.y
        };
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

    return {
        x: targetX,
        y: targetY
    };
}

function rpg_clean(word) {
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

        default: return word;
    }
}

let locations = {
    "nowhere": {
        "DEBUG": (_) => {
            if (window.location.hostname === "localhost") {
                rpg_write_narration(`You close your eyes and feel instilled with divine knowledge<br/>You are at position (${pos.x} ; ${pos.y})<br/>Your forward direction is (${forward.x} ; ${forward.y})<br/>Target position is (${posStranger.x} ; ${posStranger.y})`);
            } else {
                rpg_write_narration("You close your eyes but nothing change");
                decrease_hp();
            }
            return true;
        },
        "ITEMS": (_) => {
            rpg_write_narration(`You check inside your pockets and find what feels like a round ${rpg_item("stone")}`);
            decrease_hp();
            return true;
        },
        "TOUCH": (args) => {
            switch (rpg_clean(args[0]))
            {
                case "GROUND":
                    rpg_write_narration(`You touch the ${rpg_item("ground")}, it feels cold and hard`);
                    break;

                case "STONE":
                    rpg_write_narration(`You take the ${rpg_item("stone")} from your pocket, it's been carved into a marble and feels somehow a bit warm`);
                    break;

                case "HANDS":
                    rpg_write_narration(`Your take your ${rpg_item("hand")} into the other, they feel soft yet skinny enough so you can feel your veins`);
                    break;

                case "HEAD":
                    rpg_write_narration(`You pass your ${rpg_init("hand")} in your ${rpg_init("hair")}, it's all tangled and would probably feel better if you were to brush it`);

                case "BODY":
                    rpg_write_narration(`You pass your ${rpg_init("hands")} over your ${rpg_init("clothes")}, you seem to be wearing a cotton pants and short-sleeves shirt`);

                default:
                    return false;
            }
            decrease_hp();
            return true;
        },
        "USE": (args) => {
            if (rpg_clean(args[0]) === "STONE" && rpg_clean(args[1]) === "GROUND") {
                rpg_write_narration(`You place the stone on the ground, when you take it back, you feel like it slightly moved to your ${rpg_item(rpg_dir_vector_to_text(rpg_pos_toward(pos.x, pos.y, posStranger.x, posStranger.y)).toLowerCase())}`);
                decrease_hp();
                return true;
            }
            return false;
        },
        "WAIT": (_) => {
            rpg_write_narration("You gaze into nothingness and count the seconds");
            decrease_hp();
            return true;
        },
        "MOVE": (args) => {
            if (args.length === 0) {
                rpg_write_narration("You take a random direction and walk for a bit, you don't feel like anything changed around you");
                rpg_move_random();
            } else {
                const targetDir = rpg_text_to_dir_vector(args[0]);
                if (targetDir === null) {
                    return false;
                }
                rpg_write_narration(`You walk to your ${args[0].toLowerCase()} but don't feel like anything changed around you`);
                pos.x += targetDir.x;
                pos.y += targetDir.y;
                forward.x = targetDir.x;
                forward.y = targetDir.y;
            }
            if (pos.x === posStranger.x && pos.y === posStranger.y) { // Shouldn't happen in random move since we rig it but might as well be safe
                rpg_write_narration("TODO");
            }
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
    document.getElementById("rpg-input").addEventListener("keyup", (e) => {
        if (e.code === "Enter") {
            rpg_on_input();
        }
    })
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

function rpg_argument_text(action) {
    if (action.argCountMin === action.argCountMax) {
        return `${action.argCountMin} argument${(action.argCountMin > 1 ? "s" : "")}`;
    }
    return `${action.argCountMin} to ${action.argCountMax} argument${(action.argCountMax > 1 ? "s" : "")}`;
}

function rpg_on_input() {
    const text = rpgInput.value.toUpperCase().trim().split(' ');
    const input = text[0];
    const args = text.slice(1);

    if (input === "")
    {
        return; // Empty input, we just ignore it
    }

    rpgDiv.innerHTML += `<b>> ${input} ${args}</b><br/>`;
    if (mentalHp === 0)
    {
        rpg_write_narration("There is no hope");
    }
    else if (!(input in actions))
    {
        rpg_write_narration("Unknown action, enter \"Help\" for the list of actions");
    }
    else if (args.length < actions[input].argCountMin || args.length > actions[input].argCountMax)
    {
        rpg_write_narration(`${to_sentence_case(input)} takes ${rpg_argument_text(actions[input])}`);
    }
    else
    {
        if (input === "USE" && rpg_clean(args[0]) === "HANDS") { // Using your hands on smth is the same as touching it
            input = "TOUCH";
            args = [args[1]];
        }

        let choices = locations[current];
        if (!(input in choices) || !choices[input](args)) {
            switch (input)
            {
                case "ITEMS":
                    rpg_write_narration("You don't have anything");
                    break;

                case "HELP":
                    rpg_write_narration(`Possible actions:<br/>${Object.keys(actions).map(x => `${to_sentence_case(x)} (${rpg_argument_text(actions[x])})`).join("<br/>")}`);
                    break;

                default:
                    rpg_write_narration("You can't do that here");
                    break;
            }
        }
    }

    clear_input();
}

