$(document).ready(function () {
    chrome.storage.local.clear();
    var models = [];
    var elements = [];
    var activeEl = true;
    console.log("ready");
    $("#js-tab .download").addClass("active");
    $("#getModel").click(function () {
        console.log("model created");
        $("#js-tab").addClass("active");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { models: models, method: "getModel" }, function (response) {
                $("#getModel").text("");
                $("#getModel").append("<div class='loader'>Loading...</div>");
                setTimeout(function () {
                    console.log(response.models);
                    generateCsharp(response.models);
                    generateJs(response.models);
                    $("#js").addClass("active");
                    console.log('success');
                    $("#getModel").text("Create Model");
                }, 1000);
            });
        });
    });
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (let key in changes) {
            var storage = changes[key];
            if (typeof storage == "undefined") {
                console.log("bad");
            } else {
                console.log(storage);
                generateCsharpSingle(storage.newValue);
                generateJsSingle(storage.newValue);
            }
        }
    });

    $("#selectElement").click(function () {
        if (activeEl != false) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { elements: activeEl, method: "selectElement" }, function (response) {
                    console.log('success');
                    activeEl = !response.success;
                });
            });
            $("#selectElement").addClass("active");
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { elements: activeEl, method: "disableSelection" }, function (response) {
                    console.log('success');
                    activeEl = !response.success;
                });
            });
            $("#selectElement").removeClass("active");
        }
        chrome.storage.local.set({ activeEl: activeEl })
    });

    $(".download").click(function () {
        let text = "";
        if ($(".download.active").prev().prev()[0] == $("#js")[0]) {
            text = createJsFileString($(".download.active").prev().prev().prev()[0].children);
        } else {
            text = createCsharpFileString($(".download.active").prev().prev().prev()[0].children);
        }
        $(".download.active a")[0].href = "data:text/plain;charset=UTF-8," + encodeURIComponent(text);
    });

    $(".copy").click(function () {
        copyToClipboard($(".active .code"));
    });

    $("#js-tab").click(function () {
        $("#csharp-tab").removeClass("active");
        $("#js-tab").addClass("active");
        $("#csharp").removeClass("active");
        $("#js").addClass("active");
        $("#js-tab .download").addClass("active");
        $("#csharp-tab .download").removeClass("active");
    });

    $("#csharp-tab").click(function () {
        $("#csharp-tab").addClass("active");
        $("#js-tab").removeClass("active");
        $("#csharp").addClass("active");
        $("#js").removeClass("active");
        $("#js-tab .download").removeClass("active");
        $("#csharp-tab .download").addClass("active");
    });
});

function getString(attr, value) {
    let string = "";
    switch (attr) {
        case "id":
            string = `#${value}`;
            break;
        case "class":
            string = `.${value.replace(' ', '.')}`;
            break;
        default:
            string = `[${attr}='${value}']`;
            break;
    }
    return string;
}

function getBrotherString(brother) {
    if (brother != null) {
        return `${getString(brother.Attr.Value, brother.Value)} + `;
    }
    return "";
}

function getParentString(parent) {
    if (parent != null) {
        return `${getString(parent.Attr.Value, parent.Value)} `;
    }
    return "";
}

function getElementString(element) {
    if (element != null) {
        return getString(element.Attr.Value, element.AttrValue);
    }
    return "";
}

function generateCsharp(elements) {
    let i = 0;
    elements.forEach(el => {
        $("#csharp").append("<div class='element'>");
        $("#csharp .element")[i].innerHTML = `public IWebElement ${el.Name.charAt(0).toUpperCase().replace('-', '') + el.Name.slice(1)} => _driver.FindElement(By.${el.Attr.Key}("${getParentString(el.Parent)}${getBrotherString(el.Brother)}${getElementString(el)}"));`;
        i++;
    });
}

function generateJs(elements) {
    let i = 0;
    elements.forEach(el => {
        $("#js").append("<div class='element'>");
        $("#js .element")[i].innerHTML = `get ${el.Name.toLowerCase().replace('-', '')}() { return $("${getParentString(el.Parent)}${getBrotherString(el.Brother)}${getElementString(el)}"); }`;
        i++;
    });
}

function generateCsharpSingle(el) {
    let string = "";
    $("#csharp-result").text("");
    $("#csharp-result").append("<div class='loader'>Loading...</div>");
    string = `public IWebElement ${el.Name.replace('-', '').charAt(0).toUpperCase() + el.Name.slice(1)} => _driver.FindElement(By.${el.Attr.Key}("${getParentString(el.Parent)}${getBrotherString(el.Brother)}${getElementString(el)}"));`;
    if ($("#csharp")[0].children.length > 0) {
        for (let i = 0; i < [$("#csharp .element")][0].length; i++) {
            if ($([$("#csharp .element")][0][i]).text().includes(string)) {
                $("#csharp-result").text(string);
            }
        }
    } else {
        $("#csharp").text(string);
    }
}

function generateJsSingle(el) {
    let string = "";
    $("#js-result").text("");
    $("#js-result").append("<div class='loader'>Loading...</div>");
    string = `get ${el.Name.toLowerCase().replace('-', '')}() { return $("${getParentString(el.Parent)}${getBrotherString(el.Brother)}${getElementString(el)}"); }`;
    if ($("#js")[0].children.length > 0) {
        for (let i = 0; i < [$("#js .element")][0].length; i++) {
            if ($([$("#js .element")][0][i]).text().includes(string)) {
                $("#js-result").text(string);
            }
        }
    } else {
        $("#js").text(string);
    }
}

function copyToClipboard(element) {
    element.next().text(element.text()).select();
    document.execCommand("copy");
}

function createJsFileString(element) {
    let fileString = "class Model {\n";
    new Set(element).forEach(div => {
        fileString += $(div).text() + "\n";
    });
    fileString += "\n } \n module.exports = new Model() \n"
    return fileString;
}


function createCsharpFileString(element) {
    let fileString = "namespace Models \n{\npublic class Model \n{\n";
    new Set(element).forEach(div => {
        fileString += $(div).text() + "\n";
    });
    fileString += "\n } \n } \n"
    return fileString;
}
