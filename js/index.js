cryptarithmetic_conf = {
    number_operand: 2
}

function createOperandItem(){
    var id = cryptarithmetic_conf['number_operand'] + 1;
    const operandInput = document.createElement('input');
    operandInput.type = 'text';
    operandInput.name = `operand-${id}`;
    operandInput.id = `operand-${id}`;
    operandInput.placeholder = `Operand ${id}`;
    operandInput.required = true;
    operandInput.pattern = "[a-zA-Z]*";
    operandInput.classList.add('form-control');
    operandInput.oninput = function(){this.value = this.value.toUpperCase()};

    const operandCol = document.createElement('div');
    operandCol.classList.add('col-11');
    operandCol.append(operandInput);

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa', 'fa-close');

    const deleteButton = document.createElement('a');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('id', `delete-button-operand-${id}`);
    deleteButton.append(deleteIcon);


    deleteButton.addEventListener('click', (event) => deleteHandler(event, id));


    const deleteCol = document.createElement('div');
    deleteCol.classList.add('col-1');
    deleteCol.append(deleteButton);

    const rowOperand = document.createElement('div');
    rowOperand.classList.add('row', 'mb-2');
    rowOperand.setAttribute('id', `row-operand-${id}`);
    rowOperand.append(operandCol, deleteCol);

    const operands = document.getElementById('operands');
    operands.append(rowOperand);
    cryptarithmetic_conf['number_operand'] += 1;

    
}

function recreateNode(el, withChildren) {
    if (withChildren) {
      el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
}

function deleteHandler(event, id){
    const rowOperand = document.getElementById(`row-operand-${id}`);
    rowOperand.remove();
    for(let i = id+1; i <= cryptarithmetic_conf['number_operand']; i++){
        const operandInput = document.getElementById(`operand-${i}`);
        document.getElementById(`row-operand-${i}`).setAttribute('id', `row-operand-${i-1}`);
        operandInput.name = `operand-${i-1}`;
        operandInput.id = `operand-${i-1}`;
        operandInput.placeholder = `Operand ${i-1}`;
        const deleteButton = document.getElementById(`delete-button-operand-${i}`);
        deleteButton.setAttribute('id', `delete-button-operand-${i-1}`);
        recreateNode(deleteButton, true);
        document.getElementById(`delete-button-operand-${i-1}`).addEventListener('click', (event) => deleteHandler(event, i-1));
    }
    cryptarithmetic_conf['number_operand'] -= 1;
}

function findMaxLen(operandAndResult){
    var max = operandAndResult[0].length;
    for (let strop of operandAndResult){
        if(max < strop.length){
            max = strop.length;
        }
    }
    return max;
}

function getInput(){
    const operand = [];
    var result = "";
    var operandAndResult = [];
    const idxChar = {};

    for(let i=0; i < cryptarithmetic_conf['number_operand']; i++){
        operand.push(document.getElementById(`operand-${i+1}`).value);
    }
    result = document.getElementById('result').value;
    operandAndResult = operandAndResult.concat(operand);
    operandAndResult.push(result);

    maxLen = findMaxLen(operandAndResult);

    idx = 0;

    for(let i=0; i<maxLen; i++){
        for(let strop of operandAndResult){
            idxtemp = strop.length - 1 - i;
            if(idxtemp >= 0){
                if((idxChar[strop[idxtemp]] ?? -1) == -1){
                    idxChar[strop[idxtemp]] = idx;
                    idx += 1;
                }
            }
        }
    }

    return {
        'operand': operand,
        'result': result,
        'operandAndResult': operandAndResult,
        'idxChar': idxChar,
        'maxLen': maxLen
    };


}

function onSubmitHandler(event){
    event.preventDefault();
    const cryptarithmetic = new Cryptarithmetic(getInput());
    document.getElementById('result-content').innerHTML = cryptarithmetic.solve();
}

document.getElementById("add-operand-button").addEventListener("click", createOperandItem);
document.getElementById("input-form").addEventListener("submit", onSubmitHandler);