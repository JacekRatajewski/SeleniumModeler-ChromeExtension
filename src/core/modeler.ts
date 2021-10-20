import { SeleniumPOM } from "./models/selenium.models";

export class Modeler {
    queriedElements: string[];
    constructor(data: string[]) {
        this.queriedElements = data;
    }

    start(): SeleniumPOM[] {
        return this.queriedElements.map(el => {
            let pom = new SeleniumPOM();
            pom.Value = el;
            pom.Id = this.getProp(el, /\bid="(?:[^"]*"){1}/g, 'id="');
            pom.Classes = this.getProp(el, /\bclass="(?:[^"]*"){1}/g, 'class="')?.split(" ") ?? [];
            pom.Name = this.getProp(el, /\bname="(?:[^"]*"){1}/g, 'name="')
            pom.Tag = this.getProp(el, /\b(?:[^"]* ){1}/g, " ")
            pom.CssSelector = this.getCssSelector(pom);
            return pom;
        });
    }

    getProp(el: string, regex, toReplace: string): string {
        const res = regex.exec(el)
        if (res != null) {
            let cleanId = el.substr(res.index, res[0].length).replace(`${toReplace}`, "").replace('"', "");
            return cleanId;
        }
        return null;
    }

    getCssSelector(pom: SeleniumPOM) {
        if (pom.Id) return `#${pom.Id}`;
        if (pom.Classes) {
            let cssSelector = ""
            pom.Classes.forEach(x => cssSelector += `.${x}`)
            return cssSelector;
        }
        if (pom.Name) return `[name="${pom.Name}"]`;
        if (pom.Tag) return `${pom.Tag}`;
    }
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
    let _res;
    if (req.method && (req.method === 'models')) {
        const modeler = new Modeler(req.data);
        _res = modeler.start();
        res({ method: 'models', data: _res });
    }
});