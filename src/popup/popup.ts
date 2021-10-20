export class Popup {
    constructor() {
        import("./components/container/container").then(x => window.customElements.define("popup-container", x.Container));
    }
}

new Popup();