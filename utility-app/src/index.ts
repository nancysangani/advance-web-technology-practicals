import { add, divide, subtract, multiply } from './mathUtils.js';
import { toUpper, toLower, formatName } from "./stringUtils.js";
import { getCurrentDate } from "./dateUtils.js";

(window as any).calculate = function (operation: string) {
  const num1 = Number((document.getElementById("num1") as HTMLInputElement).value);
  const num2 = Number((document.getElementById("num2") as HTMLInputElement).value);

  let result: number;

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

  document.getElementById("calcResult")!.innerText = `Result: ${result}`;
};

(window as any).toUpperCaseText = function () {
  const text = (document.getElementById("textInput") as HTMLInputElement).value;
  document.getElementById("stringResult")!.innerText = toUpper(text);
};

(window as any).toLowerCaseText = function () {
  const text = (document.getElementById("textInput") as HTMLInputElement).value;
  document.getElementById("stringResult")!.innerText = toLower(text);
};

(window as any).showDate = function () {
  document.getElementById("dateResult")!.innerText = getCurrentDate();
};