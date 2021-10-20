import "./index.scss";

export class App {
    constructor() {
        import("./components/menu/menu").then(x => window.customElements.define("menu-list", x.Menu));
    }
}

new App();

