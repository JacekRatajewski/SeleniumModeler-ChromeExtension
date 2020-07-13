$(document).ready(() => {
    console.log("Selenium Modeler Working!!");
});
var Selectors = ["input", "button", "textarea", "select", "radio", "div"];
var Attrs = [
    { Key: "Id", Value: "id" },
    { Key: "CssSelector", Value: "formControl" },
    { Key: "CssSelector", Value: "name" },
    { Key: "CssSelector", Value: "class" },
    { Key: "CssSelector", Value: "type" }
];
var AttrElem, SelectorElem, GlobalResult, GlobalResponse, GObj;
function getParent(element) {
    let parent = null;
    Attrs.forEach(attr => {
        if (element.parentElement.getAttribute(attr.Value) != null) {
            parent = { Attr: { Key: attr.Key, Value: attr.Value }, Value: element.parentElement.getAttribute(attr.Value) };
        }
    });
    return parent;
}

function getBrother(element) {
    let brother = null;
    if (element.previousElementSibling != null) {
        Attrs.forEach(attr => {
            if (element.previousElementSibling.getAttribute(attr.Value) != null) {
                brother = { Attr: { Key: attr.Key, Value: attr.Value }, Value: element.previousElementSibling.getAttribute(attr.Value) };
            }
        });
        return brother;
    }
}

function getUnique(array) {
    var result = [];
    array.forEach(arr => {
        Array.from(new Set(arr.map(s => s.Name)))
            .map(name => {
                result.push({
                    Attr: arr.find(z => z.Name === name).Attr,
                    Name: name,
                    AttrValue: arr.find(z => z.Name === name).AttrValue,
                    Parent: arr.find(z => z.Name === name).Parent,
                    Brother: arr.find(z => z.Name === name).Brother
                });
            });
    });
    return result;
}

function getElements(selector, attr) {
    var elements = document.querySelectorAll(selector);
    var result = [];
    if (elements != null) {
        elements.forEach(element => {
            let _name = ""
            if (element.getAttribute(attr.Value) != null) {
                if (element.getAttribute("name") == null) {
                    _name = element.getAttribute(attr.Value).toUpperCase();
                } else {
                    _name = element.getAttribute("name");
                }
                result.push({ Attr: { Key: attr.Key, Value: attr.Value }, AttrValue: element.getAttribute(attr.Value), Selector: selector, Name: _name.replace(':', '').replace(' ', '').replace('-', '').replace('_', '').replace('-', '').replace(' ', ''), Parent: getParent(element), Brother: getBrother(element) });
            };
        });
    }
    return result;
}

function removeMouseOvers() {
    document.querySelector("body").style.cursor = "";
    document.querySelectorAll("*").forEach(ele => {
        ele.style.cursor = "";
        ele.removeEventListener("mouseover", applyMask);
        ele.removeEventListener("mouseover", getElement);
    });
    removeMask();
}
function getElement(event) {
    var result;
    var target = event.target;
    let _name = ""
    Attrs.forEach(attr => {
        if (target.getAttribute(attr.Value) != null) {
            if (target.getAttribute("name") == null) {
                _name = target.getAttribute(attr.Value).toUpperCase();
            } else {
                _name = target.getAttribute("name");
            }
            if (result == null) {
                result = { Attr: { Key: attr.Key, Value: attr.Value }, AttrValue: target.getAttribute(attr.Value), Name: _name.replace(':', '').replace(' ', '').replace('-', '').replace('_', '').replace('-', '').replace(' ', ''), Parent: getParent(target), Brother: getBrother(target) };
            }
        };
    });
    chrome.storage.local.set({ element: result })
}

function getElementOnClick(event) {
    var result;
    var target = event.target;
    let _name = ""
    Attrs.forEach(attr => {
        if (target.getAttribute(attr.Value) != null) {
            if (target.getAttribute("name") == null) {
                _name = target.getAttribute(attr.Value).toUpperCase();
            } else {
                _name = target.getAttribute("name");
            }
            if (result == null) {
                result = { Attr: { Key: attr.Key, Value: attr.Value }, AttrValue: target.getAttribute(attr.Value), Name: _name, Parent: getParent(target), Brother: getBrother(target) };
            }
        };
    });
    removeMouseOvers();
    chrome.storage.local.set({ element: result })
}

function applyMask(event) {
    GObj = document.getElementsByClassName('highlight-context')[0];
    if (document.getElementsByClassName('highlight-wrap').length > 0) {
        resizeMask(event.target);
    } else {
        createMask(event.target);
    }
}

function removeMask() {
    if (document.getElementsByClassName("highlight-wrap")[0] != undefined) {
        document.getElementsByClassName("highlight-wrap")[0].remove();
    }
    if (document.getElementsByClassName("highlight-context")[0] != undefined) {
        document.getElementsByClassName("highlight-context")[0].remove();
    }
    document.body.removeEventListener("mousemove", move);
}

function resizeMask(target) {
    var rect = target.getBoundingClientRect();
    var hObj = document.getElementsByClassName('highlight-wrap')[0];
    hObj.style.top = rect.top + "px";
    hObj.style.width = rect.width + "px";
    hObj.style.height = rect.height + "px";
    hObj.style.left = rect.left + "px";

    // hObj.style.WebkitTransition='top 0.2s';
}

