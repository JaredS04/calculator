
const calcKeys = document.querySelector('.all-buttons');
const userInput = document.querySelector('#user-input');
const calculator = document.querySelector('.calculator');
const displayResult = document.querySelector('#result');
let isEqualsPressed = false;
let equation = 0; //separate variable to calculate equation in backend
let checkForDecimal = ''; //to store each number and check if decimal is pressed

calcKeys.addEventListener('click', (event) => {

	//Check if click is on the button and not on the container
	if(!event.target.closest('button')) return;

	const key = event.target;
	const keyValue = key.textContent;
	let inputDisplay = userInput.textContent;
	const { type } = key.dataset;
	const { previousKeyType } = calculator.dataset;
		
	//If any number button is pressed
	if(type === 'number' && !isEqualsPressed) {
		/*
			- Inital screen display is 0
			- replace initial display with user input if number is pressed
			- else concat with operator
			- if screen display is anything other than number concat the display
		*/
		if (inputDisplay === '0') {
			userInput.textContent = (previousKeyType === 'operator') ? inputDisplay + keyValue : keyValue;
			equation = (previousKeyType === 'operator') ? equation + key.value : key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}else {
			//Check length so that number stays within display box
			//else replace it with exponential
			if (checkForDecimal.length >= 19) {
				var replaceNumber = checkForDecimal;
				checkForDecimal = Number(checkForDecimal).toExponential(2);
				userInput.textContent = inputDisplay.replace(replaceNumber, checkForDecimal);
			}else {
				//Check for Infinity OR NaN in Display
				userInput.textContent = userInput.textContent.includes('N') ? 'NaN' : 
										userInput.textContent.includes('I') ? 'Infinity' : inputDisplay + keyValue;
				equation = equation + key.value;
				checkForDecimal = checkForDecimal + keyValue;
			}
		}
	}

	/*
		- Check if operator is pressed AND Equals To (=) is not yet pressed
		- AND Display dose not include Infinity
		- Replace checkForDecimal with blank to store next number
	*/
	if (type === 'operator' && previousKeyType !== 'operator'
		&& !isEqualsPressed && !inputDisplay.includes('Infinity')) {
		//calculator.dataset.firstNumber = checkForDecimal;
		// calculator.dataset.operator = key.id;
		checkForDecimal = '';
		userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
		equation = equation + ' ' + key.value + ' ';

	}

	/*
		- Check if Decimal button is pressed AND Equals To (=) is not yet pressed
		- AND was a previously pressed button a number or was display a 0
		- #2 required so that if user presses decimal after operator, it is not displayed
		- check if the number already contains a decimal
	*/
	if (type === 'decimal' && (previousKeyType === 'number' || inputDisplay === '0')
		&& !isEqualsPressed && !inputDisplay.includes('Infinity')) {
		if (!checkForDecimal.includes('.')) {
			userInput.textContent = inputDisplay + keyValue;
			equation = equation + key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}
	}

	if ((type === 'backspace' || type === 'reset') && inputDisplay !== '0') {
		if (type === 'backspace' && !isEqualsPressed) {
			userInput.textContent = inputDisplay.substring(0, inputDisplay.length - 1);
			equation = equation.substring(0, equation.length - 1);
			checkForDecimal = checkForDecimal.substring(0, checkForDecimal.length - 1);
		} else {
			inputDisplay = '0';
			userInput.textContent = inputDisplay;
			displayResult.innerHTML = '&nbsp;';
			isEqualsPressed = false;
			equation = '';
			checkForDecimal = '';
		}

	}

	//Send equation for calculation after Equals To (=) is pressed
	if (type === 'equal') {
    	// Perform a calculation
	    isEqualsPressed = true;
	    const finalResult = handleEquation(equation);
	    
	    if (finalResult || finalResult === 0) {
	    	displayResult.textContent = (!Number.isInteger(finalResult)) ? finalResult.toFixed(2) : 
	    								(finalResult.toString().length >= 16) ? finalResult.toExponential(2) : finalResult ;
	    } else {
	    	displayResult.textContent = 'Math Error';
	    }
	    
  }

	calculator.dataset.previousKeyType = type;
})

//Function to calculate result based on each operator
function calculate(firstNumber, operator, secondNumber) {

	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

    if (operator === 'plus' || operator === '+') return firstNumber + secondNumber;
    if (operator === 'minus' || operator === '-') return firstNumber - secondNumber;
    if (operator === 'multiply' || operator === 'x') return firstNumber * secondNumber;
    if (operator === 'divide' || operator === '/') return firstNumber / secondNumber;
    if (operator === 'remainder' || operator === '%') return firstNumber % secondNumber;
}

function handleEquation(equation) {

	equation = equation.split(" ");
	const operators = ['/', 'x', '%', '+', '-'];
	let firstNumber;
	let secondNumber;
	let operator;
	let operatorIndex;
	let result;

	/*  
		- Perform calculations as per BODMAS Method
		- For that use operators array
		- after calculation of 1st numbers replace them with result
		- use splice method

	*/
	for (var i = 0; i < operators.length; i++) {
		while (equation.includes(operators[i])) {
			operatorIndex = equation.findIndex(item => item === operators[i]);
			firstNumber = equation[operatorIndex-1];
			operator = equation[operatorIndex];
			secondNumber = equation[operatorIndex+1];
			result = calculate(firstNumber, operator, secondNumber);
			equation.splice(operatorIndex - 1, 3, result);
		}
	}

	return result;
}

// Event Listener for keyboard button press
document.addEventListener('keydown', (event) => {
	
	let getOperators = {
		'/': 'divide',
		'x': 'multiply',
		'*': 'multiply',
		'%': 'remainder',
		'+': 'plus',
		'-': 'minus'
	}

	if(!isNaN(event.key) && event.key !== ' '){
		document.getElementById(`digit-${event.key}`).click();
	}
	if (['/', 'x', '+', '-', '*', '%'].includes(event.key)) {
		document.getElementById(getOperators[event.key]).click();
	}
	if (event.key === 'Backspace' || event.key ==='c' || event.key === 'C') {
		document.getElementById('clear').click();	
	}
	if (event.key === '=' || event.key === 'Enter') {
		document.getElementById('equals').click();	
	}
	if (event.key === '.') {
		document.getElementById('decimal').click();	
	}
});