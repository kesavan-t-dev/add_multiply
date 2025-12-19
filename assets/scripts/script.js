function calculate(type) {
    const inputRaw = document.getElementById("user_input").value;
    const errorMsg = document.getElementById("error_msg");
    const outputBox = document.getElementById("output_box");

    errorMsg.classList.add("d-none");
    outputBox.value = "";

    if (inputRaw.trim().length === 0) {
        showError("Please enter a number");
        return;
    }

    let hasLetter = false;
    let hasSpecial = false;

    for (let ch of inputRaw) {
        const code = ch.charCodeAt(0);

        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
            hasLetter = true;
        }
        else if (
            !(code >= 48 && code <= 57) &&
            ch !== "," &&
            ch !== "." &&
            ch !== "-" &&
            ch !== "+" &&
            ch !== " "
        ) {
            hasSpecial = true;
        }
    }

    if (hasSpecial) {
        showError("Special Character(s) not allowed");
        return;
    }

    if (hasLetter) {
        showError("letter(s) not allowed");
        return;
    }

    let normalized = "";
    let prevComma = false;

    for (let ch of inputRaw.trim()) {
        if (ch === "," ) {
            if (!prevComma) {
                normalized += ",";
                prevComma = true;
            }
        } else {
            normalized += ch;
            prevComma = false;
        }
    }

    if (normalized.startsWith(",") || normalized.endsWith(",")) {
        showError("Special Character(s) not allowed");
        return;
    }

    normalized = normalized.replace(/\s+/g, "");
    const rawParts = normalized.split(",");

    let numbers = [];
    for (let val of rawParts) {
        if (val !== "") {
            numbers.push(val);
        }
    }
    if (numbers.length < 2) {
        showError("Please enter more than one number");
        return;
    }

    let values = [];
    for (let n of numbers) {
        if (!isValidNumber(n)) {
            showError("Invalid number(s)");
            return;
        }
        values.push(Number(n));
    }


    let result = type === "sum" ? 0 : 1;

    for (let num of values) {
        result = type === "sum" ? result + num : result * num;
    }

    outputBox.value = result;
}

function isValidNumber(value) {
    let dotCount = 0;
    let signCount = 0;
    let hasDigit = false;

    for (let i = 0; i < value.length; i++) {
        const ch = value[i];

        if (ch >= "0" && ch <= "9") {
            hasDigit = true;
            continue;
        }

        if (ch === ".") {
            dotCount++;
            if (dotCount > 1) return false;
            continue;
        }

        if (ch === "+" || ch === "-") {
            signCount++;
            if (i !== 0 || signCount > 1) return false;
            continue;
        }

        return false;
    }

    return hasDigit;
}

function showError(message) {
    const errorMsg = document.getElementById("error_msg");
    errorMsg.innerText = message;
    errorMsg.classList.remove("d-none");
}

function resetForm() {
    document.getElementById("user_input").value = "";
    document.getElementById("output_box").value = "";
    document.getElementById("error_msg").classList.add("d-none");
}
