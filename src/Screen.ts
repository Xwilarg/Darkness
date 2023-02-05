/**
 * Manage all the interactions with the screen
 */
export default class Screen {
    constructor (onInput: () => void) {
        document.getElementById('rpg-enter')!.addEventListener('click', onInput)
        document.getElementById('rpg-input')!.addEventListener('keyup', (e) => {
            if (e.code === 'Enter') {
                onInput()
            }
        })
        this.#rpgInput = document.getElementById('rpg-input-field')! as HTMLInputElement
        this.#rpgDiv = document.getElementById('rpg-output')!

        const canvas = document.getElementById('rpg-mini-map')! as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    /**
     * Display an error on the screen
     * @param error The error to be displayed
     */
    write_error (error: string): void {
        this.#rpgDiv.innerHTML += `<span class="rpg-error">An error occured:<br/>${error}</span><br/><br/>`
    }

    /**
     * Display the user input on the screen
     * @param input Command input
     * @param args Arguments of the command
     */
    write_input (input: string, args: string[]): void {
        this.#rpgDiv.innerHTML += `<b>> ${input} ${args}</b><br/>`
    }

    /**
     * Display the dialogue of a character speaking on screen
     * @param text Text spoken by the character
     * @param speaker Id of the character
     */
    write_dialogue (text: string, speaker: 'stranger' | 'me'): void {
        this.#rpgDiv.innerHTML += `<span class="dialogue ${speaker}">"${text}"</span><br/><br/>`
    }

    /**
     * Display a narrative dialogue on the screen
     * @param text Text to be displayed
     */
    write_narration (text: string): void {
        this.#rpgDiv.innerHTML += `${text}<br/><br/>`
    }

    /**
     * Clear the input element
     */
    clear_input (): void {
        this.#rpgInput.value = ''
        this.#rpgDiv.scrollTop = this.#rpgDiv.scrollHeight
        this.#rpgInput.focus()
    }

    /**
     * Get the user input
     * @returns User input, splitted by space
     */
    get_input (): string[] {
        return this.#rpgInput.value.toUpperCase().trim().split(' ')
    }

    #rpgDiv: HTMLElement
    #rpgInput: HTMLInputElement
}
