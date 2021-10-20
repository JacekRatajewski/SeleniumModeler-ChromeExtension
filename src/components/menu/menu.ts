const template = require("./menu.html").default;
import "./menu.scss";
import { BehaviorSubject, Observable, Subject } from "rxjs";
export class Menu extends HTMLElement {
    isCursorModeActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isWindowMenuOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    chrome$: Subject<any> = new Subject<any>();
    chromeRes$: Subject<{ method: string, data?: any }> = new Subject<{ method: string, data?: any }>();
    private queriedElements: string[] = [];
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = template;
        this.onGithub();
        this.onWindow();
        this.onCursorMode();
        this.onQuery();
        this.onModels();
        this.chromeConnect();
    }

    onModels() {
        document.getElementById("models").addEventListener("click", () => {
            this.chrome$.next({ method: "models", data: this.queriedElements });
        });
        this.chromeRes$.subscribe(res => {
            if (res.method == "models") {
                console.log(res);
            }
        });
    }

    onQuery() {
        document.getElementById("query").addEventListener("click", () => {
            this.chrome$.next({ method: "query" });
        });
        this.chromeRes$.subscribe(res => {
            if (res.method == "query")
                if ((<string[]>res.data).length > 0) {
                    this.queriedElements = res.data;
                    this.setItemActive("#models", false);
                } else {
                    this.setItemActive("#models", null);
                }
        });
    }

    chromeConnect() {
        this.chrome$.subscribe(x => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, x, (res) => {
                    this.chromeRes$.next(res);
                })
            });
        })
    }

    onCursorMode() {
        this.chrome$.next({ method: "checkIfCursorModeIsActive" });
        this.chromeRes$.subscribe(res => {
            if (res.method == "checkIfCursorModeIsActive") {
                this.isCursorModeActive$.next(res.data);
            }
        })
        document.getElementById("cursor-mode").addEventListener("click", () => {
            this.isCursorModeActive$.next(!this.isCursorModeActive$.value);
            this.chrome$.next({ isActive: this.isCursorModeActive$.value, method: "cursorMode" });
        });
        this.isCursorModeActive$.subscribe(isActive => this.setItemActive("#cursor-mode", isActive));
    }

    onGithub() {
        document.getElementById("github").addEventListener("click", () => {
            window.open("https://github.com/JacekRatajewski/SeleniumModeler-ChromeExtension", '_blank').focus();
        });
    }

    onWindow() {
        document.getElementById("window").addEventListener("click", (e) => {
            this.isWindowMenuOpen$.next(!this.isWindowMenuOpen$.value);
            window.open("http://localhost:3000/", "", "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no");
        });
        this.isWindowMenuOpen$.subscribe(isActive => {
            (<HTMLElement>document.querySelector(".collapsed")).style.display = isActive ? "flex" : "none";
            this.setItemActive("#window", isActive);
        })
    }

    setItemActive(selector: string, isActive?: boolean) {
        const cursorItem = <HTMLElement>document.querySelector(selector);
        cursorItem.classList.remove('deactive')
        switch (isActive) {
            case true:
                cursorItem.classList.add('active')
                break;
            case false:
                cursorItem.classList.remove('active')
                break;
            case null:
                cursorItem.classList.remove('active')
                cursorItem.classList.add('deactive')
                break;
        }
    }
}