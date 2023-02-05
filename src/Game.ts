import Action from "./Action/Action";
import ActionManager from "./Action/ActionManager";
import Screen from "./Screen";
import { clean } from "./Utils/parsing";
import CharacterManager from "./Character/CharacterManager";

export class Game_Darkness {
    constructor() {
        this.#screen = new Screen(this.on_input);

        this.#screen.write_narration(
            "You open your eyes, everything around you is pitch black that you can't even see your hands.<br/>You try to look into your memories but can't remember anything.<br/>What do you do?<br/><small>(Words in <b>bold</b> are items you can interact with, however some of them won't be mentionned until you do so)</small>"
        );

        this.#actionManager = new ActionManager();
        this.#characterManager = new CharacterManager();
    }

    #screen: Screen;
    #actionManager: ActionManager;
    #characterManager: CharacterManager;

    #actions: Record<string, Action> = {
        HELP: new Action(0, 0, false),
        ITEMS: new Action(0, 0, true),
        TOUCH: new Action(1, 1, true),
        USE: new Action(2, 2, true),
        WAIT: new Action(0, 0, true),
        MOVE: new Action(0, 1, true),
        DEBUG: new Action(0, 0, false),
        ASK: new Action(1, 1, true),
    };

    #to_sentence_case(text: string): string {
        return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    }

    #argument_text(action: Action): string {
        if (action.argCountMin === action.argCountMax) {
            return `${action.argCountMin} argument${
                action.argCountMin > 1 ? "s" : ""
            }`;
        }
        return `${action.argCountMin} to ${action.argCountMax} argument${
            action.argCountMax > 1 ? "s" : ""
        }`;
    }

    on_input(): void {
        const text = this.#screen.get_input();
        let input = text[0];
        let args = text.slice(1);

        if (input === "") {
            return; // Empty input, we just ignore it
        }

        try {
            this.#screen.write_input(input, args);
            if (!this.#characterManager.is_player_alive()) {
                this.#screen.write_narration("There is no hope");
            } else if (!(input in this.#actions)) {
                this.#screen.write_narration(
                    'Unknown action, enter "Help" for the list of actions'
                );
            } else if (
                args.length < this.#actions[input].argCountMin ||
                args.length > this.#actions[input].argCountMax
            ) {
                this.#screen.write_narration(
                    `${this.#to_sentence_case(
                        input
                    )} takes ${this.#argument_text(this.#actions[input])}`
                );
            } else {
                if (input === "USE" && clean(args[0]) === "HANDS") {
                    // Using your hands on smth is the same as touching it
                    input = "TOUCH";
                    args = [args[1]];
                }

                const choices = this.#actionManager.getActions(
                    this.#screen,
                    this.#characterManager
                );
                if (!(input in choices) || !choices[input](args)) {
                    switch (input) {
                        case "HELP":
                            this.#screen.write_narration(
                                `Possible actions:<br/>${Object.keys(
                                    this.#actions
                                )
                                    .map(
                                        (x) =>
                                            `${this.#to_sentence_case(
                                                x
                                            )} (${this.#argument_text(
                                                this.#actions[x]
                                            )})`
                                    )
                                    .join("<br/>")}`
                            );
                            break;

                        default:
                            this.#screen.write_narration(
                                "You can't do that here"
                            );
                            break;
                    }
                    if (this.#actions[input].looseHP) {
                        this.#characterManager.decrease_player_hp(this.#screen);
                    }
                }
            }
        } catch (error: any) {
            this.#screen.write_error(error);
        }

        this.#screen.clear_input();
    }
}
