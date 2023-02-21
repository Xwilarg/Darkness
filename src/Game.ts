import Action from "./Action/Action";
import ActionManager from "./Action/ActionManager";
import Screen from "./Screen";
import { clean } from "./Utils/parsing";
import CharacterManager from "./Character/CharacterManager";
import getString from "./Data/strings";

export class Game_Darkness {
    constructor() {
        this.#screen = new Screen(() => {
            this.on_input(this);
        });

        this.#screen.write_narration(getString("INTRODUCTION")!);

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
        ASK: new Action(1, 1, true),
    };

    #to_sentence_case(text: string): string {
        return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    }

    #argument_text(action: Action): string {
        if (action.argCountMin === action.argCountMax) {
            return `${action.argCountMin} argument${action.argCountMin > 1 ? "s" : ""}`;
        }
        return `${action.argCountMin} to ${action.argCountMax} argument${action.argCountMax > 1 ? "s" : ""}`;
    }

    getScreen(): Screen {
        return this.#screen;
    }

    getActions(): Record<string, Action> {
        return this.#actions;
    }

    on_input(game: Game_Darkness): void {
        const text = game.getScreen().get_input();
        let input = text[0];
        let args = text.slice(1);

        if (input === "") {
            return; // Empty input, we just ignore it
        }

        try {
            game.getScreen().write_input(input, args);
            if (!game.#characterManager.is_player_alive()) {
                game.getScreen().write_narration(getString("GAMEOVER")!);
            } else if (!(input in game.getActions())) {
                game.getScreen().write_narration('Unknown action, enter "Help" for the list of actions');
            } else if (args.length < game.getActions()[input].argCountMin || args.length > game.getActions()[input].argCountMax) {
                game.getScreen().write_narration(`${game.#to_sentence_case(input)} takes ${game.#argument_text(game.getActions()[input])}`);
            } else {
                if (input === "USE" && clean(args[0]) === "HANDS") {
                    // Using your hands on smth is the same as touching it
                    input = "TOUCH";
                    args = [args[1]];
                }

                const choices = game.#actionManager.getActions(game.getScreen(), game.#characterManager);
                if (!(input in choices) || !choices[input](args)) {
                    switch (input) {
                        case "HELP":
                            game.getScreen().write_narration(
                                `Possible actions:<br/>${Object.keys(game.getActions())
                                    .map((x) => `${game.#to_sentence_case(x)} (${game.#argument_text(game.getActions()[x])})`)
                                    .join("<br/>")}`
                            );
                            break;

                        default:
                            game.getScreen().write_narration("You can't do that here");
                            break;
                    }
                }
                else if (game.getActions()[input].looseHP) {
                    game.#characterManager.decrease_player_hp(game.getScreen());
                }
            }
        } catch (error: any) {
            game.getScreen().write_error(error);
        }

        if (window.location.hostname === "localhost") {
            game.getScreen().write_debug(
                `Me: ${this.#characterManager.get_pos("me").to_string()}, f: ${this.#characterManager.get_forward("me").to_string()}, HP: ${this.#characterManager.get_mental_hp("me")}<br/>` +
                `Stranger: ${this.#characterManager.get_pos("stranger").to_string()}`
            );
        }

        game.getScreen().clear_input();
    }
}
