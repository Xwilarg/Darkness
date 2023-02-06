import { item } from "../Utils/parsing";

export default function getString(key: string, args: string[] = []): string {
    switch (key) {
        case "GAMEOVER":
            return "There is no hope";
        case "INTRODUCTION":
            return (
                "You open your eyes, everything around you is pitch black that you can't even see your hands.<br/>" +
                "You try to look into your memories but can't remember anything.<br/>" +
                "What do you do?<br/>" +
                "<small>(Words in <b>bold</b> are items you can interact with, however some of them won't be mentionned until you do so)</small>"
            );

        case "LOOSE_HP":
            return "You feel darkness consuming your soul a bit more";
        case "NO_HP":
            return `You curl up on the ${item("ground")} and close your eyes, trying to feel the last of hope you still have inside you`;

        case "ASK_NONE":
            return "You speak but there is no one to answer you";
        case "ASK_0":
            return `After a bit of time, you hear the ${item("stranger")} answering you`;
        case "ASK_WEATHER_1":
            return "I miss the sunlight...";
        case "ASK_PRONOUN_1":
            return 'I don\'t really mind... You can use "they/them" when speaking to me...';

        case "ITEMS":
            return `You check inside your pockets and find what feels like a round ${item("stone")}`;

        case "TOUCH_GROUND":
            return `You touch the ${item("ground")}, it feels cold and hard`;
        case "TOUCH_STONE":
            return `You take the ${item("stone")} from your pocket, it's been carved into a marble and feels somehow a bit warm`;
        case "TOUCH_HANDS":
            return `Your take your ${item("hand")} into the other, they feel soft yet skinny enough so you can feel your veins`;
        case "TOUCH_HEAD":
            return `You pass your ${item("hand")} in your ${item("hair")}, it's all tangled and would probably feel better if you were to brush it`;
        case "TOUCH_BODY":
            return `You pass your ${item("hands")} over your ${item("clothes")}, you seem to be wearing a cotton pants and short-sleeves shirt`;
        case "TOUCH_STRANGER_0":
            return `You put your ${item("hand")} on their shoulder, they jump a bit and quickly push your hand away before speaking to you`;
        case "TOUCH_STRANGER_1":
            return `You put your ${item("hand")} on their shoulder, they jump a bit and push you away`;

        case "USE_STONE_GROUND":
            return `You place the stone on the ground, when you take it back, you feel like it slightly moved to your ${item(args[0])}`;

        case "WAIT_STRANGER_NONE":
            return "You look into nothingness";
        case "WAIT_STRANGER_0":
            return "You look into nothingness and feel the darkness enveloping yourself";

        case "MOVE_STRANGER_SPE":
            return "Don't leave...";
        case "MOVE_RANDOM":
            return "You take a random direction and walk for a bit, you don't feel like anything changed around you";
        case "MOVE_STRANGER_0":
            return `You walk to your ${args[0]}, you hear what feel like ${item("someone")} panting respiration`;
        case "MOVE_STRANGER_1":
            return `You walk to your ${args[0]} and hear the ${item("stranger")} greeting you with a low voice`;
        case "MOVE_STRANGER_GREETINGS":
            return "Welcome back";
        case "MOVE_DIRECTION":
            return `You walk to your ${args[0]} but don't feel like anything changed around you`;
        case "MOVE_DARKNESS_ON":
            return "You feel the dreadness of the darkness as you leave your confort spot";
        case "MOVE_DARKNESS_OFF":
            return "You feel more at ease knowing you are not alone anymore";

        case "FIRST_MEETING_0":
            return "I.. didn't expect to find someone";
        case "FIRST_METTING_1":
            return "You feel more at ease knowing you are not alone anymore";

        default:
            throw new Error(`Unknown key ${key}`);
    }
}
