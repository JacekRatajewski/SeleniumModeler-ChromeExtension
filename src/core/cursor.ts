const mask = require("./shared/mask/mask.html").default;
export class Cursor {
    private cursor: string = "url(https://i.imgur.com/uOZLJc2.png), auto";
    mask: HTMLElement;
    initialiazed: boolean = false;
    constructor() {
    }

    init() {
        if (!this.initialiazed) {
            this.setCursor();
            this.setMask();
            this.onMouseOver();
        }
        this.initialiazed = true;
    }

    reset() {
        this.setCursor(true);
        this.setMask(true);
        this.onMouseOver(true);
    }

    setMask(clear: boolean = false) {
        const currentMask = document.querySelector("#mask-sem");
        if (currentMask != undefined && currentMask != null) {
            if (clear) {
                currentMask.parentElement.remove();
                return;
            }
            this.mask = <HTMLElement>currentMask.parentElement;
            return;
        }
        this.mask = document.createElement("div");
        this.mask.innerHTML = mask;
        document.body.append(this.mask);
    }

    setCursor(clear: boolean = false) {
        document.body.style.cursor = !clear ? this.cursor : "";
        document.querySelectorAll("*").forEach(e =>
            !clear
                ? (<HTMLElement>e).style.cursor = this.cursor
                : (<HTMLElement>e).style.cursor = ""
        );
    }

    onMaskOverElement(event: MouseEvent, cursor: Cursor) {
        const rect = (<HTMLElement>event.target).getBoundingClientRect();
        const mask = <HTMLElement>cursor.mask.firstElementChild;
        mask.style.top = `${rect.top}px`;
        mask.style.left = `${rect.left}px`;
        mask.style.width = `${rect.width}px`;
        mask.style.height = `${rect.height}px`;
    }

    onMouseOver(clear: boolean = false) {
        document.querySelectorAll("*").forEach(e =>
            !clear
                ? (<HTMLElement>e).addEventListener("mouseover", (e) => this.onMaskOverElement(e, this), false)
                : (<HTMLElement>e).removeEventListener("mouseover", (e) => this.onMaskOverElement(e, this))
        );
    }
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.method && (req.method === 'cursorMode')) {
        const cursor = new Cursor();
        if (!req.isActive) {
            cursor.reset();
            return;
        }
        cursor.init();
    }
    res({ method: req.method });
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
    let isActive = false;
    if (req.method && (req.method === 'checkIfCursorModeIsActive')) {
        isActive = document.querySelector("#mask-sem") != null;
    }
    res({ method: req.method, data: isActive });
});