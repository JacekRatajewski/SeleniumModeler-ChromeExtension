import { SeleniumPOM } from "../core/models/selenium.models";
import "./pip.scss";
export class Pip {
    pom: SeleniumPOM;
    setPOMToDisplay(pom: SeleniumPOM) {
        this.pom = pom;
        const conainer = document.getElementById("pip-sem");
        conainer.innerHTML = this.getDisplayTemplate();
    }

    getDisplayTemplate(): string {
        return ``;
    }
}