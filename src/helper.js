export function numberJump(num1, num2) {
  return num2 - num1 > 1;
};

export function numberAdd1(num1, num2) {
  return num2 - 1 === num1;
};

export function sameNumber(num1, num2) {
  return num2 === num1;
};

export function lessNumber(num1, num2) {
  return num2 < num1;
};

export function checkNumberJumpOrLess(num1, num2, looseMode, ...messages) {
  if (numberJump(num1, num2)) {
    if (looseMode) {
      warn(...messages);
    }
    else {
      return messages.join(' ');
    }
  }
  if (lessNumber) {
    return messages.join(' ');
  }
};