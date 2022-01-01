function cutZeros(float) {
    const reverseStringFloat = float.toString().split('').reverse();
    while(reverseStringFloat[0] === '0') {
        reverseStringFloat.shift();
    }
    if(reverseStringFloat[0] === '.') reverseStringFloat.shift();
    return parseFloat(reverseStringFloat.reverse().join(''));
}

class Calculator {
    constructor(calculationScreen, resultScreen) {
        this.calculationScreen = calculationScreen;
        this.resultScreen = resultScreen;
        this.reset = false;
    }

    getCalculationScreen() {
        return this.calculationScreen.textContent;
    }
    
    getResultScreen() {
        return this.resultScreen.textContent;
    }

    setCalculationScreen(str) {
        this.calculationScreen.textContent = str;
    }

    setResultScreen(str) {
        this.resultScreen.textContent = str;
    }
    
    append(num) {
        if(this.getResultScreen() == 'Error' || this.reset) this.setResultScreen('0');
        if(this.getResultScreen().length >= 10) return; // Max 10 digit
        if(num === '.' && this.getResultScreen().includes('.')) return;
        if(this.getResultScreen() === '0') this.setResultScreen(num === '.' ? '0' : '');
        this.resultScreen.textContent += num;
        this.reset = false;
    }

    operation(operator) {
        if(this.getCalculationScreen() !== '') this.calculate();
        this.setCalculationScreen(this.getResultScreen() === 'Error' ? '' : this.getResultScreen() + ' ' + operator);
        this.setResultScreen(this.getResultScreen() === 'Error' ? 'Error' : '0');
    }

    calculate() {
        const leftOperand = parseFloat(this.calculationScreen.textContent.split(' ')[0]);
        const operator = this.calculationScreen.textContent.split(' ')[1];
        const rightOperand = parseFloat(this.resultScreen.textContent);
        let result;
        switch(operator) {
            case '+':
                result =leftOperand + rightOperand;
                break;
            case '-':
                result = leftOperand - rightOperand;
                break;
            case '*':
            case 'x':
                result = leftOperand * rightOperand;
                break;
            case '/':
            case '÷':
                if(rightOperand === 0) {
                    this.setResultScreen('Error');
                    this.setCalculationScreen('');
                    return;
                }
                result = leftOperand / rightOperand;
                break;
            default:
                return;
        }
        this.setResultScreen(cutZeros(result.toPrecision(15)).toString().slice(0, 11));
        this.setCalculationScreen('');
        this.reset = true;
    }

    clear() {
        this.setResultScreen('0');
        this.setCalculationScreen('');
    }

    delete() {
        if(this.getResultScreen().length === 1 || this.getResultScreen() === 'Error' || this.reset) this.setResultScreen('0');
        else this.setResultScreen(this.getResultScreen().slice(0, -1));
        this.reset = false;
    }
}

const calculationScreen = document.querySelector('.calculation');
const resultScreen = document.querySelector('.result');
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const decimalButton = document.querySelector('#decimal');
const clearButton = document.querySelector('#ac');
const deleteButton = document.querySelector('#del');
const equalsButton = document.querySelector('#equals');

const calculator = new Calculator(calculationScreen, resultScreen);

numberButtons.forEach(button => {
    button.addEventListener('click', () => calculator.append(button.textContent));
});
decimalButton.addEventListener('click', () => calculator.append('.'));

operationButtons.forEach(button => {
    button.addEventListener('click', () => calculator.operation(button.textContent));
});

clearButton.addEventListener('click', () => calculator.clear());
deleteButton.addEventListener('click', () => calculator.delete());
equalsButton.addEventListener('click', () => calculator.calculate());

document.addEventListener('keydown', event => {
    if(event.key.match(/^[0-9\.]$/)) calculator.append(event.key);
    else if(event.key.match(/^[+-/x\*]$/)) calculator.operation(event.key);
    else if(event.key === 'Backspace') calculator.delete();
    else if(event.key === 'Delete') calculator.clear();
    else if(event.key === '=' || event.key === 'Enter') calculator.calculate()
});
