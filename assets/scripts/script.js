
function calculate(type) {
    const inputRaw = document.getElementById("user_input").value;
    const errorMsg = document.getElementById("error_msg");
    const outputBox = document.getElementById("output_box");

    errorMsg.classList.add("d-none");
    outputBox.value = "";

    let hasLetter = false;
    let hasSpecial = false;

    if (inputRaw.trim().length === 0) {
        show_error("Please enter a number");
        return;
    }

    for (let ch of inputRaw) {
        const code = ch.charCodeAt(0);
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
            hasLetter = true;
        } else if (
            !(code >= 48 && code <= 57) &&
            ch !== "," && ch !== "." && ch !== "-" && ch !== "+" && ch !== " "
        ) {
            hasSpecial = true;
        }
    }

    if (hasSpecial) {
        show_error("Special Character(s) not allowed");
        return;
    } else if (hasLetter) {
        show_error("letter(s) not allowed");
        return;
    }

    let normalized = "";
    let prevComma = false;
    for (let ch of inputRaw.trim()) {
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

    if (normalized.startsWith(",") || normalized.endsWith(",")) {
        show_error("Special Character(s) not allowed");
        return;
    }

    const rawParts = normalized.replace(/\s+/g, "").split(",");

    const numbers = [];
    for (const val of rawParts) {
        if (val !== "") numbers.push(val);
    }

    if (numbers.length < 2) {
        show_error("Please enter more than one number");
        return;
    }

    const values = [];
    const decimalsPerValue = [];

    for (const n of numbers) {
        if (!is_validNumber(n)) {
            show_error("Invalid number(s)");
            return;
        }
        values.push(Number(n));
        decimalsPerValue.push(n);
        console.log('decimalpervalue '+ decimalsPerValue)
    }

    let result = type === "sum" ? 0 : 1;
    for (const num of values) {
        result = type === "sum" ? result + num : result * num;
    }

    outputBox.value = processNumber(result, decimalsPerValue);

}

function is_validNumber(value) {
    let dotCount = 0;
    let signCount = 0;
    let hasDigit = false;

    for (let i = 0; i < value.length; i++) {
        const ch = value[i];

        if (ch >= "0" && ch <= "9") {
            hasDigit = true;
        } else if (ch === ".") {
            dotCount++;
            if (dotCount > 1) return false;
        } else if (ch === "+" || ch === "-") {
            signCount++;
            if (i !== 0 || signCount > 1) return false;
        } else {
            return false; 
        }
    }
    return hasDigit;
}


function processNumber(result, values) {
    
    let maxDecimals = 0; 

    for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const s = String(v); 

    const idx = s.indexOf("."); 

    let decimals;
        if (idx === -1) {
            decimals = 0; 
            console.log(decimals);
        } else {
            decimals = s.length - idx - 1; 
        }
        if (decimals > maxDecimals) {
            maxDecimals = decimals;
    }
    }

    let rounded;
    if (maxDecimals <= 0) {
        rounded = Math.round(result);
    } else {
        const factor = Math.pow(10, maxDecimals);
        rounded = Math.round((result + Number.EPSILON) * factor) / factor;
    }
    

    return rounded;
}

function show_error(message) {
    const errorMsg = document.getElementById("error_msg");
    errorMsg.innerText = message;
    errorMsg.classList.remove("d-none");
}

function reset_form() {
    document.getElementById("user_input").value = "";
    document.getElementById("output_box").value = "";
    document.getElementById("error_msg").classList.add("d-none");
}

