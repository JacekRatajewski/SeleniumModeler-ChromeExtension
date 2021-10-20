export class SeleniumPOM {
    Value?: string;
    Id?: string;
    Classes?: string[];
    Tag?: string;
    Name?: string;
    CssSelector: string;
    model(langFunc: Function) {
        return langFunc();
    }
}

export enum Lang {
    Csharp,
    Js,
    Python
}