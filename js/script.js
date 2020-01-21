(function(){

    let input = {
            firstValue:'',
            operator:'',
            secondValue:''
        },
        operationResult = '';

    function clearEvent(value)
    {
        input[value] = input[value].substring(0, input[value].length - 1);
        operationResult = '';
    }

    function dotEvent(value)
    {
        if (input[value].indexOf('.') === -1)
        {
            if (!input[value] || input[value] === '-') { input[value] += '0'; }

            input[value] += '.';
        }
    }

    function equalEvent()
    {
        if (!isNaN(parseInt(input.secondValue)))
        {
            executeOperation();
        }
    }

    function operatorEvent(value, operator)
    {
        if (!input[value])
        {
            if (operator === '-' && input.operator != '-' && !operationResult)
            {
                input[value] += '-';
            }
            else
            {
                if (value === 'firstValue')
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
            else if (!isNaN(input[value]))
            {
                input[value] = parseFloat(input[value]);
                
                if (value === 'firstValue')
                {
                    input.operator = operator;
                }
                else if (value === 'secondValue')
                {
                    executeOperation(operator);
                }
            }
        }
    }

    function executeOperation(nextOperator = '')
    {
        const operation = {
            '/': function(a, b) { return a / b; },
            '*': function(a, b) { return a * b; },
            '+': function(a, b) { return a + b; },
            '-': function(a, b) { return a - b; }
        };

        operationResult = operation[input.operator](parseFloat(input.firstValue), parseFloat(input.secondValue));
        operationResult = +(operationResult).toFixed(7);
        
        if (nextOperator)
        {
            input.firstValue = operationResult;
            operationResult = '';
            input.operator = nextOperator;
        }
        else
        {
            input.firstValue = input.operator = '';
        }

        input.secondValue = '';
    }

    function writeOnScreen()
    {
        const screen  = document.getElementById('calculatorScreen');
        let   content;
        
        if (!isNaN(parseInt(operationResult, 10)))
        {
            content = operationResult.toString();
        }
        else
        {
            let outputOperator = input.operator;

            if (outputOperator === '*')
            {
                outputOperator = '×';
            }
            else if (outputOperator === '/')
            {
                outputOperator = '÷';
            }

            content = `${input.firstValue} ${outputOperator} ${input.secondValue}`;
        }

        content.trim() ? screen.textContent = content.trim() : screen.textContent = '0';
    }

    function handleKeyAction(keyCode)
    {
        let newInput = String.fromCharCode(keyCode),
            currentValue = !input.operator ? 'firstValue' : 'secondValue';

        switch(newInput)
        {
            case 'c':
                clearEvent(currentValue);
                break;
            case '.':
                dotEvent(currentValue);
                break;
            case '=':
                equalEvent();
                break;
            case '/':
            case '*':
            case '+':
            case '-':
                operatorEvent(currentValue, newInput);
                break;
            default:
                if (!isNaN(parseInt(newInput, 10)))
                {
                    input[currentValue] += newInput;
                    operationResult = '';
                }
        }

        writeOnScreen();

        /********************* DEBUG **************************/
        let str = '';
        for (element in input) { str += `${element} : ${input[element]}\n`; }
        str += `operationResult : ${operationResult}`;
        console.log(str);
        /********************* DEBUG **************************/
    }

    const keyElts = [...document.getElementsByClassName('key')];
    
    keyElts.forEach(key =>
    {
        key.addEventListener('click', function(e)
        {
            handleKeyAction(e.target.dataset.keycode);
        });
    });

    document.addEventListener('keypress', function(e)
    {
        handleKeyAction(e.keyCode);
    });

})();