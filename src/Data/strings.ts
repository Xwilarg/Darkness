export default function getString(key: string, args: string[] = []): string {
    switch (key) {
        case "GAMEOVER":
            return "There is no hope";
        case "INTRODUCTION":
            return "You open your eyes, everything around you is pitch black that you can't even see your hands.<br/>You try to look into your memories but can't remember anything.<br/>What do you do?<br/><small>(Words in <b>bold</b> are items you can interact with, however some of them won't be mentionned until you do so)</small>";

        default:
            throw new Error(`Unknown key ${key}`);
    }
}
