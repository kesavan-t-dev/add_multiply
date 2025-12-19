function calculate(type) {
    const inputRaw = document.getElementById("user_input").value;
    const errorMsg = document.getElementById("error_msg");
    const resultMsg = document.getElementById("result_msg");

    errorMsg.classList.add("d-none");
    resultMsg.classList.add("d-none");

    // 1️⃣ Empty input
    if (inputRaw.trim().length === 0) {
        showError("Please enter a number");
        return;
    }

    let input = inputRaw.trim();
    let hasLetter = false;
    let hasSpecial = false;

    // 2️⃣ Character validation (NO regex)
    for (let ch of input) {
        const code = ch.charCodeAt(0);

        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
            hasLetter = true;
        }
        else if (
            !(code >= 48 && code <= 57) &&
            ch !== "," && ch !== "." &&
            ch !== "-" && ch !== " "
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

    // 3️⃣ Comma at start or end
    if (input.startsWith(",") || input.endsWith(",")) {
        showError("Special Character(s) not allowed");
        return;
    }

    // 4️⃣ Normalize multiple commas
    let normalized = "";
    let prevComma = false;

    for (let ch of input) {
        if (ch === ",") {
            if (!prevComma) {
                normalized += ",";
                prevComma = true;
            }
        } else {
            normalized += ch;
            prevComma = false;
        }
    }

    // Remove spaces
    normalized = normalized.replace(/\s+/g, "");

    const parts = normalized.split(",");

    // 5️⃣ Must contain more than one number
    if (parts.length < 2) {
        showError("Please enter more than one number");
        return;
    }

    let numbers = [];

    // 6️⃣ Validate each number
    for (let value of parts) {
        if (!isValidNumber(value)) {
            showError("Invalid number(s)");
            return;
        }
        numbers.push(Number(value));
    }

    let sum = 0;
    let product = 1;

    for (let num of numbers) {
        sum += num;
        product *= num;
    }

    if (type === "sum") {
        resultMsg.innerText = `Sum=${sum}`;
    } else {
        resultMsg.innerText = `Product=${product}`;
    }

    resultMsg.classList.remove("d-none");
}

function isValidNumber(value) {
    if (value === "" || value === "-" || value === ".") return false;

    let dotCount = 0;
    let minusCount = 0;
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

        if (ch === "-") {
            minusCount++;
            if (i !== 0 || minusCount > 1) return false;
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
    document.getElementById("error_msg").classList.add("d-none");
    document.getElementById("result_msg").classList.add("d-none");
}
