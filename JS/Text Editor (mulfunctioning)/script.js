const formatBlock = document.querySelector("#formartBlock");
let 
optionButtons = document.querySelectorAll(".option-button"),
advancedOptionButton = document.querySelectorAll(".adv-option-button"),
fontName = document.getElementById("fontName"),
fontSizeRef = document.getElementById("fontSize"),
writingArea = document.getElementById("text-input"),
linkButton = document.getElementById("createLink"),
alignButtons = document.querySelectorAll(".align"),
spacingButtons = document.querySelectorAll(".spacing"),
formatButtons = document.querySelectorAll(".format"),
scriptButtons = document.querySelectorAll(".script");

let fontList = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "Cursive"
];

const initializer = () => {
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, true);
    highlighter(scriptButtons, true);

    for(let i = 1; i <= 6; i++) {
        let option = document.createElement("option");
        option.value = 'H' + i;
        option.innerText = 'H' + i;
        formatBlock.appendChild(option);
    }

    fontList.map(value => {
        let option = document.createElement("option");
        option.value = value;
        option.innerText = value;
        fontName.appendChild(option);
    });

    for(let i = 1; i <= 7; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        fontSizeRef.appendChild(option);
    }

    fontSizeRef.value = 2;
}

const modifyText = (command, defaultUI, value) => {
    document.execCommand(command, defaultUI, value);
}

optionButtons.forEach(button => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, null);
    });
});

advancedOptionButton.forEach(button => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, button.value);
    });
});

linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter URL");
    if(/http/i.test(userLink)) {
        modifyText(linkButton.id, false, userLink);
    } else {
        userLink = "http://" + userLink;
        modifyText(linkButton.id, false, userLink);
    }
});

const highlighter = (className, needsRemoval) => {
    className.forEach(button => {
        button.addEventListener("click", () => {
            if(needsRemoval) {
                let alreadyActive = false;
                if(button.classList.contains("active")) alreadyActive = true;
                highlighterRemover(className);
                if(!alreadyActive) button.classList.add("active");
            } else {
                button.classList.toggle("active");
            }
        });
    });
}

const highlighterRemover = (className) => {
    className.forEach(button => {
        button.classList.remove("active");
    });
}

window.onload = initializer();