(function(){

    let lastOperationResult = 0;

    function handleKeyAction(keyCode)
    {
        const screen = document.getElementById('calculatorScreen');

        let enteredValues = [],
            choosenOperator = '';
        
        let value = String.fromCharCode(keyCode);

        if (value === 'c')
        {
            if (enteredValues)
            {
                enteredValues = [];
            }
            else
            {
                lastOperationResult = 0;
            }
        }
        else if (value === '=')
        {

        }

        console.log();
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