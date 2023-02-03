export function clean(word: string): string {
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

export function item(word: string): string {
    return `<b>${word}</b>`;
}