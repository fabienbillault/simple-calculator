(function(){

    let input = {
            firstValue:'',
            operator:'',
            secondValue:''
        },
        operationResult = '';

    const isNumber = value => !isNaN(parseInt(value, 10));

    /**
     * Main controller
     *
     * @param {number} keyCode Listener action code
     */
    function handleKeyAction(keyCode)
    {
        let currentValue = !input.operator ? 'firstValue' : 'secondValue',
            newInput = String.fromCharCode(keyCode);

        if (keyCode === 13) newInput = 'enter';
        if (keyCode === 8 || keyCode === 46) newInput = 'delete';

        switch(newInput)
        {
            case 'delete':
            case 'c':
                clearEvent(currentValue);
                break;
            case '.':
                dotEvent(currentValue);
                break;
            case 'enter':
            case '=':
                if (isNumber(input.secondValue)) executeOperation();
                break;
            case '/':
            case '*':
            case '+':
            case '-':
                operatorEvent(currentValue, newInput);
                break;
            default:
                if (isNumber(newInput)) numberEvent(currentValue, newInput);
        }

        writeOnScreen();

        /********************* DEBUG **************************/
        let str = '';
        for (el in input) { str += `${el} : ${input[el]}\n`; }
        str += `operationResult : ${operationResult}`;
        console.log(str);
        /********************* DEBUG **************************/
    }

    /**
     * Handles the clear action
     * 
     * @param {string} value Input in progress
     */
    function clearEvent(value)
    {
        input[value] = input[value].substring(0, input[value].length - 1);
        operationResult = '';
    }

    /**
     * Handles the dot action
     * 
     * @param {string} value Input in progress
     */
    function dotEvent(value)
    {
        if (!input[value].includes('.'))
        {
            if (!input[value] || input[value] === '-')
            {
                input[value] += '0';
                operationResult = '';
            }

            input[value] += '.';
        }
    }

    /**
     * Handles the operators action
     * 
     * @param {string} value Input in progress
     * @param {string} operator Processed value
     */
    function operatorEvent(value, operator)
    {
        if (!input[value])
        {
            if (operator === '-' && input.operator !== '-' && !operationResult)
            {
                input.operator === '+' ? input.operator = '-' : input[value] += '-';
            }
            else
            {
                if (!input.operator)
                {
                    if (operationResult)
                    {
                        input.firstValue = operationResult;
                        operationResult = '';
                    }
                    else
                    {
                        input.firstValue = '0';
                    }
                }

                input.operator = operator;
            }
        }
        else
        {
            if (input[value] === '-' && operator === '+')
            {
                input[value] = '';
            }
            else if (isNumber(input[value]))
            {
                input[value] = parseFloat(input[value]);

                input.operator ? executeOperation(operator) : input.operator = operator;
            }
        }
    }

    /**
     * Handles the numbers action
     * 
     * @param {string} value Input in progress
     * @param {string} number Processed value
     */
    function numberEvent(value, number)
    {
        if (input[value] === '0') input[value] = '';

        input[value] += number;
        operationResult = '';
    }
    
    /**
     * Execute the input operation
     * 
     * @param {string} nextOperator If the execution follows a input operator
     */
    function executeOperation(nextOperator = false)
    {
        const operation = {
            '/': (a, b) => a / b,
            '*': (a, b) => a * b,
            '+': (a, b) => a + b,
            '-': (a, b) => a - b
        };

        operationResult = +(operation[input.operator](
                                parseFloat(input.firstValue),
                                parseFloat(input.secondValue)
                          )).toFixed(7);
        
        if (nextOperator)
        {
            input.firstValue = operationResult;
            input.operator = nextOperator;
            operationResult = '';
        }
        else
        {
            input.firstValue = input.operator = '';
        }

        input.secondValue = '';
    }

    /**
     * Displays the input on the screen
     */
    function writeOnScreen()
    {
        const screen = document.getElementById('calculatorScreen');
        let   content;
        
        if (isNumber(operationResult))
        {
            content = operationResult.toString();
        }
        else
        {
            let outputOperator = input.operator;

            if (outputOperator === '*') outputOperator = '×';
            if (outputOperator === '/') outputOperator = '÷';

            content = `${input.firstValue} ${outputOperator} ${input.secondValue}`;
        }

        screen.textContent = content.trim() || '0';
    }

    // Mouse & keyboard event listeners

    const keyElts = [...document.getElementsByClassName('key')];
    
    keyElts.forEach(key =>
    {
        key.addEventListener('click', function(e)
        {
            handleKeyAction(e.target.dataset.keycode);
        });
    });

    document.addEventListener('keydown', function(e)
    {
        handleKeyAction(e.keyCode);
    });

})();