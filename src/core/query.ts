export class Query {
    private handledElements: string[] = ["input", "button", "textarea", "select", "radio", "div"];
    private handledAttributes: string[] = ["id", "class", "type", "name", "formControl"];

    start() {
        let foundElements: string[] = [];
        this.handledElements.forEach(element => {
            this.handledAttributes.forEach(attr => {
                const elements = document.querySelectorAll(`${element}`);
                elements.forEach(el => {
                    if (el.getAttribute(attr) != null) foundElements.push(el.outerHTML);
                })
            });
        });
        return foundElements;
    }

    removeDuplicates() {
        //TODO: implement
    }
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
    let _res;
    if (req.method && (req.method === 'query')) {
        const query = new Query();
        _res = query.start();
        res({ method: req.method, data: _res });
    }
});