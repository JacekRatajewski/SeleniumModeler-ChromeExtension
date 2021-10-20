const template = require("./container.html").default;
import "./container.scss";
export class Container extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = template;
    }
}