function move(event) {
    GObj.style.top = event.pageY + "px";
    GObj.style.left = event.pageX + "px";
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    let model = document.createElement("div");
    for (let key in changes) {
        var storage = changes[key];
        if (typeof storage == "undefined") {
            console.log("bad");
        } else {
            $(GObj).empty();
            if (storage.newValue != undefined) {
                model.appendChild(document.createElement("div")).textContent
                    =
                    `Name: ${storage.newValue.Name != null ? storage.newValue.Name : ""}
                AttrKey: ${ storage.newValue.Attr != undefined ? storage.newValue.Attr.Key != null ? storage.newValue.Attr.Key : "" : ""} 
                AttrValue: ${storage.newValue.Attr != undefined ? storage.newValue.Attr.Value != null ? storage.newValue.Attr.Value : "" : ""} 
                Value: ${storage.newValue.AttrValue != null ? storage.newValue.AttrValue : ""}`
                if (storage.newValue.Parent != null) {
                    model.firstChild.textContent +=
                        `\n Parent: \n Attr: ${storage.newValue.Parent.Attr.Value != null ? storage.newValue.Parent.Attr.Value : ""} \n Value  ${storage.newValue.Parent.Value != null ? storage.newValue.Parent.Value : ""}`
                }
                if (storage.newValue.Brother != null) {
                    model.firstChild.textContent +=
                        `\n Brother: \n Attr: ${storage.newValue.Brother.Attr.Value != null ? storage.newValue.Brother.Attr.Value : ""} \n Value  ${storage.newValue.Brother.Value != null ? storage.newValue.Brother.Value : ""}`
                }

                model.style.whiteSpace = 'pre-line';
                if (GObj != undefined) {
                    GObj.appendChild(model);
                }
            }
            // generateCsharpSingle(storage.newValue);
            // generateJsSingle(storage.newValue);
        }
    }
});

function createMask(target) {
    var rect = target.getBoundingClientRect();
    var hObj = document.createElement("div");
    hObj.className = 'highlight-wrap';
    hObj.style.position = 'absolute';
    hObj.style.top = rect.top + "px";
    hObj.style.width = rect.width + "px";
    hObj.style.height = rect.height + "px";
    hObj.style.left = rect.left + "px";
    hObj.style.backgroundColor = '#561b5e';
    hObj.style.opacity = '0.5';
    hObj.style.cursor = 'default';
    hObj.style.pointerEvents = 'none';
    hObj.style.zIndex = '9999';
    var hObj2 = document.createElement("div");
    hObj2.className = 'highlight-context';
    hObj2.style.position = 'absolute';
    hObj2.style.top = rect.top + "px";
    hObj2.style.width = "auto";
    hObj2.style.height = "auto";
    hObj2.style.padding = '5px';
    hObj2.style.boxShadow = '#561b5e 0px 1px 5px 0px';
    hObj2.style.left = rect.left + "px";
    hObj2.style.backgroundColor = '#f5f5f5';
    hObj2.style.color = '#561b5e';
    hObj2.style.cursor = 'default';
    hObj2.style.pointerEvents = 'none';
    hObj2.style.zIndex = '1000001';
    hObj2.style.border = '1px solid #561b5e';
    document.body.appendChild(hObj);
    document.body.appendChild(hObj2);
}

function clearMasks() {
    var hwrappersLength = document.getElementsByClassName("highlight-wrap").length;
    var hwrappers = document.getElementsByClassName("highlight-wrap");
    if (hwrappersLength > 0) {
        for (var i = 0; i < hwrappersLength; i++) {
            console.log("Removing existing wrap");
            hwrappers[i].remove();
        }
    }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method && (request.method === "getModel")) {
        Selectors.forEach(selector => {
            Attrs.forEach(attr => {
                let elements = getElements(selector, attr);
                if (elements.length > 0) {
                    request.models.push(elements);
                }
            });
        });
        sendResponse({ "models": getUnique(request.models) });
    } else if (request.method && (request.method === "selectElement")) {
        GlobalResponse = sendResponse;
        document.querySelector("body").style.cursor = "url(https://imgur.com/nlMZlqL.png), auto";
        document.querySelectorAll("*").forEach(ele => {
            ele.style.cursor = "url(https://imgur.com/nlMZlqL.png), auto";
            ele.addEventListener("mouseover", applyMask, false);
            document.body.addEventListener("mousemove", move, false);
            ele.addEventListener("mouseover", getElement, false);
            ele.addEventListener("contextmenu", getElementOnClick, false);
        });
        sendResponse({ "success": true });
    } else if (request.method && (request.method === "disableSelection")) {
        document.querySelector("body").style.cursor = "";
        document.querySelectorAll("*").forEach(ele => {
            ele.removeEventListener("mouseover", applyMask);
            ele.removeEventListener("mouseover", getElement);
            ele.removeEventListener("contextmenu", getElementOnClick, false);
            if (document.getElementsByClassName("highlight-wrap").length > 0) {
                removeMask();
            }
            ele.style.cursor = "";
        });
        sendResponse({ "success": false });
    }
});


