import { add, divide, subtract, multiply } from './mathUtils.js';
import { toUpper, toLower, formatName } from "./stringUtils.js";
import { getCurrentDate } from "./dateUtils.js";
window.calculate = function (operation) {
    const num1 = Number(document.getElementById("num1").value);
    const num2 = Number(document.getElementById("num2").value);
    let result;
    switch (operation) {
        case "add":
            result = add(num1, num2);
            break;
        case "sub":
            result = subtract(num1, num2);
            break;
        case "mul":
            result = multiply(num1, num2);
            break;
        case "div":
            result = divide(num1, num2);
            break;
        default:
            result = 0;
    }
    document.getElementById("calcResult").innerText = `Result: ${result}`;
};
window.toUpperCaseText = function () {
    const text = document.getElementById("textInput").value;
    document.getElementById("stringResult").innerText = toUpper(text);
};
window.toLowerCaseText = function () {
    const text = document.getElementById("textInput").value;
    document.getElementById("stringResult").innerText = toLower(text);
};
window.showDate = function () {
    document.getElementById("dateResult").innerText = getCurrentDate();
};
//# sourceMappingURL=index.js.map