export class Screen
{
    constructor(onInput) {
        document.getElementById("rpg-enter").addEventListener("click", this.on_input);
        document.getElementById("rpg-input").addEventListener("keyup", (e) => {
            if (e.code === "Enter") {
                onInput();
            }
        })
        this.rpgInput = document.getElementById("rpg-input-field");
        this.rpgDiv = document.getElementById("rpg-output");

        let canvas = document.getElementById("rpg-mini-map");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    write_input(input, args) {
        this.rpgDiv.innerHTML += `<b>> ${input} ${args}</b><br/>`;
    }

    write_dialogue(text, speaker) {
        this.rpgDiv.innerHTML += `<span class="dialogue ${speaker}">"${text}"</span><br/><br/>`;
    }

    write_narration(text) {
        this.rpgDiv.innerHTML += `${text}<br/><br/>`;
    }

    clear_input() {
        this.rpgInput.value = "";
        this.rpgDiv.scrollTop = this.rpgDiv.scrollHeight;
        this.rpgInput.focus();
    }

    
    rpgDiv;
    rpgInput;
}