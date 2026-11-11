/**
 * ==============================================================================
 * Production-Ready Calculator Logic
 * ==============================================================================
 * Written by your Frontend Instructor.
 * 
 * This file avoids using the unsafe JavaScript `eval()` function. Instead, it
 * uses an explicit State Machine pattern to cleanly track:
 * 1. currentOperand  -> The number currently being entered on the screen.
 * 2. previousOperand -> The previous number entered before pressing an operator.
 * 3. operation       -> The active math symbol (+, −, ×, ÷).
 * 4. shouldResetScreen -> Flag to tell the calculator to clear the display for the next number.
 */

class Calculator {
  /**
   * @param {HTMLElement} previousOperandTextElement 
   * @param {HTMLElement} currentOperandTextElement 
   */
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  /**
   * 1. CLEAR (AC)
   * Resets all internal state variables back to their default starting values.
   */
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.updateActiveOperatorButton();
  }

  /**
   * 2. APPEND NUMBER (0-9)
   * Adds the clicked digit to the end of the current number string.
   */
  appendNumber(number) {
    // If we just clicked an operator or equals, reset the screen for the new input
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }

    // Prevent typing multiple leading zeroes (e.g., prevents "0000")
    if (this.currentOperand === '0' && number === '0') return;

    // If the display currently just shows "0", replace it with the new digit
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  /**
   * 3. APPEND DECIMAL (.)
   * Ensures only one decimal point can be added per number.
   */
  appendDecimal() {
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
    }

    // If the current number already has a dot, do not add another one (e.g. stops "5.2.1")
    if (this.currentOperand.includes('.')) return;

    // If empty or starting fresh, prefix with '0.'
    if (this.currentOperand === '') {
      this.currentOperand = '0';
    }

    this.currentOperand += '.';
  }

  /**
   * 4. TOGGLE SIGN (±)
   * Flips between positive and negative numbers.
   */
  toggleSign() {
    if (this.currentOperand === '0' || this.currentOperand === 'Error') return;

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
  }

  /**
   * 5. PERCENTAGE (%)
   * Divides the currently displayed value by 100.
   */
  computePercentage() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    // Example: 50% becomes 0.5
    this.currentOperand = this.roundAccurately(current / 100).toString();
  }

  /**
   * 6. CHOOSE OPERATOR (+, −, ×, ÷)
   * Sets the math operation to perform.
   * If both numbers are already present, it computes the intermediate result first!
   */
  chooseOperation(operation) {
    if (this.currentOperand === 'Error') return;

    // If previousOperand exists and user enters another operator, calculate intermediate result
    // Example: User types 5 + 3, then presses + again -> calculates 8, then prepares for next +
    if (this.previousOperand !== '' && !this.shouldResetScreen) {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
    this.updateActiveOperatorButton(operation);
  }

  /**
   * 7. COMPUTE (The Calculation Logic)
   * Takes previousOperand and currentOperand, parses them as numbers,
   * performs the calculation based on this.operation, and formats the output.
   */
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // If either value is not a valid number, we cannot compute
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '−':
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        // Handle division by zero error safely
        if (current === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = undefined;
          this.shouldResetScreen = true;
          this.updateActiveOperatorButton();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Rounding helper to fix JavaScript floating point inaccuracies (e.g. 0.1 + 0.2 = 0.3)
    this.currentOperand = this.roundAccurately(computation).toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
    this.updateActiveOperatorButton();
  }

  /**
   * HELPER: Fixes IEEE 754 Floating-Point Quirks
   * In standard JS: 0.1 + 0.2 equals 0.30000000000000004.
   * This helper neatly rounds to 10 decimal places to eliminate visual artifacting.
   */
  roundAccurately(num) {
    return Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  }

  /**
   * 8. FORMAT NUMBERS FOR READABILITY
   * Adds comma separators for thousands (e.g., 1,000,000).
   */
  getDisplayNumber(number) {
    if (number === 'Error') return 'Error';

    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      // Use toLocaleString() to format with regional commas
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    // Preserve the decimal part if present
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  /**
   * 9. UPDATE DISPLAY
   * Refreshes both the primary and secondary displays on the screen.
   */
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }

  /**
   * HELPER: Highlights active operator key (like on iOS)
   */
  updateActiveOperatorButton(activeOp = null) {
    const operatorButtons = document.querySelectorAll('[data-operator]');
    operatorButtons.forEach(btn => {
      if (activeOp && btn.getAttribute('data-operator') === activeOp) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }
}

/* ==============================================================================
 * DOM SELECTION & EVENT LISTENERS
 * ==============================================================================
 * Here is where we wire up our HTML buttons to the Calculator class methods.
 */
document.addEventListener('DOMContentLoaded', () => {

  // Select display elements
  const previousOperandTextElement = document.getElementById('previousOperand');
  const currentOperandTextElement = document.getElementById('currentOperand');

  // Initialize a new Calculator instance
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

  // 1. NUMBER BUTTONS (0-9)
  const numberButtons = document.querySelectorAll('[data-number]');
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.getAttribute('data-number'));
      calculator.updateDisplay();
    });
  });

  // 2. OPERATOR BUTTONS (+, −, ×, ÷)
  const operatorButtons = document.querySelectorAll('[data-operator]');
  operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.getAttribute('data-operator'));
      calculator.updateDisplay();
    });
  });

  // 3. ACTION BUTTONS (Clear, Decimal, Equals, Sign, Percent)
  const actionButtons = document.querySelectorAll('[data-action]');
  actionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');

      switch (action) {
        case 'clear':
          calculator.clear();
          break;
        case 'decimal':
          calculator.appendDecimal();
          break;
        case 'toggle-sign':
          calculator.toggleSign();
          break;
        case 'percent':
          calculator.computePercentage();
          break;
        case 'equals':
          calculator.compute();
          break;
      }

      calculator.updateDisplay();
    });
  });

  /* ============================================================================
   * BONUS: KEYBOARD SUPPORT
   * Allows typing calculations with standard physical keys on your keyboard!
   * ============================================================================
   */
  window.addEventListener('keydown', (event) => {
    const key = event.key;

    // Digits 0-9
    if (key >= '0' && key <= '9') {
      calculator.appendNumber(key);
      calculator.updateDisplay();
    }
    // Decimal point
    else if (key === '.') {
      calculator.appendDecimal();
      calculator.updateDisplay();
    }
    // Equals (Enter or =)
    else if (key === 'Enter' || key === '=') {
      event.preventDefault(); // Prevents accidental form submits or reloads
      calculator.compute();
      calculator.updateDisplay();
    }
    // Operators (+, -, *, /)
    else if (key === '+') {
      calculator.chooseOperation('+');
      calculator.updateDisplay();
    } else if (key === '-') {
      calculator.chooseOperation('−');
      calculator.updateDisplay();
    } else if (key === '*') {
      calculator.chooseOperation('×');
      calculator.updateDisplay();
    } else if (key === '/') {
      event.preventDefault(); // Prevents browser "quick find" shortcut
      calculator.chooseOperation('÷');
      calculator.updateDisplay();
    }
    // Clear (Escape key)
    else if (key === 'Escape') {
      calculator.clear();
      calculator.updateDisplay();
    }
  });

});
